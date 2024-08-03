export class Preferences {
    private static emit(event: string, data: unknown) {
        window.dispatchEvent(new CustomEvent(event, { detail: data }));
    }

    private static _sampleRate = 44100;
    private static _bufferSize = 512;

    public static get sampleRate() {
        return Preferences._sampleRate;
    }

    public static set sampleRate(value) {
        Preferences._sampleRate = value;
        Preferences.emit('sample-rate', value);
    }

    public static get bufferSize() {
        return Preferences._bufferSize;
    }

    public static set bufferSize(value) {
        Preferences._bufferSize = value;
        Preferences.emit('buffer-size', value);
    }
}