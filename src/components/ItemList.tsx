import React, { memo } from 'react';
import { useAtomValue } from 'jotai';
import { itemIdsAtom, itemsAtomsAtom } from '../atoms';
import { ItemCardWrapper } from './ItemCardWrapper';
import { CreateButton } from './CreateButton';

// Memoize the entire list to prevent re-renders
export const ItemList: React.FC = memo(() => {
  // Only subscribe to the list of IDs, not the actual items
  const itemIds = useAtomValue(itemIdsAtom);
  const itemAtoms = useAtomValue(itemsAtomsAtom);
  
  return (
    <div className="item-list">
      <div className="item-list-header">
        <h2>Items with Tolerances</h2>
        <CreateButton />
      </div>
      
      {itemIds.map((id, index) => (
        <ItemCardWrapper key={id} itemAtom={itemAtoms[index]} />
      ))}
    </div>
  );
}); 