import React, { useEffect, useState } from 'react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import type { Item, Tolerance, ValidationError } from '../types';
import { 
  editedTolerancesAtom, 
  editingItemAtom, 
  updateItemAtom, 
  validationErrorsAtom, 
  validateTolerances 
} from '../atoms';

interface TolerancePopoverProps {
  item: Item;
  onClose: () => void;
}

export const TolerancePopover: React.FC<TolerancePopoverProps> = ({ item, onClose }) => {
  const editingItem = useAtomValue(editingItemAtom);
  const setEditedTolerances = useSetAtom(editedTolerancesAtom);
  const [errors, setErrors] = useAtom(validationErrorsAtom);
  const updateItem = useSetAtom(updateItemAtom);
  
  // Local state for tolerance values
  const [localValues, setLocalValues] = useState<Record<string, number>>({});

  // Initialize local values from item tolerances
  useEffect(() => {
    const initialValues: Record<string, number> = {};
    item.tolerances.forEach(tolerance => {
      initialValues[tolerance.id] = tolerance.value;
    });
    setLocalValues(initialValues);
    setEditedTolerances({});
    setErrors([]);
  }, [item, setEditedTolerances, setErrors]);

  // Handle value change
  const handleValueChange = (tolerance: Tolerance, value: number) => {
    const newValues = { ...localValues, [tolerance.id]: value };
    setLocalValues(newValues);
    
    // Validate as user types
    const validationErrors = validateTolerances(item, newValues);
    setErrors(validationErrors);
  };

  // Apply changes
  const handleApply = () => {
    // Only proceed if there are no validation errors
    if (errors.length === 0) {
      const updatedItem = {
        ...item,
        tolerances: item.tolerances.map(t => ({
          ...t,
          value: localValues[t.id] ?? t.value
        }))
      };
      
      updateItem(updatedItem);
      onClose();
    }
  };

  // Get error for a specific tolerance
  const getErrorForTolerance = (toleranceId: string): string | null => {
    const error = errors.find(e => e.toleranceId === toleranceId);
    return error ? error.message : null;
  };

  if (!editingItem) return null;

  return (
    <div className="tolerance-popover">
      <div className="tolerance-popover-header">
        <h3>Edit Tolerances for {item.text}</h3>
        <button onClick={onClose}>×</button>
      </div>
      
      <div className="tolerance-popover-content">
        {item.tolerances.map(tolerance => (
          <div key={tolerance.id} className="tolerance-editor">
            <label>{tolerance.name}</label>
            <input
              type="number"
              value={localValues[tolerance.id] ?? tolerance.value}
              onChange={(e) => handleValueChange(tolerance, Number(e.target.value))}
              min={tolerance.floor}
              max={tolerance.ceiling}
            />
            <div className="tolerance-range">
              Range: {tolerance.floor} - {tolerance.ceiling}
            </div>
            {getErrorForTolerance(tolerance.id) && (
              <div className="tolerance-error">{getErrorForTolerance(tolerance.id)}</div>
            )}
          </div>
        ))}
      </div>
      
      <div className="tolerance-popover-actions">
        <button onClick={onClose}>Cancel</button>
        <button 
          onClick={handleApply} 
          disabled={errors.length > 0}
        >
          Apply
        </button>
      </div>
    </div>
  );
}; 