
export type io = {
    midi: [number, number];
    audio: [number, number];
    cv: [number, number];
};


export class IO {
    public readonly inputs: number[];
    public readonly outputs: number[];
    
    constructor(
        public readonly type: 'midi' | 'audio' | 'cv',
        inputs: number,
        outputs: number,
    ) {
        this.inputs = Array.from({ length: inputs});
        this.outputs = Array.from({ length: outputs});
    }
}