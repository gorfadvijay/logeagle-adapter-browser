import babel from 'rollup-plugin-babel';
import { terser } from 'rollup-plugin-terser';

export default {
    input: 'src/index.js',
    output: {
        file: 'dist/logeagle-adapter-browser.js',
        format: 'iife',
        name: 'logeagle'
    },
    plugins: [
        babel({
            extensions: ['.js'],
            exclude: ['node_modules/@babel/**', 'node_modules/core-js/**']
        }),
        terser()
    ]
};