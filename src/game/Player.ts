export class Player {
    id: string;
    name: string;
    dices: number[];

    constructor(id: string, name?: string) {
        this.id = id;
        this.name = name ?? "";
        this.dices = this.generateDices();
    }

    generateDices(): number[] {
        return Array(6).fill(0);
    }

    removeDice(): void {
        this.dices.pop();
    }

    doRoll(me: string): void {
        this.dices = this.dices.map(() =>
            this.id === me ? 1 + Math.floor(Math.random() * 6) : 0,
        );
    }
}
