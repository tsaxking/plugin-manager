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
            return navigator.mediaDevices
                .enumerateDevices()
                .then(devices =>
                    devices.filter(device => device.kind === 'audioinput')
                )
                .then(devices =>
                    devices.map(device => AudioInput.fetch(device))
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
            return navigator.mediaDevices
                .enumerateDevices()
                .then(devices =>
                    devices.filter(device => device.kind === 'audiooutput')
                )
                .then(devices =>
                    devices.map(device => AudioOutput.fetch(device))
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
    public static readonly cache = new Map<string, AudioInput>();
    public static fetch(device: MediaDeviceInfo) {
        if (!AudioInput.cache.has(device.deviceId)) {
            const input = new AudioInput({ device });
            AudioInput.cache.set(device.deviceId, input);
        }
        return AudioInput.cache.get(device.deviceId) as AudioInput;
    }

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
    public static readonly cache = new Map<string, AudioOutput>();
    public static fetch(device: MediaDeviceInfo) {
        if (!AudioOutput.cache.has(device.deviceId)) {
            const input = new AudioOutput({ device });
            AudioOutput.cache.set(device.deviceId, input);
        }
        return AudioOutput.cache.get(device.deviceId) as AudioOutput;
    }

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