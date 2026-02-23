'use client';

import Link from 'next/link';

export default function Navbar() {
    return (
        <nav className="flex items-center justify-between px-10 bg-purple-900 text-white text-xl h-16">
            <Link className="" href="/">
                Home
            </Link>
            <div className="flex gap-6 font-medium">
                <Link className="" href='/lists'>My Lists</Link>
                <Link href='/edit-list/0'>New List</Link>
                <Link href='/profile'>Profile</Link>
            </div>
        </nav>
    );
}