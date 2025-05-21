import React, { memo } from 'react';
import { useAtomValue } from 'jotai';
import { itemIdsAtom, itemsAtomsAtom } from '../atoms';
import { ItemCard } from './ItemCard';
import { ItemCardWrapper } from './ItemCardWrapper';

// Memoize the entire list to prevent re-renders
export const ItemList: React.FC = memo(() => {
  // Only subscribe to the list of IDs, not the actual items
  const itemIds = useAtomValue(itemIdsAtom);
  const itemAtoms = useAtomValue(itemsAtomsAtom);
  
  return (
    <div className="item-list">
      <h2>Items with Tolerances</h2>
      
      {itemIds.map((id, index) => (
        <ItemCardWrapper key={id} itemAtom={itemAtoms[index]} />
      ))}
    </div>
  );
}); 