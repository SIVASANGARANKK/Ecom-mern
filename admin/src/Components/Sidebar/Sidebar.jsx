import React from 'react'
import './Sidebar.css'
import {Link} from 'react-router-dom'
import list_product from '../../assets/Admin Panel Assets/Product_list_icon.svg'
import add_product from '../../assets/Admin Panel Assets/Product_Cart.svg'

const Sidebar = () => {
  return (
    <div className='sidebar'>
        <Link to = {'/addproduct'} style={{textDecoration:"none"}}>
            <div className="sidebar-item">
            <img src={add_product} alt="" />
            <p>Add Product</p>
            </div>
        </Link>
        <Link to = {'/listproduct'} style={{textDecoration:"none"}}>
            <div className="sidebar-item">
            <img src={list_product} alt="" />
            <p>Product List</p>
            </div>
        </Link>
    </div>
  )
}

export default Sidebar