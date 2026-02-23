'use client';

import { ElementList } from "@/utils/utils";
import Link from 'next/link';
import { Button } from '@headlessui/react'
import { PencilIcon, TrashIcon } from '@heroicons/react/16/solid';

interface ListCardProps {
  listToDisplay: ElementList;
  onDelete: (listToDelete: ElementList) => void;
}

export default function ListCard({ listToDisplay, onDelete }: ListCardProps) {

  return (
    <div className="rounded border-black outline m-3 w-50">
      <div className="text-xl">{listToDisplay.name}</div>
      <div className="m-3">
        <Button className="rounded bg-blue-600">
          <Link href={`/edit-list/${listToDisplay.id}`}>
            <PencilIcon className="size-8 text-white"/>
          </Link>
        </Button>
        <Button className="rounded bg-red-600 data-hover:bg-red-700" onClick={() => onDelete(listToDisplay)}>
          <TrashIcon className="size-8 text-white" />
        </Button>
      </div>
    </div>
  );
}