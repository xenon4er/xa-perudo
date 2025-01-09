import { ChangeEvent, useMemo } from "react";
import { LANGUAGE } from "../constants/local-storage";
import i18n from "../i18n";

export function LanguageSelector() {
    const options = useMemo(() => {
        const languages = {
            en: "En",
            ru: "Рус",
        };

        return Object.entries(languages).map(([code, name]) => (
            <option key={code} value={code}>
                {name}
            </option>
        ));
    }, []);

    const handleLanguageChange = (evt: ChangeEvent<HTMLSelectElement>) => {
        const lang = evt.target.value;
        localStorage.setItem(LANGUAGE, lang);
        i18n.changeLanguage(lang);
    };

    return (
        <select
            defaultValue={i18n.language}
            onChange={(evt) => handleLanguageChange(evt)}
        >
            {options}
        </select>
    );
}
