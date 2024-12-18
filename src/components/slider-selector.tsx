import { ReactElement, useCallback, useEffect, useRef, useState, cloneElement } from "react";
import clsx from "clsx";

import "./slider-selector.css";

// https://stackoverflow.com/questions/75833107/click-and-drag-to-scroll-with-mouse-react-typescript-component

export function SliderSelector({
    selectedIdx,
    children,
    readonly,
    onChange,
    isInvalid,
}: {
    selectedIdx: number;
    children: ReactElement[];
    readonly: boolean;
    onChange?: (selectedIdx: number) => void;
    isInvalid?: boolean;
}) {

    const [selected, setSelected] = useState(selectedIdx);
    const [left, setLeft] = useState(0);
    const [isMouseDown, setIsMouseDown] = useState(false);
    const [center, setCenter] = useState({
        x: 0,
        y: 0,
    });
    const sliderRef = useRef<HTMLDivElement>(null);
    const innerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!sliderRef.current) {
            return;
        }
        const boundRect = sliderRef.current.getBoundingClientRect();
        setCenter({
            x: boundRect.x + boundRect.width / 2,
            y: boundRect.y + boundRect.height / 2,
        });
    }, []);

    const moveToTheEl = useCallback(() => {
        if (!innerRef.current) {
            return;
        }

        const el = innerRef.current.children[selected]?.getBoundingClientRect();

        if (!el) {
            return;
        }

        setLeft((l) => l + center.x - el.left - el.width / 2);
    }, [selected, center]);

    useEffect(() => {
        if (!isMouseDown) {
            moveToTheEl();
        }
    }, [moveToTheEl, isMouseDown]);

    const handleDown = useCallback(() => {
        if (readonly) {
            return;
        }
        setIsMouseDown(true);
    }, [readonly]);

    useEffect(() => {
        const el = sliderRef.current;
        if (el) {
            el.addEventListener("pointerdown", handleDown);
            return () => el.removeEventListener("pointerdown", handleDown);
        }
    }, [handleDown]);

    const handleMove = useCallback(
        (e: MouseEvent) => {
            if (!isMouseDown || !innerRef.current) {
                return;
            }

            setLeft((left) => left + e.movementX * 1.5);

            let closestX = Number.MAX_SAFE_INTEGER;
            let selected = null;
            let idx = 0;
            for (const item of innerRef.current.children) {
                const rect = item.getBoundingClientRect();
                const rectDist = {
                    x: Math.abs(rect.x + rect.width / 2 - center.x),
                    y: Math.abs(rect.y + rect.height / 2 - center.y),
                };
                if (rectDist.x <= closestX) {
                    closestX = rectDist.x;
                    selected = idx;
                }
                idx++;
            }

            if (selected !== null) {
                setSelected(selected);
            }
        },
        [isMouseDown, center],
    );

    useEffect(() => {
        const el = sliderRef.current;
        if (el) {
            el.addEventListener("pointermove", handleMove);
            return () => el.removeEventListener("pointermove", handleMove);
        }
    }, [handleMove]);

    const handleUp = useCallback(() => {
        if (!isMouseDown) {
            return;
        }
        onChange?.(selected);
        setIsMouseDown(false);

        moveToTheEl();
    }, [selected, onChange, isMouseDown, moveToTheEl]);

    useEffect(() => {
        const el = sliderRef.current;
        if (el) {
            el.addEventListener("pointerup", handleUp);
            el.addEventListener("pointerleave", handleUp);
            return () => {
                el.removeEventListener("pointerup", handleUp);
                el.removeEventListener("pointerleave", handleUp);
            };
        }
    }, [handleUp]);

    return (
        <div className="slider-selector" ref={sliderRef}>
            <div
                className="slider-selector__inner"
                ref={innerRef}
                style={{
                    left: left,
                }}
            >
                {children.map((el, idx) => cloneElement(el, {
                    key: idx,
                    className: clsx(el.props.className, "slider-selector__item", {
                        _active: idx === selectedIdx,
                        _highlight: idx === selected,
                        _invalid: isInvalid,
                    }),
                }))}
            </div>
        </div>
    );
}
