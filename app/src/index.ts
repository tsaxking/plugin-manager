import './styles/style.css';
import './styles/global.css';
import './utils/knob';
import { direct } from './utils/tauri';
import Main from './view/Main.svelte';
import { prompt, select } from './utils/prompt';


(async () => {
    const isConnected = async () => (await direct<boolean>('is_connected')).unwrap();

    while (!(await isConnected())) {
        const ips = (await direct<string[]>('find_connections')).unwrap();
        const selected = await select('Select an IP, or ignore for a custom ip', ips);
        let ip: string;
        if (selected === null || selected === -1) {
            const d = await prompt('Enter the IP of the server');
            if (d === null) return;
            ip = d;
        } else {
            ip = ips[selected];
        }
    
        await direct('connect_to_ip', ip);
    }

    new Main({
        target: document.body,
    });
})();