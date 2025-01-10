import { useEffect, useMemo, useState } from "react";
import { logger } from "../utils/logging";

type InfoResponse = Partial<{
    ul: InfoResponse[];
    li: string;
}>;

export function InfoPanel() {
    const [info, setInfo] = useState<InfoResponse>({});

    const fetchInfo = async () => {
        try {
            const url = "/rules.json";
            const response = await fetch(url);
            const data = await response.json();
            setInfo(data);
        } catch (error) {
            logger.error(error);
        }
    };

    const list = useMemo(() => {
        const getList = (data: InfoResponse, lvl: number = 0) => {
            return data.ul ? (
                <ul>
                    {data.ul.map((v, idx) => {
                        const ul = v.ul ? getList(v, lvl + 1) : <></>;
                        if (v.li) {
                            return (
                                <li key={`${lvl}_${idx}`}>
                                    {v.li}
                                    {ul}
                                </li>
                            );
                        }
                        return ul;
                    })}
                </ul>
            ) : (
                <></>
            );
        };
        return getList(info);
    }, [info]);

    useEffect(() => {
        fetchInfo();
    }, []);

    return <>{list}</>;
}
