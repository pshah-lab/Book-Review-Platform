import React from 'react'
import { Link, NavLink } from "react-router-dom";
import { useAuth } from '../contexts/AuthContext';
import logo from "../assets/react.svg";

const Header = () => {
  const { user, logout, isAuthenticated } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <header>
        <Link to="/" className="logo">
            <img src={logo} alt="ReactJS" /> BookReview     
        </Link>

        <nav>
            <NavLink to="/">Home</NavLink>
            <NavLink to="/books">Books</NavLink>
            <NavLink to="/about">About</NavLink>
            
            {isAuthenticated ? (
              <>
                <NavLink to="/createbook">Add Book</NavLink>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span style={{ color: '#007d93' }}>Welcome, {user?.name}</span>
                  <button 
                    onClick={handleLogout}
                    style={{
                      background: 'none',
                      border: '1px solid #007d93',
                      color: '#007d93',
                      padding: '5px 10px',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div style={{ display: 'flex', gap: '1rem' }}>
                <NavLink to="/login">Login</NavLink>
                <NavLink to="/signup">Sign Up</NavLink>
              </div>
            )}
        </nav>

    </header>
  )
}

export default Header
