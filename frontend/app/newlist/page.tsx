'use client';

import { useState } from "react";

interface rankItem {
  name: string;
}

function getStoredLists(): rankItem[][] {
  const data = localStorage.getItem('savedLists');
  return data ? JSON.parse(data) : [];
};

export default function Home() {

  const [itemList, setItemList] = useState<rankItem[]>([]);

function saveList() {
    const history = getStoredLists();
    const updatedHistory = [...history, itemList];
    localStorage.setItem('savedLists', JSON.stringify(updatedHistory));
  }

  function addItem() {
    setItemList(prevList => [...prevList, {name: ""}]);
  }

  function setItem(index: number, newValue: rankItem) {
    setItemList(prevItems => {
        const newItems = [...prevItems];
        newItems[index] = newValue;
        return newItems;
    });
  }

  function deleteItem(index_to_remove: number) {
    setItemList(prevItems => prevItems.filter((_, index) => index != index_to_remove));
  }

  return (
    <div>
      New List
      <ul>
        {itemList.map((item, index) => (
            <li key={index}>
                <input 
                    type="text" 
                    value={item.name} 
                    placeholder="Type something..."
                    onChange={(e) => setItem(index, {name: e.target.value})} 
                />
                <button onClick={(_) => deleteItem(index)}>Click me to delete item</button>
            </li>
        ))}
      </ul>
      <button onClick={addItem}>Click me to add new item</button>
      <br></br>
      <button onClick={saveList}>Click me to save locally</button>
    </div>
  );
}
