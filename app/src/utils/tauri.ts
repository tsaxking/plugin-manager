import { invoke } from '@tauri-apps/api/tauri';


export const call = (event: string, payload: unknown) => {
    invoke('tauri', { event, payload });
}