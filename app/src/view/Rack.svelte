<script lang="ts">
  import { RackItem } from "../model/rack-item";
    import FacePlate from "./RackItem.svelte";
import RackImage from "./RackBackground.svelte";
  import { Random } from "../utils/math";
  import { Cable } from "../model/cable";
  import { Instrument } from "../model/items/processors/instrument";
  import { Controller } from "../model/items/processors/midi-controller";
  import { Oscillator } from "../model/items/processors/oscillator";
  import { Compressor } from "../model/items/processors/compressor";
  import { Reverb } from "../model/items/processors/reverb";
    import { AudioOutput } from "../model/items/processors/audio-output";

const midiInput = new Instrument(
    Random.uuid(),
    'Keystation 88 Pro',
    ['MIDI In'],
    ['MIDI Out'],
);

const controller = new Controller(
    Random.uuid(),
    'ASDR',
    ['MIDI In'],
    ['Volume', 'Pitch', 'Modulation'],
);

const oscillator = new Oscillator(
    Random.uuid(),
    'Sine',
    ['Volume', 'Pitch', 'Modulation']
);

const compressor = new Compressor(
    Random.uuid(),
    'Compressor',
);

const reverb = new Reverb(
    Random.uuid(),
    'Concert Hall',
);

const output = new AudioOutput(
    Random.uuid(),
    'Main Out',
    ['Left', 'Right'],
);

output.move(32, 0);
reverb.move(16, 0);
compressor.move(12, 0);
oscillator.move(8, 1);
controller.move(4, 1);

midiInput.io.midi.outputs[0].connect(controller.io.midi.inputs[0]);
controller.io.control.outputs[0].connect(oscillator.io.control.inputs[0]);
controller.io.control.outputs[1].connect(oscillator.io.control.inputs[1]);
controller.io.control.outputs[2].connect(oscillator.io.control.inputs[2]);
oscillator.io.audio.outputs[0].connect(compressor.io.audio.inputs[0]);
compressor.io.audio.outputs[0].connect(reverb.io.audio.inputs[0]);
reverb.io.audio.outputs[0].connect(output.io.audio.inputs[0]);
reverb.io.audio.outputs[1].connect(output.io.audio.inputs[1]);


Cable.view();
</script>

<RackImage x={200} y={3}/>

<FacePlate item={midiInput} />
<FacePlate item={controller} />
<FacePlate item={oscillator} />
<FacePlate item={reverb} />
<FacePlate item={compressor} />
<FacePlate item={output} />