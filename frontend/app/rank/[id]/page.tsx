'use client';

import { Element, ElementList, getStoredLists, getListById, saveListById, RankNode, newRankNode, getNextPair, sortNextPair } from "@/utils/utils";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/navbar";

export default function RankListPage() {

  const params = useParams();
  const router = useRouter();

  const [ranking, setRanking] = useState<RankNode>(newRankNode([]));
  const [currentPair, setCurrentPair] = useState<Element[]>([{name: ""}, {name: ""}]);

  useEffect(() => {
    if (!params) { return; }

    const listId = params.id;

    if (!listId || listId === "0") {
        //error!
        return;
    }

    const elementList = getListById(listId.toString());
    
    if (elementList) {
        setRanking(newRankNode(elementList.elements));
        setCurrentPair(getNextPair(ranking))
    } else {
        //error!
    }
  }, [params.id]);

  useEffect(() => {
    if (ranking.isSorted) {
        console.log(ranking.sortedList);
        //actually show the list on the page
    }
    else {
        setCurrentPair(getNextPair(ranking));
    }
  }, [ranking])

  function chooseLeft() {
    setRanking(prevRanking => {
        const newRanking = sortNextPair(prevRanking, true);
        if (!newRanking) {
            return newRankNode([]);
        }
        return newRanking;
    });
  }

  function chooseRight() {
    setRanking(prevRanking => {
        const newRanking = sortNextPair(prevRanking, false);
        if (!newRanking) {
            return newRankNode([]);
        }
        return newRanking;
    });
  }

  return (
    <div>
      <Navbar></Navbar>
      <button onClick={chooseLeft}>{currentPair[0].name}</button>
      <br></br>
      <button onClick={chooseRight}>{currentPair[1].name}</button>
    </div>
  );
}
