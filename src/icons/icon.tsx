import { ReactNode } from "react";

export type IconProps = {
    fill?: string;
    width?: number;
    height?: number;
};

export function Icon({
    children,
    viewBox,
    fill,
    width,
    height,
}: IconProps & { viewBox?: string; children?: ReactNode }) {
    fill = fill ?? "currentColor";
    width = width ?? 32;
    height = height ?? 32;

    return (
        <svg
            fill={fill}
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            viewBox={viewBox}
            xmlSpace="preserve"
            width={width}
            height={height}
        >
            {children}
        </svg>
    );
}
