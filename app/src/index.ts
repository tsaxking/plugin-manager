import { Result } from "./utils/check";
import { call } from "./utils/tauri";

const log = (data: Promise<Result<unknown>>) => data.then((res) => console.log(res.unwrap()));

log(call('MyEvent', { data: 'payload' }));
log(call('Play', { channel: 5 }));
log(call('Yo', {}));