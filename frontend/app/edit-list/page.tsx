'use client';

import { RankItem, RankItemList, getStoredLists } from "@/utils/utils";
import { useState } from "react";

export default function Home() {

  const [savedList, setSavedList] = useState<RankItemList>({id: 0, name: "", itemList: []});

function saveList() {
    const history = getStoredLists();
    const updatedHistory = [...history, savedList];
    localStorage.setItem('savedLists', JSON.stringify(updatedHistory));
  }

  function addItem() {
    setSavedList(prevList => ({...savedList, itemList: [...savedList.itemList, {name: ""}]}));
  }

  function setItemName(index: number, newName: string) {
    setSavedList(prevList => ({
      ...prevList,
      itemList: prevList.itemList.map((item, i) => 
        i === index ? { ...item, name: newName } : item
      )
    }));
  }

  function deleteItem(index_to_remove: number) {
    setSavedList(prevList => ({...savedList, itemList: prevList.itemList.filter((_, index) => index != index_to_remove)}));
  }

  return (
    <div>
      New List
      <ul>
        {savedList.itemList.map((item, index) => (
            <li key={index}>
                <input 
                    type="text" 
                    value={item.name} 
                    placeholder="Type something..."
                    onChange={(e) => setItemName(index, e.target.value)} 
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
