'use client';

import next from "next";

//LISTS

export interface ElementList {
  id: string;
  name: string;
  elements: Element[];
}

export interface Element {
  name: string;
}

function getListMap(): Map<string, ElementList> {
  const data = localStorage.getItem('savedLists');
  if (!data) {
    return new Map();
  }
  const parsed: [string, ElementList][] = JSON.parse(data);
  return new Map(parsed);
}

export function getStoredLists(): ElementList[] {
  const listMap = getListMap();
  const elementLists = [...listMap.values()];
  return elementLists;
};

export function getListById(id: string): ElementList | undefined {
  const listMap = getListMap();
  const rankItemList = listMap.get(id);
  return rankItemList;
}

export function saveListById(id: string, list: ElementList) {
  const listMap = getListMap();
  listMap.set(id, list);
  const mapArray = Array.from(listMap.entries());
  localStorage.setItem('savedLists', JSON.stringify(mapArray));
}

export function deleteListById(id: string) {
  const listMap = getListMap();
  listMap.delete(id);
  const mapArray = Array.from(listMap.entries());
  localStorage.setItem('savedLists', JSON.stringify(mapArray));
}

//RANKINGS

//make outer class that stores a queue of ranknodes

export interface RankNode {
  leftChild: RankNode | null;
  rightChild: RankNode | null;
  sortedList: Element[];
  isSorted: boolean;
}

export function newRankNode(elementList: Element[]): RankNode {
    if (elementList.length == 0) {
      return {
        leftChild: null,
        rightChild: null,
        sortedList: [],
        isSorted: true
      }
    }
    else if (elementList.length == 1) {
      return {
        leftChild: null,
        rightChild: null,
        sortedList: [elementList[0]],
        isSorted: true
      }
    }
    else {
      const halfLength = Math.floor(elementList.length / 2);
      return {
        leftChild: newRankNode(elementList.slice(0, halfLength)),
        rightChild: newRankNode(elementList.slice(halfLength)),
        sortedList: [],
        isSorted: false
      }
    }
}

function getNextPairLocation(node: RankNode): RankNode | null {
  if (node.isSorted || !node.leftChild || !node.rightChild) {
    return null;
  }

  if (!node.leftChild.isSorted) {
    return getNextPairLocation(node.leftChild);
  }
  else if (!node.rightChild.isSorted) {
    return getNextPairLocation(node.rightChild);
  }
  else {
    return node;
  }
}

export function getNextPair(node: RankNode): Element[] {
    const nextPairLocation = getNextPairLocation(node);

    if (nextPairLocation == null || !nextPairLocation.leftChild || !nextPairLocation.rightChild) {
      return [{name: ""}, {name: ""}];
    }
    
    return [nextPairLocation.leftChild.sortedList[0], nextPairLocation.rightChild.sortedList[0]];
}

export function sortNextPair(node: RankNode, preferLeft: boolean): RankNode | null {

  if (node.isSorted || !node.leftChild || !node.rightChild) {
    return null;
  }

  if (!node.leftChild.isSorted) {
    return {
      leftChild: sortNextPair(node.leftChild, preferLeft),
      rightChild: node.rightChild,
      sortedList: node.sortedList,
      isSorted: node.isSorted
    }
  }
  else if (!node.rightChild.isSorted) {
    return {
      leftChild: node.leftChild,
      rightChild: sortNextPair(node.rightChild, preferLeft),
      sortedList: node.sortedList,
      isSorted: node.isSorted
    }
  }

  if (preferLeft) {

    var newSortedList = [...node.sortedList, node.leftChild.sortedList[0]];
    const leftSortedList = node.leftChild.sortedList.slice(1);
    var newIsSorted = false

    if (node.leftChild.sortedList.length == 1) {
      newSortedList = [...newSortedList, ...node.rightChild.sortedList];
      newIsSorted = true
    }

    return {
      leftChild: {
        leftChild: node.leftChild.leftChild,
        rightChild: node.leftChild.rightChild,
        sortedList: leftSortedList,
        isSorted: true
      },
      rightChild: node.rightChild,
      sortedList: newSortedList,
      isSorted: newIsSorted
    }

  } else {
    var newSortedList = [...node.sortedList, node.rightChild.sortedList[0]];
    const rightSortedList = node.rightChild.sortedList.slice(1);
    var newIsSorted = false

    if (node.rightChild.sortedList.length == 1) {
      newSortedList = [...newSortedList, ...node.leftChild.sortedList];
      newIsSorted = true
    }

    return {
      leftChild: node.leftChild,
      rightChild: {
        leftChild: node.rightChild.leftChild,
        rightChild: node.rightChild.rightChild,
        sortedList: rightSortedList,
        isSorted: true
      },
      sortedList: newSortedList,
      isSorted: newIsSorted
    }    
  }
}

export interface Ranking {
  id: string;
  name: string;
}