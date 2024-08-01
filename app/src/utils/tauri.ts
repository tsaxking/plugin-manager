import { invoke } from '@tauri-apps/api/tauri';
import { attemptAsync } from './check';


export const call = (event: string, payload: Record<string, unknown>) => {
    return attemptAsync(async () => {
        return await invoke('global', {
            data: {
                [event]: payload,
            }
        });
    });
}