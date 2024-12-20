// import { Player } from "../components/player";
// import { RequiredFields } from "../types/common.types";

// export type Player = {
//     id: string;
//     name: string;
//     dices: number[];
//     color: string;
// };

// function generateDices(): number[] {
//     return [0, 0];
// }

// export function roll(count: number): number[] {
//     return Array(count)
//         .fill(0)
//         .map(() => 1 + Math.floor(Math.random() * 6));
// }

// export function getDicesWithCount(dices: number[], nominal: number): number {
//     return dices.reduce((res, d) => {
//         if (d === nominal || d === 1) {
//             res++;
//         }
//         return res;
//     }, 0);
// }

// export function createPlayer(
//     player: RequiredFields<Partial<Player>, "id">,
// ): Player {
//     return {
//         id: player.id,
//         color: player.color ?? "",
//         dices: player.dices ?? generateDices(),
//         name: player.name ?? "",
//     };
// }
