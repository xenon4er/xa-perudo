import "./dice.css";
import clsx from "clsx";

export function Dice({
    side,
    className,
    type = "dot",
    onClick,
}: {
    side: number;
    className?: string,
    type?: "dot" | "number"
    onClick?: () => void;
}) {
    return (
        <div
            className={clsx("dice", className, {
                "dice--dot": type === "dot",
                "dice--number": type === "number",
            })}
            onClick={onClick}
        >
            <div className={`dice__side dice__side-${side}`}>{type === "number" && side.toString()}</div>
        </div>
    );
}
