'use client';

import { deleteListById, getLocalLists, ListInfo } from "@/utils/utils";
import { authClient } from "@/utils/auth-client"
import ListCard from "./list-card";
import { Description, Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { useState, useEffect } from "react";
import Navbar from "@/components/navbar";

export default function ListsPage() {

    const { data: session } = authClient.useSession()

    const [rankLists, setRankLists] = useState<ListInfo[]>([]);
    const [deletingList, setDeletingList] = useState<ListInfo | null>(null);

    async function getDbLists(userId: string): Promise<ListInfo[]> {
        try {
            const response = await fetch(`/api/list/user/${userId}`, {
                method: 'GET',
                headers: {
                'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                console.error("Failed to fetch lists");
                return [];
            }

            const data = await response.json() as ListInfo[];
            
            return data;
        } catch(error) {
            console.error("Error fetching lists:", error);
            return [];
        }
    }

    useEffect(() => {
        if (session?.user?.id) {
            getDbLists(session.user.id).then(data => setRankLists(data));
        }
    }, [session]);

    async function deleteListDb(listId: string): Promise<boolean> {
        try {
            const response = await fetch(`/api/list/${listId}`, {
                method: 'DELETE',
                headers: {
                'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                console.error("Failed to delete list");
                return false;
            }

            return true;

        } catch(error) {
            console.error("Error deleting list:", error);
            return false;
        }
    }

    function handleDelete(listToDelete: ListInfo) {
        setDeletingList(listToDelete);
    }

    function confirmDelete() {
        if (!deletingList) {
            return;
        }

        deleteListDb(deletingList.id);
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
