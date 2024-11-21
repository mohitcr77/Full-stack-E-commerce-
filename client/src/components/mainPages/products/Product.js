import React, { useContext } from 'react';
import { GlobalState } from '../../../GlobalState';
import ProductList from '../utils/productList/ProductList';
import { IoSearch } from "react-icons/io5";

const Product = () => {
  const state = useContext(GlobalState);
  const [products] = state.productsAPI.products;
  const [isAdmin] = state.userAPI.isAdmin;
  const [page, setPage] = state.productsAPI.page;
  const [sort, setSort] = state.productsAPI.sort;
  const [filter, setFilter] = state.productsAPI.filter;

  return (
    <>
      <div className='filter_menu'>
        <div className='search'>
       <div>
        <IoSearch size={22}/>
       </div>
        <input type='text' placeholder='Search' onChange={e => setFilter(`title[regex]=${e.target.value}`)} />
          </div>
          <div className='sort'>
          <h3>Sort by:</h3>
        <select onChange={e => setSort(e.target.value)}>
          <option value=''>Newest</option>
          <option value='sort=oldest'>Oldest</option>
          <option value='sort=-price'>Price: High-Low</option>
          <option value='sort=price'>Price: Low-High</option>
        </select>
        </div>
        <div className='page'>
        {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
<button onClick={() => setPage(page - 1)} disabled={page === 1}>{'<'}Previous</button>
          <h4>Page</h4>
        {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
<button onClick={() => setPage(page + 1)}>Next{'>'}</button>
        </div>
      </div>
      <div className='products'>
        {products.map(product => (
          <ProductList key={product._id || product.id} product={product} isAdmin={isAdmin} />
        ))}
      </div>
    </>
  );
};

export default Product;
