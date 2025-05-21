import React, { memo, useState } from 'react';
import { useSetAtom } from 'jotai';
import type { Item } from '../types';
import { ItemTolerance } from './ItemTolerance';
import { TolerancePopover } from './TolerancePopover';
import { editingItemIdAtom } from '../atoms';

interface ItemCardProps {
  item: Item;
}

// Using memo to prevent unnecessary re-renders when other items change
export const ItemCard: React.FC<ItemCardProps> = memo(({ item }) => {
  const [showPopover, setShowPopover] = useState(false);
  const setEditingItemId = useSetAtom(editingItemIdAtom);
  
  const handleToleranceClick = () => {
    setShowPopover(true);
    setEditingItemId(item.id);
  };
  
  const handleClosePopover = () => {
    setShowPopover(false);
    setEditingItemId(null);
  };
  
  return (
    <div className="item-card">
      <h3 className="item-title">{item.text}</h3>
      
      <div className="item-tolerances">
        {item.tolerances.map(tolerance => (
          <ItemTolerance 
            key={tolerance.id} 
            tolerance={tolerance}
            onClick={handleToleranceClick}
          />
        ))}
      </div>
      
      {showPopover && (
        <div className="popover-container">
          <div className="popover-backdrop" onClick={handleClosePopover} />
          <TolerancePopover item={item} onClose={handleClosePopover} />
        </div>
      )}
    </div>
  );
}); 