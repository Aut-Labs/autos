/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />
/// <reference types="react" />

// Augment JSX namespace for custom elements
declare module 'react' {
    namespace JSX {
        interface IntrinsicElements {
            'd-aut': any;
            mesh: any;
            planeGeometry: any;
            meshBasicMaterial: any;
        }
    }
}

export { };
