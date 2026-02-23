'use client';

import { Element, ElementList, getStoredLists, getListById, saveListById } from "@/utils/utils";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

export default function EditListPage() {

  const params = useParams();

  const [savedList, setSavedList] = useState<ElementList>({id: "0", name: "", elements: []});

  useEffect(() => {
    if (!params) { return; }

    const listId = params.id;
    
    if (!listId || listId === "0") {
      setSavedList({ id: crypto.randomUUID(), name: "", elements: [] });
      return;
    }

    const elementList = getListById(listId.toString());
    
    if (elementList) {
      setSavedList(elementList);
    } else {
      setSavedList({ id: crypto.randomUUID(), name: "", elements: [] });
    }
  }, [params.id]);

  function saveList() {
    saveListById(savedList.id, savedList);
  }

  function addItem() {
    setSavedList(prevList => ({...prevList, elements: [...prevList.elements, {name: ""}]}));
  }

  function setItemName(index: number, newName: string) {
    setSavedList(prevList => ({
      ...prevList,
      elements: prevList.elements.map((item, i) => 
        i === index ? { ...item, name: newName } : item
      )
    }));
  }

  function deleteItem(index_to_remove: number) {
    setSavedList(prevList => ({...prevList, elements: prevList.elements.filter((_, index) => index != index_to_remove)}));
  }

  return (
    <div>
      New List
      <ul>
        {savedList.elements.map((item, index) => (
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
