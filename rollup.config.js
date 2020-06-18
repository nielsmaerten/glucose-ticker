import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from "@rollup/plugin-json";
import copy from 'rollup-plugin-copy';

export default [
    // Bundle 1: 
    // The base JS file to run the Electron app
    {
        input: "tmp/tsc/src/electron-app/index.js",
        output: {
            file: "tmp/dist/index.js",
            format: "cjs"
        }
    },

    // Bundle 2:
    // The React webapp to enter settings
    {
        input: "tmp/tsc/src/web-app/index.js",
        output: {
            dir: "tmp/dist/html",
            format: "cjs"
        },
        plugins: [json(), commonjs(), resolve(), copy({
            targets: [
                { src: 'src/web-app/index.html', dest: 'tmp/dist/html/' }
            ]
        })],
    }
]