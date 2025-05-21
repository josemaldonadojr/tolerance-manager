import React, { useEffect } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import { changedTolerancesAtom, clearAllChangesAtom } from '../atoms';

export const CreateButton: React.FC = () => {
  const changedTolerances = useAtomValue(changedTolerancesAtom);
  const clearAllChanges = useSetAtom(clearAllChangesAtom);
  
  // Debug: Log when changes are detected
  useEffect(() => {
    const changeCount = Object.keys(changedTolerances).length;
    if (changeCount > 0) {
      console.log(`CreateButton: Detected ${changeCount} items with changes`);
    }
  }, [changedTolerances]);
  
  const handleCreate = () => {
    // Check if there are any changes
    const hasChanges = Object.keys(changedTolerances).length > 0;
    
    if (hasChanges) {
      // Prepare payload with part-id and only changed tolerances
      const payload = Object.entries(changedTolerances).map(([itemId, toleranceChanges]) => ({
        partId: itemId,
        changedTolerances: toleranceChanges
      }));
      
      // Log the serialized payload (simulating backend request)
      console.log('Sending to backend:', JSON.stringify(payload, null, 2));
      
      // Clear all recorded changes after "sending"
      clearAllChanges();
    } else {
      console.log('No changes to submit');
    }
  };
  
  const changeCount = Object.keys(changedTolerances).length;
  
  return (
    <button 
      className="create-button" 
      onClick={handleCreate}
      disabled={changeCount === 0}
    >
      Create {changeCount > 0 ? `(${changeCount})` : ''}
    </button>
  );
}; 