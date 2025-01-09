import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import Backend from "i18next-http-backend";

i18n.use(Backend) // passes i18n down to react-i18next
    .use(initReactI18next)
    .init({
        debug: true,
        lng: "ru",
        fallbackLng: "en",
        interpolation: {
            escapeValue: false, // react already safes from xss
        },
    });

export default i18n;
