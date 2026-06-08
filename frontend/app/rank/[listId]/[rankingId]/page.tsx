'use client';

import { Element, getDbList, RankNode, newRankNode, getNextPair, sortNextPair, RankingInfo, getDbRanking } from "@/utils/utils";
import { authClient } from "@/utils/auth-client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/navbar";

export default function RankListPage() {

  const { data: session } = authClient.useSession();
  const params = useParams();
  const router = useRouter();

  const [pageLoaded, setPageLoaded] = useState<boolean>(false);
  const [listNotFound, setListNotFound] = useState<boolean>(false);
  const [rankingFinished, setRankingFinished] = useState<boolean>(false);

  const [ranking, setRanking] = useState<RankingInfo | null>(null);
  const [currentPair, setCurrentPair] = useState<Element[]>([{id: "", name: ""}, {id: "", name: ""}]);

  useEffect(() => {

    if (ranking) { return; }

    const userId = session?.user.id;

    if (!userId) {
      return;
    }

    if (!params) { return; }

    const listId = params.listId as string;
    const rankingId = params.rankingId as string;

    if (rankingId && rankingId !== "0") {
      getDbRanking(rankingId).then(result => {
        setPageLoaded(true);
        if (result != "NOT_FOUND") {
          setRanking(result);
        }
      });
      return;
    }

    //new ranking

    if (!listId) {
      setListNotFound(true);
      setPageLoaded(true);
      return;
    }

    getDbList(listId).then(result => {
      if (result == "NOT_FOUND") {
        setListNotFound(true);
      } else {
        const listToRank = result;
        const generatedNode = newRankNode(listToRank.elements);
        setRanking({id: crypto.randomUUID(), list_id: listId, owner_id: userId, name: `Ranking of ${listToRank.name}`, privacy: "private", created_at: new Date(Date.now()), updated_at: new Date(Date.now()), rank_data: generatedNode});
        setCurrentPair(getNextPair(generatedNode));
      }
    });

    setPageLoaded(true);
  }, [params.id, session]);

  useEffect(() => {
    if (!ranking) {
      return;
    }
    if (ranking.rank_data.isSorted) {
        console.log("finished!");
        setRankingFinished(true);
    }
    else {
        setCurrentPair(getNextPair(ranking.rank_data));
        setRankingFinished(false);
    }
  }, [ranking])

  function makeDecision(preferLeft: boolean) {
    setRanking(prevRanking => {
      if (!prevRanking) {
        return null;
      }
      const newRankNode = sortNextPair(prevRanking.rank_data, preferLeft);
      if (!newRankNode) {
          return prevRanking;
      }
      return {...prevRanking, rank_data: newRankNode};
    });
  }

  async function saveRanking() {
    if (!ranking) {return;}

    const response = await fetch(`/api/ranking/${ranking.id}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({listId: ranking.list_id, name: ranking.name, privacy: ranking.privacy, rankNode: ranking.rank_data})
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
  }

  if (!ranking) {
    <div>
      <Navbar></Navbar>
    </div>
  } else {
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
            <button onClick={saveRanking}>Click me to save ranking to database</button>
          </div>}
        {rankingFinished &&
          <div>
            {ranking.rank_data.sortedList.map((item, index) => (
              <li key={index}>
                  {item.name}
              </li>
            ))}
          </div>}
      </div>
    );
  }
}
