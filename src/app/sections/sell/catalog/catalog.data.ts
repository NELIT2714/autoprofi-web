export type Condition = 'good' | 'accident' | 'repair';

export interface Car {
  id: number;
  make: string;
  model: string;
  year: number;
  mileage: number;
  price: number;
  condition: Condition;
  image: string;
}

export const CARS: Car[] = [
  {
    id: 1,
    make: 'BMW',
    model: 'X5',
    year: 2012,
    mileage: 214000,
    price: 14500,
    condition: 'good',
    image: '/images/catalog/1.webp',
  },
  {
    id: 2,
    make: 'Audi',
    model: 'A8',
    year: 2010,
    mileage: 260000,
    price: 9800,
    condition: 'accident',
    image: '/images/catalog/2.webp',
  },
  {
    id: 3,
    make: 'Mazda',
    model: '6',
    year: 2015,
    mileage: 150000,
    price: 8900,
    condition: 'good',
    image: '/images/catalog/3.webp',
  },
  {
    id: 4,
    make: 'Ford',
    model: 'Mondeo',
    year: 2013,
    mileage: 198000,
    price: 5200,
    condition: 'repair',
    image: '/images/catalog/4.webp',
  },
];
