import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import Backend from "i18next-http-backend";
import { LANGUAGE } from "./constants/local-storage";

const DEFAULT_LNG = import.meta.env.VITE_DEFAULT_LANG;

i18n.use(Backend) // passes i18n down to react-i18next
    .use(initReactI18next)
    .init({
        debug: import.meta.env.DEV,
        lng: localStorage.getItem(LANGUAGE) || DEFAULT_LNG,
        fallbackLng: DEFAULT_LNG,
        interpolation: {
            escapeValue: false, // react already safes from xss
        },
    });

export default i18n;
