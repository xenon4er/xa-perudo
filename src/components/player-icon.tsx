import { CatSvg } from "../icons/cat";
import { ChickenSvg } from "../icons/chicken";
import { CobraSvg } from "../icons/cobra";
import { DuckSvg } from "../icons/duck";
import { ElephantSvg } from "../icons/elephant";
import { FishSvg } from "../icons/fish";
import { JellyfishSvg } from "../icons/jellyfish";
import { RabbitSvg } from "../icons/rabbit";
import { SpiderSvg } from "../icons/spider";
import { SquirrelSvg } from "../icons/squirrel";
import { TurtleSvg } from "../icons/turtle";

type Icon =
    | "cat"
    | "chicken"
    | "cobra"
    | "duck"
    | "elephant"
    | "fish"
    | "jellyfish"
    | "rabbit"
    | "spider"
    | "squirrel"
    | "turtle";

const iconByIdx: Record<string, Icon> = {
    "0": "cat",
    "1": "chicken",
    "2": "cobra",
    "3": "duck",
    "4": "elephant",
    "5": "fish",
    "6": "jellyfish",
    "7": "rabbit",
    "8": "spider",
    "9": "squirrel",
    "10": "turtle",
};

export function PlayerIcon({ icon, idx }: { icon?: Icon; idx?: string }) {
    if (
        !icon &&
        (idx === null || typeof idx === "undefined" || !iconByIdx[idx])
    ) {
        return <>No Svg</>;
    }

    const _icon = icon || iconByIdx[idx!];

    switch (_icon) {
        case "cat":
            return <CatSvg />;
        case "chicken":
            return <ChickenSvg />;
        case "cobra":
            return <CobraSvg />;
        case "duck":
            return <DuckSvg />;
        case "elephant":
            return <ElephantSvg />;
        case "fish":
            return <FishSvg />;
        case "jellyfish":
            return <JellyfishSvg />;
        case "rabbit":
            return <RabbitSvg />;
        case "spider":
            return <SpiderSvg />;
        case "squirrel":
            return <SquirrelSvg />;
        case "turtle":
            return <TurtleSvg />;
    }
    return <></>;
}
