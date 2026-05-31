'use client';

import { Element, getListById, RankNode, newRankNode, getNextPair, sortNextPair, Ranking, getRankingById, saveRankingById } from "@/utils/utils";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/navbar";

export default function RankListPage() {

  const params = useParams();
  const router = useRouter();


  const [listNotFound, setListNotFound] = useState<boolean>(false);
  const [rankingFinished, setRankingFinished] = useState<boolean>(false);

  const [ranking, setRanking] = useState<Ranking>({id: "0", name: "", rankNode: newRankNode([])});
  const [currentPair, setCurrentPair] = useState<Element[]>([{index: 0, name: ""}, {index: 1, name: ""}]);

  useEffect(() => {
    if (!params) { return; }

    const listId = params.listId;
    const rankingId = params.rankingId;

    if (rankingId && rankingId !== "0") {
      const savedRanking = getRankingById(rankingId.toString());
      if (savedRanking) {
        setRanking(savedRanking);
        return;
      }
    }

    if (!listId) {
        setListNotFound(true);
        return;
    }

    const elementList = getListById(listId.toString());
    
    if (elementList) {
        setRanking({id: crypto.randomUUID(), name: "", rankNode: newRankNode(elementList.elements)});
        setCurrentPair(getNextPair(ranking.rankNode))
    } else {
        setListNotFound(true);
        return;
    }
  }, [params.id]);

  useEffect(() => {
    if (ranking.rankNode.isSorted) {
        console.log("finished!");
        setRankingFinished(true);
    }
    else {
        setCurrentPair(getNextPair(ranking.rankNode));
        setRankingFinished(false);
    }
  }, [ranking])

  function makeDecision(preferLeft: boolean) {
    setRanking(prevRanking => {
      const newRankNode = sortNextPair(prevRanking.rankNode, preferLeft);
      if (!newRankNode) {
          return prevRanking;
      }
      return {...prevRanking, rankNode: newRankNode};
    });
  }

  function saveRanking() {
    saveRankingById(ranking.id, ranking)
  }

  return (
    <div>
      <Navbar></Navbar>
      {listNotFound &&
        <div>
          <h1 className="text-red-500 text-xl">Couldn't find a list with that ID.</h1>
        </div>}
      {!listNotFound && !rankingFinished &&
        <div>
          <button onClick={() => makeDecision(true)}>{currentPair[0].name}</button>
          <br></br>
          <button onClick={() => makeDecision(false)}>{currentPair[1].name}</button>
          <br></br>
          <button onClick={saveRanking}>Click me to save ranking locally</button>
        </div>}
      {rankingFinished &&
        <div>
          {ranking.rankNode.sortedList.map((item, index) => (
            <li key={index}>
                {item.name}
            </li>
          ))}
        </div>}
    </div>
  );
}
