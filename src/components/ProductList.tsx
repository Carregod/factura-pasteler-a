import React, { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { Product } from '../types';
import { products } from '../data/products';

interface ProductListProps {
  onAddProduct: (product: Product, portions: number) => void;
}

export const ProductList: React.FC<ProductListProps> = ({ onAddProduct }) => {
  const [selectedPortions, setSelectedPortions] = useState<{ [key: number]: number }>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('');
  const productsPerPage = 10;

  // Filter products based on search query and category
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  // Get unique categories
  const categories = Array.from(new Set(products.map(p => p.category)));

  const handlePortionsChange = (productId: number, portions: number) => {
    setSelectedPortions((prev) => ({
      ...prev,
      [productId]: portions,
    }));
  };

  const handleAddToCart = (product: Product) => {
    const portions = product.hasPortion
      ? selectedPortions[product.id] || product.minPortions || 1
      : 1;
    onAddProduct(product, portions);
  };

  const calculateProductPrice = (product: Product, portions: number): number => {
    if (product.hasPortion) {
      return portions * (product.portionPrice || 0);
    }
    return product.price;
  };

  return (
    <div>
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1); // Reset to first page on search
              }}
              placeholder="Buscar productos..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setCurrentPage(1); // Reset to first page on category change
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
          >
            <option value="">Todas las categorías</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {currentProducts.map((product) => {
          const portions = product.hasPortion
            ? selectedPortions[product.id] || product.minPortions || 1
            : 1;
          const price = calculateProductPrice(product, portions);

          const portionOptions =
            product.hasPortion && product.minPortions && product.maxPortions
              ? Array.from(
                  { length: product.maxPortions - product.minPortions + 1 },
                  (_, i) => (product.minPortions || 0) + i
                )
              : [];

          return (
            <div
              key={product.id}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover rounded-md mb-4"
              />
              <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
              <p className="text-gray-600 text-sm mb-2">{product.description}</p>

              {product.hasPortion ? (
                <>
                  <p className="text-gray-700 mb-2">
                    Precio por porción: Q{product.portionPrice?.toFixed(2) || '0.00'}
                  </p>
                  <div className="mb-4">
                    <label
                      htmlFor={`portions-${product.id}`}
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Número de porciones ({product.minPortions || 0}-{product.maxPortions || 0}):
                    </label>
                    <select
                      id={`portions-${product.id}`}
                      value={portions}
                      onChange={(e) => handlePortionsChange(product.id, Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                    >
                      {portionOptions.map((portionCount) => (
                        <option key={portionCount} value={portionCount}>
                          {portionCount} porciones - Q{calculateProductPrice(product, portionCount).toFixed(2)}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              ) : (
                <p className="text-gray-700 mb-2">
                  Precio: Q{product.price.toFixed(2)} {product.unit ? `por ${product.unit}` : ''}
                </p>
              )}

              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">Total: Q{price.toFixed(2)}</span>
                <button
                  onClick={() => handleAddToCart(product)}
                  className="flex items-center gap-2 bg-pink-500 text-white px-4 py-2 rounded-md hover:bg-pink-600 transition-colors"
                >
                  <Plus size={16} />
                  Agregar
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mb-6">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Anterior
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-4 py-2 rounded-md ${
                currentPage === page
                  ? 'bg-pink-500 text-white'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
};