'use client';

import { Element, ElementList, getStoredLists } from "@/utils/utils";
import { useState, useEffect } from "react";
import ListCard from "./list-card";

export default function ListsPage() {

    const [rankLists, setRankLists] = useState<ElementList[]>([]);

    useEffect(() => {
        setRankLists(getStoredLists());
        console.log(rankLists);
    }, []);

    return (
    <div>
        <ul>
        {rankLists.map((item) => (
            <li key={item.id}>
                <ListCard label={item.name}></ListCard>
            </li>
        ))}
        </ul>
    </div>
    );
}
