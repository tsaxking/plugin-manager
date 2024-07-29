import { attemptAsync } from '../utils/check';
import { Channel } from './channel';

export class AudioIO {
    public static getAvailableInputs() {
        return attemptAsync(async () => {
            return (await AudioIO.getInputs()).unwrap().filter(o => !o.inUse);
        });
    }

    public static getInputs() {
        return attemptAsync(async () => {
            if (AudioInput.cache.length) return AudioInput.cache;
            return navigator.mediaDevices
                .enumerateDevices()
                .then(devices =>
                    devices.filter(device => device.kind === 'audioinput')
                )
                .then(devices =>
                    devices.map(device => {
                        const d = new AudioInput({
                            device,
                        });
                        AudioInput.cache.push(d);
                        return d;
                    })
                );
        });
    }

    public static getAvailableOutputs() {
        return attemptAsync(async () => {
            return (await AudioIO.getOutputs()).unwrap().filter(o => !o.inUse);
        });
    }

    public static getOutputs() {
        return attemptAsync(async () => {
            if (AudioOutput.cache.length) return AudioOutput.cache;
            return navigator.mediaDevices
                .enumerateDevices()
                .then(devices =>
                    devices.filter(device => device.kind === 'audiooutput')
                )
                .then(devices =>
                    devices.map(device => {
                        const d = new AudioOutput({
                            device,
                        });
                        AudioOutput.cache.push(d);
                        return d;
                    })
                );
        });
    }

    public channel?: Channel;
    public readonly device: MediaDeviceInfo;

    constructor(data: { device: MediaDeviceInfo }) {
        this.device = data.device;
    }

    get id() {
        return this.device.deviceId;
    }

    get name() {
        return this.device.label;
    }

    get inUse() {
        return !!this.channel;
    }

    release() {
        this.channel = undefined;
    }

    getStream() {
        return attemptAsync(async () => {
            return navigator.mediaDevices.getUserMedia({
                audio: {
                    deviceId: this.id,
                },
            });
        });
    }
}

export class AudioInput extends AudioIO {
    public static readonly cache: AudioInput[] = [];

    use(channel: Channel) {
        return attemptAsync(async () => {
            const input = (await channel.getInput()).unwrap();
            if (input)
                throw new Error(
                    `Channel ${channel.name} already has an input, it must be released first`
                );
            if (this.inUse)
                throw new Error(
                    `Input already in use with channel ${this.channel?.name}`
                );
            this.channel = channel;
        });
    }
}

export class AudioOutput extends AudioIO {
    public static readonly cache: AudioOutput[] = [];

    use(channel: Channel) {
        return attemptAsync(async () => {
            const output = (await channel.getOutput()).unwrap();
            if (output)
                throw new Error(
                    `Channel ${channel.name} already has an output, it must be released first`
                );
            if (this.inUse)
                throw new Error(
                    `Output already in use with channel ${this.channel?.name}`
                );
            this.channel = channel;
        });
    }
}