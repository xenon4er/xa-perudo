/* eslint-disable @typescript-eslint/no-explicit-any */
export const logger = {
    log: (message?: any, ...optionalParams: any[]) => {
        if (import.meta.env.DEV) {
            console.log(message, optionalParams);
        }
    },
    info: (message?: any, ...optionalParams: any[]) => {
        if (import.meta.env.DEV) {
            console.info(message, optionalParams);
        }
    },
    warn: (message?: any, ...optionalParams: any[]) => {
        if (import.meta.env.DEV) {
            console.warn(message, optionalParams);
        }
    },
};
