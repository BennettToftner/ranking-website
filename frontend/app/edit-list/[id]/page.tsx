'use client';

import { Element, ElementList, getStoredLists, getListById, saveListById } from "@/utils/utils";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/navbar";

export default function EditListPage() {

  const params = useParams();
  const router = useRouter();

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

  function saveListLocal() {
    saveListById(savedList.id, savedList);
    router.push("/lists");
  }

  async function saveListDb() {
    const response = await fetch(`/api/list/${savedList.id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({name: savedList.name, elements: savedList.elements})
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    router.push("/lists");
  }

  function setListName(newName: string) {
    setSavedList(prevList => ({...prevList, name: newName}));
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
      <Navbar></Navbar>
      <input type="text" value={savedList.name} placeholder="List name" onChange={(e) => setListName(e.target.value)}/>
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
      <button onClick={saveListLocal}>Click me to save locally</button>
      <br></br>
      <button onClick={saveListDb}>Click me to save to database</button>
    </div>
  );
}
