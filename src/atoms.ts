import { atom } from 'jotai';
import { atomWithStorage, splitAtom } from 'jotai/utils';
import type { Item, ValidationError } from './types';

// Store all items
export const itemsAtom = atomWithStorage<Item[]>('items', [
  {
    id: '1',
    text: 'Item 1',
    tolerances: [
      { id: '1-1', name: 'Tolerance A', value: 5, floor: 0, ceiling: 10 },
      { id: '1-2', name: 'Tolerance B', value: 8, floor: 0, ceiling: 15 },
    ],
  },
  {
    id: '2',
    text: 'Item 2',
    tolerances: [
      { id: '2-1', name: 'Tolerance A', value: 3, floor: 0, ceiling: 10 },
      { id: '2-2', name: 'Tolerance B', value: 7, floor: 0, ceiling: 15 },
    ],
  },
]);

// Split the items array into individual atoms
export const itemsAtomsAtom = splitAtom(itemsAtom);

// Get item IDs for rendering the list without re-rendering on item changes
export const itemIdsAtom = atom((get) => {
  const items = get(itemsAtom);
  return items.map(item => item.id);
});

// Atom for updating a single item without causing full re-renders
export const updateItemAtom = atom(
  null,
  (get, set, updatedItem: Item) => {
    const items = get(itemsAtom);
    const newItems = items.map(item => 
      item.id === updatedItem.id ? updatedItem : item
    );
    set(itemsAtom, newItems);
  }
);

// Track which item is being edited
export const editingItemIdAtom = atom<string | null>(null);

// Derive the currently edited item
export const editingItemAtom = atom(
  (get) => {
    const items = get(itemsAtom);
    const editingId = get(editingItemIdAtom);
    return editingId ? items.find(item => item.id === editingId) || null : null;
  }
);

// Temporary storage for edited tolerance values
export const editedTolerancesAtom = atom<Record<string, number>>({});

// Validation errors for edited tolerances
export const validationErrorsAtom = atom<ValidationError[]>([]);

// Validation function for tolerances within an item
export const validateTolerances = (item: Item, editedValues: Record<string, number>) => {
  const errors: ValidationError[] = [];
  const tolerances = [...item.tolerances];
  
  // Apply edited values for validation
  tolerances.forEach(tolerance => {
    if (editedValues[tolerance.id] !== undefined) {
      tolerance.value = editedValues[tolerance.id];
    }
  });
  
  // Example rule: Tolerance A cannot be greater than Tolerance B
  const toleranceA = tolerances.find(t => t.name === 'Tolerance A');
  const toleranceB = tolerances.find(t => t.name === 'Tolerance B');
  
  if (toleranceA && toleranceB && toleranceA.value > toleranceB.value) {
    errors.push({
      toleranceId: toleranceA.id,
      message: 'Tolerance A cannot be greater than Tolerance B'
    });
  }
  
  // Check floor/ceiling constraints
  tolerances.forEach(tolerance => {
    if (tolerance.value < tolerance.floor) {
      errors.push({
        toleranceId: tolerance.id,
        message: `Value cannot be less than ${tolerance.floor}`
      });
    }
    
    if (tolerance.value > tolerance.ceiling) {
      errors.push({
        toleranceId: tolerance.id,
        message: `Value cannot be greater than ${tolerance.ceiling}`
      });
    }
  });
  
  return errors;
}; 