import React from 'react'
import Product from './products/Product'
import Register from './login/Register'
import Login from './login/Login'
import Cart from './cart/Cart'
import DetailProduct from './utils/productDetails/DetailProduct'
import { Route, Routes } from 'react-router-dom'
import CreateProduct from './utils/createProduct.js/CreateProduct'

const Pages = () => {
  return (
    <Routes>
      <Route path='/' element={<Product/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/register' element={<Register/>}/>
      <Route path='/cart' element={<Cart/>}/>
      <Route path='/detail/:id' element={<DetailProduct/>}/>
      <Route path='/createProduct' element={<CreateProduct/>}/>
    </Routes>
  )
}

export default Pages