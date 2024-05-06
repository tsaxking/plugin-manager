import * as esbuild from 'esbuild';
import esbuildSvelte from "esbuild-svelte";
import { typescript } from 'svelte-preprocess-esbuild';


esbuild.build({
    entryPoints: [
        './app/src/index.ts'
    ],
    bundle: true,
    outdir: './app/dist',
    minify: true,
    plugins: [
        esbuildSvelte({
            preprocess: [
                typescript({
                    tsconfigRaw: {
                        compilerOptions: {}
                    }
                })
            ]
        })
    ],
    logLevel: 'info',
});