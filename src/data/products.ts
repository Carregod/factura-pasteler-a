import { Product } from '../types';

export const products: Product[] = [
  {
    id: 1,
    name: 'Pastel de Chocolate',
    price: 150,
    category: 'Pasteles',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500',
  },
  {
    id: 2,
    name: 'Pastel de Vainilla',
    price: 140,
    category: 'Pasteles',
    image: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=500',
  },
  {
    id: 3,
    name: 'Cupcakes (6 unidades)',
    price: 60,
    category: 'Cupcakes',
    image: 'https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=500',
  },
  {
    id: 4,
    name: 'Galletas (12 unidades)',
    price: 45,
    category: 'Galletas',
    image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=500',
  },
  {
    id: 5,
    name: 'Pie de Manzana',
    price: 120,
    category: 'Pies',
    image: 'https://images.unsplash.com/photo-1621743478914-cc8a86d7e7b5?w=500',
  },
  {
    id: 6,
    name: 'Brownies (4 unidades)',
    price: 50,
    category: 'Brownies',
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500',
  },
  {
    id: 7,
    name: 'Cheesecake',
    price: 160,
    category: 'Pasteles',
    image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=500',
  },
  {
    id: 8,
    name: 'Donas (3 unidades)',
    price: 35,
    category: 'Donas',
    image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=500',
  },
];

export const categories = Array.from(
  new Set(products.map((product) => product.category))
);