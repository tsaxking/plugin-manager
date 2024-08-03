<script lang="ts">
import { onDestroy } from "svelte";


    let canvas: HTMLCanvasElement;

    export let audio: AudioNode | undefined;
    let running = true;
    const stop = () => running = false;

    $: {
        if (audio) {
            try {
                running = true;
                const ctx = canvas.getContext('2d');
                if (!ctx) throw new Error('Could not get canvas context');
                const analyser = new AnalyserNode(audio.context, { fftSize: 256 });
                audio.connect(analyser);
                const bufferLength = analyser.frequencyBinCount;
                const dataArray = new Uint8Array(bufferLength);
                const width = canvas.width;
                const height = canvas.height;
                const barWidth = width / bufferLength;
                let x = 0;

                const draw = () => {
                    if (!running) return;
                    requestAnimationFrame(draw);
                    analyser.getByteFrequencyData(dataArray);
                    ctx.clearRect(0, 0, width, height);
                    for (let i = 0; i < bufferLength; i++) {
                        const barHeight = dataArray[i] / 2;
                        ctx.fillStyle = `rgb(${barHeight + 100},50,50)`;
                        ctx.fillRect(x, height - barHeight, barWidth, barHeight);
                        x += barWidth + 1;
                    }
                    x = 0;
                };

                draw();
            } catch (e) {
                console.warn(e);
            }
        }
    }

    onDestroy(() => {
        stop();
    });
</script>

<canvas
    bind:this={canvas}
    class="meter"
    width="150"
    height="12"
></canvas>