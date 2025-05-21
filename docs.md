# Tolerance Manager Application Documentation

## Overview

The Tolerance Manager is a React TypeScript application that allows users to manage and edit tolerance values for different items. The application uses Jotai for state management, React 19, and is built with Vite.

## Project Structure

```
react-ts/
├── src/
│   ├── assets/             # Static assets
│   ├── components/         # React components
│   │   ├── ItemList.tsx    # List of all items
│   │   ├── ItemCard.tsx    # Card for individual item display
│   │   ├── ItemTolerance.tsx # Display for tolerance values
│   │   ├── TolerancePopover.tsx # Popover for editing tolerances
│   │   ├── CreateButton.tsx # Button to create new items
│   │   ├── styles.css     # Component styles
│   │   └── index.ts       # Component exports
│   ├── atoms.ts           # Jotai atoms for state management
│   ├── types.ts           # TypeScript type definitions
│   ├── App.tsx            # Main application component
│   ├── main.tsx           # Application entry point
│   ├── App.css            # App-level styles
│   └── index.css          # Global styles
├── index.html             # HTML entry point
├── package.json           # Project dependencies and scripts
└── vite.config.ts         # Vite configuration
```

## Core Concepts

### Data Model

The application manages the following data structures:

1. **Items** - The main entities in the system:
   ```typescript
   interface Item {
     id: string;
     text: string;
     tolerances: Tolerance[];
   }
   ```

2. **Tolerances** - Values with constraints attached to items:
   ```typescript
   interface Tolerance {
     id: string;
     name: string;
     value: number;
     floor: number;    // Minimum allowed value
     ceiling: number;  // Maximum allowed value
   }
   ```

3. **Validation Errors** - Errors that occur during tolerance editing:
   ```typescript
   interface ValidationError {
     toleranceId: string;
     message: string;
   }
   ```

### State Management

The application uses Jotai for state management with the following key atoms:

- `itemsAtom` - Stores all items with their tolerances
- `itemsAtomsAtom` - Split atom for efficient item updates
- `itemIdsAtom` - List of item IDs for rendering optimization
- `editingItemIdAtom` - Tracks which item is currently being edited
- `editedTolerancesAtom` - Temporary storage during tolerance editing
- `validationErrorsAtom` - Validation errors during editing
- `changedTolerancesAtom` - Record of tolerance changes for submission

## Component Functionality

### ItemList

The main container component that displays all items and the create button. It uses optimization techniques to prevent unnecessary re-renders:

- Only subscribes to item IDs rather than the full items
- Uses `memo` to prevent re-rendering when unrelated state changes

### ItemCard

Displays information about a single item and its tolerances:

- Shows the item name/text
- Displays all tolerances associated with the item
- Opens a popover for editing tolerances when clicked
- Uses memo to optimize rendering performance

### TolerancePopover

Provides an interface for editing tolerance values:

- Shows input fields for each tolerance
- Validates values as the user types
- Displays error messages for invalid inputs
- Checks tolerance floor/ceiling constraints
- Implements business rules (e.g., Tolerance A cannot be greater than Tolerance B)
- Records changes for audit/submission

### ItemTolerance

A simple display component for a single tolerance value.

### CreateButton

Component for adding new items to the system.

## Business Rules

The application implements several validation rules:

1. Tolerance values must be between their floor and ceiling values
2. Specific relationship rules between tolerances (e.g., Tolerance A cannot exceed Tolerance B)
3. Changes are tracked for audit purposes before submission

## Performance Considerations

The application uses several techniques for optimal performance:

1. **Atom splitting** - Using Jotai's splitAtom to allow updates to individual items without re-rendering the entire list
2. **Memoization** - Key components are wrapped in React.memo to prevent unnecessary re-renders
3. **ID-based rendering** - The ItemList component only subscribes to IDs rather than the full item objects
4. **Local state** - Uses local state for editing before committing changes to the global state

## Technologies Used

- **React 19** - UI library
- **TypeScript** - Type-safe JavaScript
- **Jotai** - Lightweight state management
- **Vite** - Fast development and build tool

## Setup and Development

To run the application locally:

```bash
# Install dependencies
pnpm install

# Start development server
pnpm run dev
``` 