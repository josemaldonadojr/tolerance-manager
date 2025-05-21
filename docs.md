# Tolerance Manager Application Documentation

## Overview

The Tolerance Manager is a React TypeScript application that allows users to manage and edit tolerance values for different items. The application uses Jotai for state management, React 19, and is built with Vite.

## How It Works: Technical Walkthrough

1. **Data Storage**: Everything starts with our `itemsAtom` in `atoms.ts`. This is where all items and their tolerances live. We're using Jotai's `atomWithStorage` so the data persists between sessions - pretty handy for not losing user changes on refresh.

2. **Component Structure**:
   - The component tree is pretty standard React stuff - `App` at the top, then `ItemList` handling the collection view
   - Each item gets its own `ItemCard` (check out `ItemCard.tsx`) which manages its own UI state
   - We break out individual tolerance displays into their own components to keep things clean

3. **Editing Experience**: 
   - We kept the UI interaction simple - click a tolerance and boom, up pops a `TolerancePopover`
   - The popover creates local copies of the values (look at the `useState` call in `TolerancePopover.tsx`) so users can play around without committing changes
   - As they type, we run values through `validateTolerances` in real-time and store any validation problems in `validationErrorsAtom` - this gives immediate feedback

4. **Change Tracking**:
   - When someone hits "Apply", we call `recordToleranceChange` (this is the main hook into our change tracking system)
   - This builds up a nested object in `changedTolerancesAtom` with the structure: `{ itemId: { toleranceId: newValue } }` - only storing what's actually changed
   - The nice thing here is the `CreateButton` can just subscribe to this atom to know how many items have pending changes

5. **Submission**:
   - The `CreateButton` (in `CreateButton.tsx`) does the heavy lifting for submission
   - It transforms our change tracking object into a format the backend expects, with each item getting its own entry with just the changed tolerances
   - After successful submission, we wipe the slate clean with `clearAllChangesAtom` so users can start fresh

### Technical Bits:

- **Performance Tricks**: We're using Jotai's `splitAtom` pattern, which was a lifesaver for performance. It essentially gives each item its own mini-state, so editing one tolerance doesn't cause the entire list to re-render.
  
- **Validation Logic**: All the business rules live in `atoms.ts`. Beyond just min/max checks, we're also enforcing relationships between tolerances (like making sure Tolerance A stays smaller than B). This was tricky to get right but works well now.
  
- **State Management Philosophy**:
  - We're using a hybrid approach that's worked really well - React's `useState` for UI-only state (like "is this popover open?")
  - Jotai atoms for any data that needs to persist or be shared between components
  - All changes stay in a "pending" state until explicitly committed, which gives users a chance to back out
  
- **Render Optimization**: We're using `memo` pretty aggressively (look at `ItemCard`) to make sure we're not wasting renders when unrelated parts of the app change

The end result is pretty slick - users can edit a bunch of tolerances across different items, get immediate feedback on what's valid and what's not, and then submit everything in one go. Let me know if you have questions or see ways we could improve this setup!

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
│   │   ├── CreateButton.tsx # Button to create and submit tolerance changes
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
     floor: number;    # Minimum allowed value
     ceiling: number;  # Maximum allowed value
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
- `validationErrorsAtom` - Validation errors during editing
- `changedTolerancesAtom` - Record of tolerance changes for submission
- `recordToleranceChangeAtom` - Action atom to record tolerance changes
- `clearAllChangesAtom` - Action atom to clear all recorded changes

## Component Functionality

### ItemList

The main container component that displays all items and the create button. It uses optimization techniques to prevent unnecessary re-renders:

- Only subscribes to item IDs rather than the full items
- Uses `memo` to prevent re-rendering when unrelated state changes

### ItemCard

Displays information about a single item and its tolerances:

- Shows the item name/text
- Displays all tolerances associated with the item
- Uses local state to manage the tolerance editing popover
- Opens a popover for editing tolerances when clicked
- Uses memo to optimize rendering performance

### TolerancePopover

Provides an interface for editing tolerance values:

- Uses local state to track tolerance values during editing
- Shows input fields for each tolerance
- Validates values as the user types
- Displays error messages for invalid inputs
- Checks tolerance floor/ceiling constraints
- Implements business rules (e.g., Tolerance A cannot be greater than Tolerance B)
- Records changes for submission when "Apply" is clicked

### ItemTolerance

A simple display component for a single tolerance value.

### CreateButton

Component for submitting tolerance changes:
- Tracks changes from the changedTolerancesAtom
- Shows the count of items with changes
- Prepares and submits payload with all changes
- Clears changes after submission

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

## Setup and Development

To run the application locally:

```bash
# Install dependencies
pnpm install

# Start development server
pnpm run dev
``` 