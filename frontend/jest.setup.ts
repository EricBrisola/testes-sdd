import '@testing-library/jest-dom';

declare const globalThis: {
  TextEncoder?: unknown;
  TextDecoder?: unknown;
};

if (typeof globalThis.TextEncoder === 'undefined') {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const util = require('util');
  globalThis.TextEncoder = util.TextEncoder;
  globalThis.TextDecoder = util.TextDecoder;
}
