'use client';

interface ListCardProps {
    label: string;
    listId: string
    onDelete: (id: string) => void;
}

export default function ListCard({ label, listId, onDelete }: ListCardProps) {

  return (
    <div>
      {label}
      <a href={`/edit-list/${listId}`}>Edit List</a>
      <button onClick={() => onDelete(listId)}>Delete List</button>
    </div>
  );
}