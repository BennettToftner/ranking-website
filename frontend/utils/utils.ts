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

export class RankNode {
  private leftChild: RankNode | null;
  private rightChild: RankNode | null;
  private sortedList: Element[];
  private isSorted: boolean;

  constructor(elementList: Element[]) {
    if (elementList.length == 0) {
      throw new Error("Cannot create a RankNode with an empty list.");
    }
    else if (elementList.length == 1) {
      this.leftChild = null;
      this.rightChild = null;
      this.sortedList = [elementList[0]];
      this.isSorted = true;
    }
    else {
      const halfLength = Math.floor(elementList.length / 2);
      this.leftChild = new RankNode(elementList.slice(0, halfLength));
      this.rightChild = new RankNode(elementList.slice(halfLength));
      this.sortedList = [];
      this.isSorted = false;
    }
  }

  private nextPairLocation(): RankNode | null {
    if (this.isSorted || !this.leftChild || !this.rightChild) {
      return null;
    }

    if (!this.leftChild.isSorted) {
      return this.leftChild.nextPairLocation();
    }
    else if (!this.rightChild.isSorted) {
      return this.rightChild.nextPairLocation();
    }
    else {
      return this;
    }
  }

  public nextPair(): Element[] {
    const nextPairLocation = this.nextPairLocation();

    if (nextPairLocation == null || !nextPairLocation.leftChild || !nextPairLocation.rightChild) {
      return [];
    }
    
    return [nextPairLocation.leftChild.sortedList[0], nextPairLocation.rightChild.sortedList[0]];
  }

  public sortNextPair(preferLeft: boolean): boolean {
    const nextPairLocation = this.nextPairLocation();

    if (nextPairLocation == null || !nextPairLocation.leftChild || !nextPairLocation.rightChild) {
      return false;
    }

    const childList = preferLeft? nextPairLocation.leftChild.sortedList : nextPairLocation.rightChild.sortedList;
    const preferredElement = childList.shift();

    if (!preferredElement) {
      return false;
    }

    if (childList.length == 0) {

      nextPairLocation.sortedList.push(preferredElement);
      const otherChildList = preferLeft? nextPairLocation.rightChild.sortedList : nextPairLocation.leftChild.sortedList;
      nextPairLocation.sortedList.push(...otherChildList);
      nextPairLocation.isSorted = true;

    }
    else {
    
      nextPairLocation.sortedList.push(preferredElement);

    }

    return true;
  }
}

export interface Ranking {
  id: string;
  name: string;
}