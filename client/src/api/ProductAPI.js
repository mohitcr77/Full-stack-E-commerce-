import axios from 'axios';
import { useState, useEffect } from 'react';

const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [result, setResult] = useState(0);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState('');
  const [filter, setFilter] = useState('');

  const getProducts = async () => {
    const res = await axios.get(`/api/products?${filter}&${sort}&page=${page}`);
    setProducts(res.data.products);
    setResult(res.data.result);
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    getProducts();
  }, [filter, sort, page]);

  return {
    products: [products, setProducts],
    result: [result, setResult],
    page: [page, setPage],
    sort: [sort, setSort],
    filter: [filter, setFilter],
    getProducts,
  };
};

export default useProducts;
