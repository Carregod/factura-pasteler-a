import { Product } from '../types';

export const products: Product[] = [
  {
    id: 1,
    name: 'Torta Tres Leches',
    price: 0,
    portionPrice: 25,
    category: 'Tortas',
    minPortions: 10,
    maxPortions: 30,
    hasPortion: true,
    image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=500',
    description: 'Suave bizcocho empapado en tres tipos de leche, decorado con crema batida'
  },
  {
    id: 2,
    name: 'Torta de Chocolate',
    price: 0,
    portionPrice: 20,
    category: 'Tortas',
    minPortions: 8,
    maxPortions: 24,
    hasPortion: true,
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500',
    description: 'Rico pastel de chocolate negro con ganache y decoración de chocolate'
  },
  {
    id: 3,
    name: 'Cheesecake',
    price: 0,
    portionPrice: 22,
    category: 'Tortas',
    minPortions: 8,
    maxPortions: 16,
    hasPortion: true,
    image: 'https://images.unsplash.com/photo-1567171466295-4afa63d45416?w=500',
    description: 'Cremoso cheesecake horneado con base de galleta y cobertura de frutos rojos'
  },
  
  // Postres individuales
  {
    id: 4,
    name: 'Tiramisú Individual',
    price: 25,
    category: 'Postres',
    hasPortion: false,
    unit: 'unidad',
    image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=500',
    description: 'Clásico postre italiano con café, mascarpone y cacao'
  },
  {
    id: 5,
    name: 'Tres Leches Individual',
    price: 20,
    category: 'Postres',
    hasPortion: false,
    unit: 'unidad',
    image: 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=500',
    description: 'Porción individual de tres leches con crema batida'
  },
  
  // Galletas
  {
    id: 6,
    name: 'Galletas de Chocolate (6 unidades)',
    price: 15,
    category: 'Galletas',
    hasPortion: false,
    unit: 'paquete',
    image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=500',
    description: 'Galletas suaves con chispas de chocolate'
  },
  {
    id: 7,
    name: 'Alfajores (4 unidades)',
    price: 20,
    category: 'Galletas',
    hasPortion: false,
    unit: 'paquete',
    image: 'https://images.unsplash.com/photo-1515037893149-de7f840978e2?w=500',
    description: 'Galletas rellenas de dulce de leche y cubiertas de coco'
  },
  
  // Bebidas
  {
    id: 8,
    name: 'Coca-Cola 600ml',
    price: 8,
    category: 'Bebidas',
    hasPortion: false,
    unit: 'botella',
    image: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=500',
    description: 'Bebida gaseosa Coca-Cola personal'
  },
  {
    id: 9,
    name: 'Sprite 600ml',
    price: 8,
    category: 'Bebidas',
    hasPortion: false,
    unit: 'botella',
    image: 'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=500',
    description: 'Bebida gaseosa Sprite personal'
  },
  
  // Panes
  {
    id: 10,
    name: 'Pan Francés (6 unidades)',
    price: 12,
    category: 'Panadería',
    hasPortion: false,
    unit: 'paquete',
    image: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=500',
    description: 'Pan francés recién horneado'
  },
  {
    id: 11,
    name: 'Croissants (3 unidades)',
    price: 15,
    category: 'Panadería',
    hasPortion: false,
    unit: 'paquete',
    image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=500',
    description: 'Croissants de mantequilla horneados'
  },
  
  // Cupcakes
  {
    id: 12,
    name: 'Cupcakes Variados (6 unidades)',
    price: 30,
    category: 'Cupcakes',
    hasPortion: false,
    unit: 'caja',
    image: 'https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=500',
    description: 'Surtido de cupcakes con diferentes sabores y decoraciones'
  }
];

export const categories = Array.from(
  new Set(products.map((product) => product.category))
);