import React from 'react';
import { useAtom } from 'jotai';
import { itemsAtom } from '../atoms';
import { ItemCard } from './ItemCard';

export const ItemList: React.FC = () => {
  const [items] = useAtom(itemsAtom);
  
  return (
    <div className="item-list">
      <h2>Items with Tolerances</h2>
      
      {items.map(item => (
        <ItemCard key={item.id} item={item} />
      ))}
    </div>
  );
}; 