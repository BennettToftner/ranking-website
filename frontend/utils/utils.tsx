'use client';

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