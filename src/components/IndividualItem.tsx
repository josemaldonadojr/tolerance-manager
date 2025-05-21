import React, { memo } from 'react';
import { useAtom } from 'jotai';
import { itemAtomFamily } from '../atoms';
import { ItemCard } from './ItemCard';

interface IndividualItemProps {
  itemId: string;
}

export const IndividualItem: React.FC<IndividualItemProps> = memo(({ itemId }) => {
  const [item] = useAtom(itemAtomFamily(itemId));
  
  return <ItemCard item={item} />;
}); 