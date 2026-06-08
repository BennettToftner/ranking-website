'use client';

import { RankingInfo } from "@/utils/utils";
import { authClient } from "@/utils/auth-client";
import { Description, Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { useState, useEffect } from "react";
import Navbar from "@/components/navbar";
import RankingCard from "./ranking-card";

export default function RankingsPage() {

    const { data: session } = authClient.useSession()

    const [rankings, setRankings] = useState<RankingInfo[]>([]);
    const [deletingRanking, setDeletingRanking] = useState<RankingInfo | null>(null);

    async function getDbRankings(userId: string): Promise<RankingInfo[]> {
        try {
            const response = await fetch(`/api/users/${userId}/rankings`, {
                method: 'GET',
                headers: {
                'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                console.error("Failed to fetch lists");
                return [];
            }

            const data = await response.json() as RankingInfo[];
            
            return data;
        } catch(error) {
            console.error("Error fetching lists:", error);
            return [];
        }
    }

    useEffect(() => {
        if (session?.user?.id) {
            getDbRankings(session.user.id).then(data => setRankings(data));
        }
    }, [session]);

    async function deleteRankingDb(listId: string): Promise<boolean> {
        try {
            const response = await fetch(`/api/rankings/${listId}`, {
                method: 'DELETE',
                headers: {
                'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                console.error("Failed to delete ranking");
                return false;
            }

            return true;

        } catch(error) {
            console.error("Error deleting ranking:", error);
            return false;
        }
    }

    function handleDelete(rankingToDelete: RankingInfo) {
        setDeletingRanking(rankingToDelete);
    }

    function confirmDelete() {
        if (!deletingRanking) {
            return;
        }

        deleteRankingDb(deletingRanking.id);
        setRankings(prevRankings => prevRankings.filter(ranking => ranking.id != deletingRanking.id));
        setDeletingRanking(null);
    }

    return (
    <div>
        <Navbar></Navbar>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4">
            {rankings.map((item) => (
                <div key={item.id}>
                    <RankingCard rankingToDisplay={item} onDelete={handleDelete}></RankingCard>
                </div>
            ))}
        </div>
        <Dialog open={deletingRanking !== null} onClose={() => setDeletingRanking(null)} className="relative z-50">
            <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
            <DialogPanel className="max-w-lg space-y-4 border bg-white p-12">
                <DialogTitle className="font-bold">Delete List</DialogTitle>
                <Description>This will delete the list "{deletingRanking?.name}"</Description>
                <p>Are you sure you want to delete this list? This action cannot be undone.</p>
                <div className="flex gap-4">
                <button onClick={() => setDeletingRanking(null)}>Cancel</button>
                <button onClick={confirmDelete}>Delete</button>
                </div>
            </DialogPanel>
            </div>
        </Dialog>
    </div>
    );
}
