'use client';

import { RankItem, RankItemList, getStoredLists } from "@/utils/utils";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

export default function EditListPage() {

  const params = useParams();

  const [savedList, setSavedList] = useState<RankItemList>({id: "0", name: "", itemList: []});

  useEffect(() => {
    const history = getStoredLists();
    const listId = params.id;

    if (listId !== "0") {
      const existingList = history.find(l => l.id === listId);
      if (existingList) {
        setSavedList(existingList);
      }
    } else {
      setSavedList(prev => ({ ...prev, id: crypto.randomUUID() }));
    }
  }, [params.id]);

  function saveList() {
    const history = getStoredLists();
    const updatedHistory = [...history, savedList];
    localStorage.setItem('savedLists', JSON.stringify(updatedHistory));
  }

  function addItem() {
    setSavedList(prevList => ({...prevList, itemList: [...prevList.itemList, {name: ""}]}));
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
    setSavedList(prevList => ({...prevList, itemList: prevList.itemList.filter((_, index) => index != index_to_remove)}));
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
