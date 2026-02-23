'use client';

import { RankItem, RankItemList, getStoredLists } from "@/utils/utils";
import { useState, useEffect } from "react";
import ListCard from "./list-card";

export default function ListsPage() {

    const [rankLists, setRankLists] = useState<RankItemList[]>([]);

    useEffect(() => {
        setRankLists(getStoredLists());
    }, []);

    return (
    <div>
        <ul>
        {rankLists.map((item, index) => (
            <li key={item.id}>
                <ListCard label={item.name}></ListCard>
            </li>
        ))}
        </ul>
    </div>
    );
}
