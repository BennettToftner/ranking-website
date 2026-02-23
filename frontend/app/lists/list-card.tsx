'use client';

import { ElementList } from "@/utils/utils";
import Link from 'next/link';
import { Button } from '@headlessui/react'
import { TrashIcon } from '@heroicons/react/16/solid';

interface ListCardProps {
  listToDisplay: ElementList;
  onDelete: (listToDelete: ElementList) => void;
}

export default function ListCard({ listToDisplay, onDelete }: ListCardProps) {

  return (
    <div>
      {listToDisplay.name}
      <Link href={`/edit-list/${listToDisplay.id}`}>Edit List</Link>
      <Button className="rounded bg-red-600 data-hover:bg-red-700" onClick={() => onDelete(listToDisplay)}>
        <TrashIcon className="size-8 text-white" />
      </Button>
    </div>
  );
}