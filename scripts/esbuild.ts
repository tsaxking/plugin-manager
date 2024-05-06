import * as esbuildServer from 'esbuild-server';
import esbuildSvelte from "esbuild-svelte";
import { typescript } from 'svelte-preprocess-esbuild';

esbuildServer
    .createServer(
        {
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
        }
    )
    .start();