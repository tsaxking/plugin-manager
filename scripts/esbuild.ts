import * as esbuildServer from 'esbuild-server';
import esbuildSvelte from 'esbuild-svelte';
import esbuild from 'esbuild';
import { typescript } from 'svelte-preprocess-esbuild';
import { sassPlugin } from 'esbuild-sass-plugin';
import { BuildOptions } from 'esbuild';

const args = process.argv.map(a => a.toLowerCase());

const options: BuildOptions = {
    entryPoints: ['./app/src/index.ts'],
    bundle: true,
    outdir: './app/dist',
    minify: true,
    plugins: [
        esbuildSvelte({
            preprocess: [
                typescript({
                    tsconfigRaw: {
                        compilerOptions: {},
                    },
                }),
            ],
        }),
        sassPlugin({
            filter: /\.s[ac]ss$/,
        }),
    ],
    logLevel: 'info',
};

if (args.includes('watch')) {
    esbuildServer.createServer(options).start();
} else if (args.includes('check')) {
    esbuild
        .build(options)
        .then(() => {
            console.log('Build successful');
            process.exit(0);
        })
        .catch(e => {
            throw e;
        });
} else {
    esbuild.build(options);
}