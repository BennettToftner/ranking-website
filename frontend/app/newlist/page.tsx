'use client';

import { useState } from "react";

export default function Home() {

  const [itemList, setItemList] = useState<string[]>([]);

  function addItem() {
    setItemList(prevList => [...prevList, ""]);
  }

  function setItem(index: number, newValue: string) {
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
                    value={item} 
                    placeholder="Type something..."
                    onChange={(e) => setItem(index, e.target.value)} 
                />
                <button onClick={(_) => deleteItem(index)}>Click me to delete item</button>
            </li>
        ))}
      </ul>
      <button onClick={addItem}>Click me to add new item</button>
      <br></br>
      <span>Total list: [{itemList.join(", ")}]</span>
    </div>
  );
}
