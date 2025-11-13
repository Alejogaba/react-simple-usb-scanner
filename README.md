# React Simple USB Scanner

A lightweight React library for capturing and handling the barcodes scanned by USB barcode scanners in React applications.

## Installation

```bash
npm install react-simple-usb-scanner
```

or

```bash
yarn add react-simple-usb-scanner
```

## Basic Usage

```tsx
import { useBarcodeScanner } from 'react-simple-usb-scanner';

function App() {
  const { barcode, resetBarcode } = useBarcodeScanner({
    onBarcodeScanned: async (code) => {
      console.log('Barcode scanned:', code);
    },
    enabled: true,
  });

  const handleResetBarCode = () => {
    resetBarcode();
  };

  const handleShowBarcode = () => {
    alert(`Barcode scanned: ${barcode}`);
  };

  return (
    <div>
      <h1>Barcode Scanner</h1>
      <p>Current barcode: {barcode}</p>
      <button onClick={handleShowBarcode}>Show Barcode</button>
      <button onClick={handleResetBarCode}>Reset</button>
    </div>
  );
}
```

## API Reference

### `useBarcodeScanner(options)`

The main hook for detecting barcode scanner input.

#### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `onBarcodeScanned` | `(barcode: string) => void` | `undefined` | Callback function that is executed when a valid barcode is scanned |
| `timeout` | `number` | `50` | Time in milliseconds to wait before processing the code |
| `minLength` | `number` | `4` | Minimum required length to consider a code as valid |
| `preventDefault` | `boolean` | `true` | Whether to prevent the default behavior of keys. Prevents characters from appearing in focused inputs |
| `enabled` | `boolean` | `true` | Allows dynamically enabling/disabling the scanner |
| `pauseOnInputFocus` | `boolean` | `true` | Whether the scanner should ignore keyboard input when an input element (INPUT, TEXTAREA, SELECT) is focused |

#### Return Value

The hook returns an object with the following properties:

| Property | Type | Description |
|----------|------|-------------|
| `barcode` | `string` | The current scanned barcode value |
| `isScanning` | `boolean` | Indicates whether a scan is currently in progress |
| `resetBarcode` | `() => void` | Function to clear the current barcode and reset the scanner state |

## Advanced Examples

### With Custom Timeout and Minimum Length

```tsx
const { barcode, isScanning } = useBarcodeScanner({
  onBarcodeScanned: (code) => {
    console.log('Scanned:', code);
  },
  timeout: 100,
  minLength: 8,
  preventDefault: true,
});
```

### Conditional Scanner Activation

```tsx
function App() {
  const [scannerEnabled, setScannerEnabled] = useState(false);

  const { barcode } = useBarcodeScanner({
    onBarcodeScanned: (code) => {
      console.log('Barcode:', code);
    },
    enabled: scannerEnabled,
  });

  return (
    <div>
      <button onClick={() => setScannerEnabled(!scannerEnabled)}>
        {scannerEnabled ? 'Disable' : 'Enable'} Scanner
      </button>
      <p>Scanned: {barcode}</p>
    </div>
  );
}
```

### With Input Fields

The scanner automatically pauses when input fields are focused (when `pauseOnInputFocus` is `true`), allowing users to type normally:

```tsx
function App() {
  const { barcode } = useBarcodeScanner({
    onBarcodeScanned: (code) => {
      console.log('Scanned:', code);
    },
    pauseOnInputFocus: true, // This is the default
  });

  return (
    <div>
      <input type="text" placeholder="Type here normally..." />
      <p>Last scanned barcode: {barcode}</p>
    </div>
  );
}
```

## How It Works

USB barcode scanners typically act as keyboard input devices. When a barcode is scanned, the scanner rapidly inputs each character followed by an Enter key. This library:

1. Listens for rapid keyboard input
2. Buffers the characters
3. Processes the buffer when input stops (after the specified timeout)
4. Triggers the callback with the complete barcode
5. Automatically pauses when the user is typing in input fields

## Browser Compatibility

This library works in all modern browsers that support:
- React 16.8+
- Keyboard events
- Document focus events

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Development

This template uses Vite + React + TypeScript for fast development.

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

