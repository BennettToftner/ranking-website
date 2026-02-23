'use client';

import { deleteListById, Element, ElementList, getStoredLists } from "@/utils/utils";
import ListCard from "./list-card";
import { useState, useEffect } from "react";
import Link from 'next/link';

export default function ListsPage() {

    const [rankLists, setRankLists] = useState<ElementList[]>([]);

    useEffect(() => {
        setRankLists(getStoredLists());
    }, []);

    function handleDelete(id:string) {
        deleteListById(id);
        setRankLists(prevList => prevList.filter(list => list.id != id));
    }

    return (
    <div>
        <Link href="/edit-list/0">New List</Link>
        <ul>
        {rankLists.map((item) => (
            <li key={item.id}>
                <ListCard label={item.name} listId={item.id} onDelete={handleDelete}></ListCard>
            </li>
        ))}
        </ul>
    </div>
    );
}
