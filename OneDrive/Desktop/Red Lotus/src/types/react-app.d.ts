/// <reference types="react" />

declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}

declare module 'react' {
  export = React;
}

declare module 'react/jsx-runtime' {
  export namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
  export function jsx(type: any, props: any): any;
  export function jsxs(type: any, props: any): any;
}

declare module '*.JPEG' {
  const src: string;
  export default src;
}

declare module '*.jpeg' {
  const src: string;
  export default src;
}

declare module '*.png' {
  const src: string;
  export default src;
}

declare module '*.svg' {
  const src: string;
  export default src;
}