'use client';

import { Element, ListInfo, getDbList } from "@/utils/utils";
import { authClient } from "@/utils/auth-client"
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/navbar";

export default function EditListPage() {

  const { data: session } = authClient.useSession()
  const params = useParams();
  const router = useRouter();

  const [pageLoaded, setPageLoaded] = useState<boolean>(false);
  const [listFound, setListFound] = useState<boolean>(false);
  const [savedList, setSavedList] = useState<ListInfo>({id: "0", name: "", owner_id: "0", privacy: "private", created_at: new Date(Date.now()), updated_at: new Date(Date.now()), elements: []});

  useEffect(() => {
    if (!params) { return; }

    var userId = "";
    if (session?.user?.id) {
      userId = session.user.id;
    }

    const listId = params.id as string;

    if (!listId || listId === "0") {
      setSavedList({ id: crypto.randomUUID(), name: "Unitled List", owner_id: userId, privacy: "private",  created_at: new Date(Date.now()), updated_at: new Date(Date.now()), elements: [] });
      setListFound(true);
      setPageLoaded(true);
      return;
    }

    getDbList(listId).then(result => {
      setPageLoaded(true);
      if (result != "NOT_FOUND") {
        setSavedList(result);
        setListFound(true);
      }
    });
  }, [params.id, session]);

  async function saveListDb() {
    const response = await fetch(`/api/lists/${savedList.id}`, {
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
    setSavedList(prevList => ({...prevList, elements:[...prevList.elements, { id: crypto.randomUUID(), name: "" }]}));
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
    //get lists from database as well
  }

  if (!pageLoaded) {
    return (
      <div>
        <Navbar></Navbar>
        Loading...
      </div>
    )
  } else if (!listFound) {
    return (
      <div>
        <Navbar></Navbar>
        There was an error retrieving the requested list. You may not have permission to access the list, or it simply does not exist.
      </div>
    )
  } else {
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
        <button onClick={saveListDb}>Click me to save to database</button>
      </div>
    );
  }
}
