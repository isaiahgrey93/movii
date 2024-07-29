declare global {
  interface Window {
    process: {
      env: Record<string, string>;
    };
  }
}

/// <reference types="@remix-run/dev" />
/// <reference types="@remix-run/node/globals" />
