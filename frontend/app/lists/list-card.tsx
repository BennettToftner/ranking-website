'use client';

interface ListCardProps {
    label: string;
    listId: string
}

export default function ListCard({ label, listId }: ListCardProps) {
  return (
    <div>
      {label}
      <a href={`/edit-list/${listId}`}>Edit List</a>
      <button>Delete List</button>
    </div>
  );
}