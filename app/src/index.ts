import './styles/style.css';
import './styles/global.css';
import Mixer from "./view/Mixer.svelte";
import './utils/knob';

new Mixer({
    target: document.body
});