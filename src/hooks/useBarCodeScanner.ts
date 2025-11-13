// hooks/useBarcodeScanner.ts
import { useState, useEffect, useRef, useCallback } from 'react';
import { useActiveElementTag } from './useActiveElementTag';

interface UseBarcodeScanner {
  barcode: string;
  isScanning: boolean;
  /**
   * Function to clear the current barcode.
   * Resets the scanner state.
   */
  resetBarcode: () => void;
}

interface UseBarcodeOptions {
  /**
   * Callback function that is executed when a valid barcode is scanned.
   */
  onBarcodeScanned?: (barcode: string) => void;

  /**
   * Time in milliseconds to wait before processing the code.
   */
  timeout?: number;

  /**
   * Minimum required length to consider a code as valid.
   */
  minLength?: number;

  /**
   * Whether to prevent the default behavior of keys.
   * Prevents characters from appearing in focused inputs.
   */
  preventDefault?: boolean;

  /**
   * Allows dynamically enabling/disabling the scanner.
   */
  enabled?: boolean;

  /**
   * Whether the scanner should ignore keyboard input when an input element
   * (INPUT, TEXTAREA, SELECT) is focused.
   * @default true
   */
  pauseOnInputFocus?: boolean;
}

export const useBarcodeScanner = (
  options: UseBarcodeOptions = {}
): UseBarcodeScanner => {
  const {
    onBarcodeScanned,
    timeout = 50,
    minLength = 4,
    preventDefault = true,
    enabled = true,
    pauseOnInputFocus = true
  } = options;

  const [barcode, setBarcode] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const timeoutRef = useRef<number | null>(null);
  const scannedCodeBuffer = useRef<string[]>([]);

  // Use the hook to detect the currently focused element globally
  const activeElementTag = useActiveElementTag();

  const resetBarcode = useCallback(() => {
    setBarcode('');
    scannedCodeBuffer.current = [];
  }, []);

  const processBarcode = useCallback(() => {
    const finalBarcode = scannedCodeBuffer.current.join('');

    if (finalBarcode.length >= minLength) {
      setBarcode(finalBarcode);
      setIsScanning(true);

      if (onBarcodeScanned) {
        onBarcodeScanned(finalBarcode);
      }
    }

    scannedCodeBuffer.current = [];
    setTimeout(() => setIsScanning(false), 50);
  }, [onBarcodeScanned, minLength]);

  useEffect(() => {
    if (!enabled) {
      resetBarcode();
      return;
    }

    // Determine if the scanner should be paused due to a focused input
    let shouldPauseDueToInput = false;
    if (pauseOnInputFocus) {
      // If the focused element is an INPUT, TEXTAREA or SELECT
      if (activeElementTag) {
        const isCommonInput = ['INPUT', 'TEXTAREA', 'SELECT'].includes(
          activeElementTag
        );
        shouldPauseDueToInput = isCommonInput;
      }
    }

    if (shouldPauseDueToInput) {
      resetBarcode();
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      // Only process valid characters
      if (
        event.key.length === 1 &&
        !['Shift', 'Control', 'Alt', 'Meta', 'Tab', 'CapsLock'].includes(
          event.key
        )
      ) {
        // If preventDefault is enabled, prevent the character from appearing in inputs
        if (preventDefault) {
          event.preventDefault();
        }

        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        scannedCodeBuffer.current.push(event.key);

        timeoutRef.current = window.setTimeout(processBarcode, timeout);
      }
    };

    // Attach the listener only if the scanner is not paused
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [
    enabled,
    preventDefault,
    timeout,
    processBarcode,
    activeElementTag,
    pauseOnInputFocus
  ]);

  return {
    barcode,
    isScanning,
    resetBarcode
  };
};
