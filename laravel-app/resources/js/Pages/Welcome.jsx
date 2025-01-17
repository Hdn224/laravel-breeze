import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ShoppingCart } from 'lucide-react';
import Layout from '@/Layouts/Layout';
import axios from 'axios';

const Welcome = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentImageIndexes, setCurrentImageIndexes] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesResponse, productsResponse] = await Promise.all([
          axios.get('/api/v1/categories'),
          axios.get('/api/v1/products/featured')
        ]);

        setCategories(categoriesResponse.data);
        setProducts(productsResponse.data);

        // Khởi tạo index cho slider ảnh
        const indexes = {};
        productsResponse.data.forEach(product => {
          indexes[product.product_id] = 0;
        });
        setCurrentImageIndexes(indexes);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const nextImage = (productId) => {
    setCurrentImageIndexes(prev => ({
      ...prev,
      [productId]: (prev[productId] + 1) % (products.find(p => p.product_id === productId)?.images?.length || 1)
    }));
  };

  const prevImage = (productId) => {
    setCurrentImageIndexes(prev => ({
      ...prev,
      [productId]: (prev[productId] - 1 + (products.find(p => p.product_id === productId)?.images?.length || 1)) %
                   (products.find(p => p.product_id === productId)?.images?.length || 1)
    }));
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Categories Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Categories</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {categories.map((category) => (
              <div
                key={category.category_id}
                className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer"
              >
                <h3 className="text-lg font-medium text-gray-900">{category.name}</h3>
              </div>
            ))}
          </div>
        </section>

        {/* Featured Products Section */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product.product_id}
                className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow group relative"
              >
                {/* Image Container with Slider */}
                <div className="relative aspect-w-1 aspect-h-1">
                  <img
                    src={product.images[currentImageIndexes[product.product_id]]?.image_url || '/path/to/fallback.jpg'}
                    alt={product.name}
                    className="w-full h-90 object-cover"
                  />

                  {/* Navigation Arrows */}
                  {product.images.length > 1 && (
                    <>
                      <button
                        onClick={() => prevImage(product.product_id)}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 p-1 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <ChevronLeft className="w-6 h-6" />
                      </button>
                      <button
                        onClick={() => nextImage(product.product_id)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 p-1 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <ChevronRight className="w-6 h-6" />
                      </button>
                    </>
                  )}
                </div>

                {/* Product Info with Semi-transparent Background */}
                <div className="absolute bottom-0 left-0 right-0 bg-black/40 backdrop-blur-sm p-4 text-white">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-medium truncate">
                        {product.name}
                      </h3>
                      <div className="mt-1">
                        {product.sale_price ? (
                          <div className="flex items-center gap-2">
                            <span className="text-gray-300 line-through">
                              ${product.price.toLocaleString()}
                            </span>
                            <span className="text-red-400 font-semibold">
                              ${product.sale_price.toLocaleString()}
                            </span>
                          </div>
                        ) : (
                          <span className="text-gray-100">
                            ${product.price.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Shopping Cart Button */}
                    <button
                      className="bg-white/20 hover:bg-white/30 p-2 rounded-full transition-colors"
                      disabled={product.stock_quantity <= 0}
                    >
                      <ShoppingCart className="w-6 h-6 text-white" />
                    </button>
                  </div>

                  {/* Out of Stock Badge */}
                  {product.stock_quantity <= 0 && (
                    <span className="absolute top-4 right-4 px-2 py-1 text-xs font-semibold text-white bg-red-500 rounded-full">
                      Out of Stock
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Welcome;
