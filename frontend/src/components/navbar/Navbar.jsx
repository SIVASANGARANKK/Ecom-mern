import React, { useContext, useRef, useState } from 'react'
import './Navbar.css'
import logo from '../assets/logo.png'
import cart_icon from '../assets/cart_icon.png'
import { Link } from 'react-router-dom'
import { ShopContext } from '../../context/ShopContext'
import nav_icon from '../assets/icons8-menu-50.png'

const Navbar = () => {
    const [menu,setMenu] = useState("shop")
    const {getTotalCartItems} = useContext(ShopContext)
    const menuRef = useRef()
    const dropdown_toggle = (e) =>{
        menuRef.current.classList.toggle('nav-menu-visible')
        e.target.classList.toggle('open')
    }
  return (
    <div className='navbar'>
                <img className='nav-dropdown' onClick={dropdown_toggle} src={nav_icon} alt="" />
        <div className="nav-logo">
            <img src={logo} alt="logo" />
            <p>SHOPPER</p>
        </div>
        <ul ref={menuRef} className="nav-menu">
            <li onClick={() => {setMenu("shop")}}><Link to='/'>Shop</Link>{menu === "shop" ? <hr></hr> : <></>}</li>
            <li onClick={() => {setMenu("mens")}}><Link to='/mens'>Men</Link>{menu === "mens" ? <hr></hr> : <></>}</li>
            <li onClick={() => {setMenu("womens")}}><Link to='/womens'>Women</Link>{menu === "womens" ? <hr></hr> : <></>}</li>
            <li onClick={() => {setMenu("kids")}}><Link to='/kids'>Kids</Link>{menu === "kids" ? <hr></hr> : <></>}</li>
        </ul>
        <div className="nav-login-cart">
            {localStorage.getItem('auth-token') 
            ?<button onClick={() =>{localStorage.removeItem('auth-token');
            window.location.replace('/')}}>Logout</button>
            :<Link to='/login'><button>Login</button></Link>}
        
        <Link to='/cart'><img src={cart_icon} alt="cart_icon" /></Link>
            <div className="nav-cart-count">{getTotalCartItems()}
            </div>
        </div>
    </div>
  )
}

export default Navbar