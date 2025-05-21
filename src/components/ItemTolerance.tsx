import React, { memo } from 'react';
import type { Tolerance } from '../types';

interface ItemToleranceProps {
  tolerance: Tolerance;
  onClick: () => void;
}

// Using memo to prevent unnecessary re-renders
export const ItemTolerance: React.FC<ItemToleranceProps> = memo(({ tolerance, onClick }) => {
  return (
    <div className="item-tolerance" onClick={onClick}>
      <div className="tolerance-name">{tolerance.name}</div>
      <div className="tolerance-value">{tolerance.value}</div>
      <div className="tolerance-range">
        ({tolerance.floor} - {tolerance.ceiling})
      </div>
    </div>
  );
}); 