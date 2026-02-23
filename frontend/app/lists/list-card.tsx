'use client';

interface ListCardProps {
    label: string;
}

export default function ListCard({ label }: ListCardProps) {
  return (
    <div>
      {label}
    </div>
  );
}