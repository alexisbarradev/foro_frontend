// src/app/forum/models/category.model.ts
export interface Category {
    id: number;
    name: string;
    topics: any[]; // Puedes crear una interfaz Topic si lo necesitas después
  }
  