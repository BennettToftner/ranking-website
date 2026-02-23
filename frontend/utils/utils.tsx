'use client';

export interface RankItemList {
  id: number;
  name: string;
  itemList: RankItem[];
}

export interface RankItem {
  name: string;
}

export function getStoredLists(): RankItemList[] {
  if (typeof window === 'undefined') {
    return [];
  }
  const data = localStorage.getItem('savedLists');
  return data ? JSON.parse(data) : [];
};