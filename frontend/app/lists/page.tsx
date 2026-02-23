'use client';

import { deleteListById, ElementList, getStoredLists } from "@/utils/utils";
import { authClient } from "@/utils/auth-client"
import ListCard from "./list-card";
import { Description, Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { useState, useEffect } from "react";
import Navbar from "@/components/navbar";

export default function ListsPage() {

    const { data: session } = authClient.useSession()

    const [rankLists, setRankLists] = useState<ElementList[]>([]);
    const [deletingList, setDeletingList] = useState<ElementList | null>(null);

    useEffect(() => {
        if (session) {
            console.log(session.user.id);
        }
        setRankLists(getStoredLists());
    }, []);

    function handleDelete(listToDelete: ElementList) {
        setDeletingList(listToDelete);
    }

    function confirmDelete() {
        if (!deletingList) {
            return;
        }

        deleteListById(deletingList.id);
        setRankLists(prevList => prevList.filter(list => list.id != deletingList.id));
        setDeletingList(null);
    }

    return (
    <div>
        <Navbar></Navbar>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4">
            {rankLists.map((item) => (
                <div key={item.id}>
                    <ListCard listToDisplay={item} onDelete={handleDelete}></ListCard>
                </div>
            ))}
        </div>
        <Dialog open={deletingList !== null} onClose={() => setDeletingList(null)} className="relative z-50">
            <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
            <DialogPanel className="max-w-lg space-y-4 border bg-white p-12">
                <DialogTitle className="font-bold">Delete List</DialogTitle>
                <Description>This will delete the list "{deletingList?.name}"</Description>
                <p>Are you sure you want to delete this list? This action cannot be undone.</p>
                <div className="flex gap-4">
                <button onClick={() => setDeletingList(null)}>Cancel</button>
                <button onClick={confirmDelete}>Delete</button>
                </div>
            </DialogPanel>
            </div>
        </Dialog>
    </div>
    );
}
