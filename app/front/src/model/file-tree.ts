import { attemptAsync, Result } from "../utils/check";

export interface TreeItem {
    name: string;

    remove(): Promise<Result<unknown>>;
    rename(name: string): Promise<Result<unknown>>;
    move(target: TreeDir): Promise<Result<unknown>>;
}


export class TreeDir implements TreeItem {
    constructor(public name: string, public parent?: TreeDir) {
    }

    public children: TreeItem[] = [];

    public async remove() {
        return attemptAsync(async () => {
            for (const child of this.children) {
                await child.remove();
            }
            if (this.parent) {
                this.parent.children = this.parent.children.filter(child => child !== this);
            }
        });
    }

    public async rename(name: string) {
        return attemptAsync(async () => {
            this.name = name;
        });
    }

    public async move(target: TreeDir) {
        return attemptAsync(async () => {
            if (this.has(target)) throw new Error('Cannot create a circular reference');
            target.children.push(this);
            this.parent = target;
        });
    }

    has(item: TreeItem): boolean {
        return this.children.includes(item) || this.children.some(child => {
            return child instanceof TreeDir && child.has(item);
        });
    }
}

export class TreeFile implements TreeItem {
    constructor(public name: string, public parent?: TreeDir) {
    }

    public async remove() {
        return attemptAsync(async () => {
            console.log('Removing file', this.name);
            if (this.parent) {
                this.parent.children = this.parent.children.filter(child => child !== this);
            }
        });
    }

    public async rename(name: string) {
        return attemptAsync(async () => {
            this.name = name;
        });
    }

    public async move(target: TreeDir) {
        return attemptAsync(async () => {
            target.children.push(this);
            this.parent = target;
        });
    }
}