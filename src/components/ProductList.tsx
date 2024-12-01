import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Product, SearchFilters } from '../types';
import { products } from '../data/products';
import { ProductSearch } from './ProductSearch';

interface ProductListProps {
  onAddProduct: (product: Product) => void;
}

export const ProductList: React.FC<ProductListProps> = ({ onAddProduct }) => {
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    category: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 6;

  const filteredProducts = products.filter((product) => {
    const matchesQuery = product.name
      .toLowerCase()
      .includes(filters.query.toLowerCase());
    const matchesCategory = !filters.category || product.category === filters.category;
    const matchesPrice =
      (!filters.minPrice || product.price >= filters.minPrice) &&
      (!filters.maxPrice || product.price <= filters.maxPrice);
    return matchesQuery && matchesCategory && matchesPrice;
  });

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const displayedProducts = filteredProducts.slice(
    startIndex,
    startIndex + productsPerPage
  );

  return (
    <div>
      <ProductSearch filters={filters} onFilterChange={setFilters} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayedProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-48 object-cover rounded-md mb-4"
            />
            <h3 className="text-lg font-semibold">{product.name}</h3>
            <p className="text-gray-600">Q{product.price.toFixed(2)}</p>
            <button
              onClick={() => onAddProduct(product)}
              className="mt-2 flex items-center gap-2 bg-pink-500 text-white px-4 py-2 rounded-md hover:bg-pink-600 transition-colors w-full justify-center"
            >
              <Plus size={16} />
              Agregar
            </button>
          </div>
        ))}
      </div>
      {totalPages > 1 && (
        <div className="mt-6 flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-4 py-2 rounded-md ${
                currentPage === page
                  ? 'bg-pink-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};