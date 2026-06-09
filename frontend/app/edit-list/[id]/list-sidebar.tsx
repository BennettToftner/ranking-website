'use client';

import { Switch } from '@headlessui/react';

interface ListSidebarProps {
    initialName: string;
    initialPrivacy: 'public' | 'private';
    onNameChange: (newName: string) => void;
    onPrivacyChange: (isPrivate: boolean) => void;
    onSave: () => void;
}

export default function ListSidebar({ initialName, initialPrivacy, onNameChange, onPrivacyChange, onSave }: ListSidebarProps) {

  return (
    <div className="fixed right-0 h-full w-80 p-10 outline">
        <input className="outline rounded" type="text" value={initialName} placeholder="List name" onChange={(e) => onNameChange(e.target.value)}/>
        <br></br>
        <input type="checkbox" id="privacy-checkbox" checked={initialPrivacy == 'private'} onChange={(e) => onPrivacyChange(e.target.checked)}></input>
        <label htmlFor="privacy-checkbox"> Private?</label>
        <br></br>
        <button onClick={onSave}>Save</button>
    </div>
  );
}