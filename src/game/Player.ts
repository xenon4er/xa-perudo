import {RequiredFields} from "../types/common.types";

export type TPlayer = {
    id: string;
    name: string;
    dices: number[];
};

export class Player {
    id: string;
    name: string;
    dices: number[];

    constructor(player: RequiredFields<Partial<TPlayer>, "id">) {
        this.id = player.id;
        this.name = player.name ?? "";
        this.dices = player.dices ?? this.generateDices();
    }

    setDices(dices: number[]): void {
        this.dices = dices;
    }

    generateDices(): number[] {
        return Array(5).fill(0);
    }

    removeDice(): void {
        this.dices.pop();
    }

    getDicesWithNominal(nominal: number): number {
        return this.dices.reduce((res, d) => {
            if (d === nominal || d === 1) {
                res++;
            } 
            return res;
        }, 0);
    }

    doRoll(me: string): void {
        this.dices = this.dices.map(() =>
            this.id === me ? 1 + Math.floor(Math.random() * 6) : 0,
        );
    }

    getPlayer(isSecure = true): TPlayer {
        return {
            id: this.id,
            name: this.name,
            dices: this.dices.map((d) => (isSecure ? 0 : d)),
        };
    }
}
