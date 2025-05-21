import React, { memo } from 'react';
import type { PrimitiveAtom } from 'jotai';
import { useAtomValue } from 'jotai';
import type { Item } from '../types';
import { ItemCard } from './ItemCard';

interface ItemCardWrapperProps {
  itemAtom: PrimitiveAtom<Item>;
}

// Component that subscribes to a single item atom and renders an ItemCard
export const ItemCardWrapper: React.FC<ItemCardWrapperProps> = memo(({ itemAtom }) => {
  // Each wrapper only subscribes to its own item atom
  const item = useAtomValue(itemAtom);
  
  return <ItemCard item={item} />;
}); 