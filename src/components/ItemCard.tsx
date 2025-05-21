import React, { memo, useState } from 'react';
import type { Item } from '../types';
import { ItemTolerance } from './ItemTolerance';
import { TolerancePopover } from './TolerancePopover';

interface ItemCardProps {
  item: Item;
}

// Using memo to prevent unnecessary re-renders when other items change
export const ItemCard: React.FC<ItemCardProps> = memo(({ item }) => {
  const [showPopover, setShowPopover] = useState(false);
  
  const handleToleranceClick = () => {
    setShowPopover(true);
  };
  
  const handleClosePopover = () => {
    setShowPopover(false);
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