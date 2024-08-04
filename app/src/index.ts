import './styles/style.css';
import './styles/global.css';
import './utils/knob';
import { direct } from './utils/tauri';
import Main from './view/Main.svelte';
import { choose, prompt, select } from './utils/prompt';

(async () => {
    const isConnected = async () => (await direct<boolean>('is_connected')).unwrap();

    while (!(await isConnected())) {
        const chosen = await choose('Choose a connection method', 'Direct', 'Scan');
        if (chosen === 'Direct') {
            const ip = await prompt('Enter the IP address of the server');
            await direct('connect_to_ip', ip);
        } else if (chosen === 'Scan') {
            const devices = (await direct<string[]>('scan_devices')).unwrap();
            const chosen = await select('Choose a device', devices);
            if (chosen !== null && chosen !== -1) await direct('connect_to_device', devices[chosen]);
        }
    }

    new Main({
        target: document.body,
    });
})();