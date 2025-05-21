export interface Tolerance {
  id: string;
  name: string;
  value: number;
  floor: number;
  ceiling: number;
}

export interface Item {
  id: string;
  text: string;
  tolerances: Tolerance[];
}

export interface ValidationError {
  toleranceId: string;
  message: string;
} 