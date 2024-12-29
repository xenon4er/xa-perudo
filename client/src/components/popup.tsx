import { MouseEvent, ReactElement } from "react";
import styles from "./popup.module.css";

export function Popup({
    children,
    onClose,
}: {
    children: ReactElement;
    onClose: (event: MouseEvent<HTMLElement> | null) => void;
}) {
    return (
        <div className={styles.wrapper} onClick={(e) => onClose(e)}>
            <div
                className={styles.inner}
                onClick={(e) => {
                    e.stopPropagation();
                }}
            >
                {children}
            </div>
        </div>
    );
}
