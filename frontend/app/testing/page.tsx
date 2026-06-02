'use client';

import Navbar from "@/components/navbar";
import { useState } from "react";

export default function Testing() {

    const [inputId, setInputId] = useState<string>("");

    async function getLists(userId: string) {
        const response = await fetch(`/api/list/user/${userId}`, {
            method: 'GET',
            headers: {
            'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
    }

    return (
    <div>
        <Navbar></Navbar>
        <input 
            type="text" 
            value={inputId}
            placeholder="Type something..."
            onChange={(e) => setInputId(e.target.value)} 
        />
        <button onClick={() => getLists(inputId)}>Click to send request</button>
    </div>
    );
}
