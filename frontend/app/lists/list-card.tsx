'use client';

import Link from 'next/link';

interface ListCardProps {
    label: string;
    listId: string
    onDelete: (id: string) => void;
}

export default function ListCard({ label, listId, onDelete }: ListCardProps) {

  return (
    <div>
      {label}
      <Link href={`/edit-list/${listId}`}>Edit List</Link>
      <button onClick={() => onDelete(listId)}>Delete List</button>
    </div>
  );
}