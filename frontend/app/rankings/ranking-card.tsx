'use client';

import { RankingInfo } from "@/utils/utils";
import Link from 'next/link';
import { Button } from '@headlessui/react'
import { PlusIcon, TrashIcon } from '@heroicons/react/16/solid';

interface RankingCardProps {
  rankingToDisplay: RankingInfo;
  onDelete: (rankingToDelete: RankingInfo) => void;
}

export default function RankingCard({ rankingToDisplay, onDelete }: RankingCardProps) {

  return (
    <div className="rounded border-black outline m-3 w-50">
      <div className="text-xl text-center truncate">{rankingToDisplay.name}</div>
      <div className="text-xl text-center truncate">Finished? {rankingToDisplay.rank_data.isSorted}</div>
      <div className="mx-4 flex justify-center gap-6">
        <Button className="rounded bg-green-600 data-hover:bg-green-700">
          <Link href={`/rank/${rankingToDisplay.list_id}/${rankingToDisplay.id}`}>
            <PlusIcon className="size-8 text-white"/>
          </Link>
        </Button>
        <Button className="rounded bg-red-600 data-hover:bg-red-700 cursor-pointer" onClick={() => onDelete(rankingToDisplay)}>
          <TrashIcon className="size-8 text-white" />
        </Button>
      </div>
    </div>
  );
}