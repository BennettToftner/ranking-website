'use client';

interface RankButtonProps {
    label: string;
    onClick: () => void;
}

export default function RankButton({ label, onClick }: RankButtonProps) {
  return (
    <button type="button" onClick={onClick}>
      {label}
    </button>
  );
}