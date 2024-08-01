import { invoke } from '@tauri-apps/api/tauri';
import { attemptAsync } from './check';


let id = 0;
export const call = <T = unknown>(event: string, payload: Record<string, unknown>) => {
    return attemptAsync(() => {
        return new Promise((res, rej) => {
            invoke('global', {
                [event]: {
                    id_: id,
                    ...payload,
                }
            })
                .catch(e => rej(e));

            socket.once(event, (data: {
                id: number;
                data: unknown
            }) => {
                if (data.id === id) {
                    res(data.data as T);
                }
            });

            id++;
        })
    });
}

const socket: any = {};