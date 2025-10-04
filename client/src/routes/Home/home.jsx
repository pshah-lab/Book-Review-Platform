import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

function Home() {
  const { isAuthenticated, user } = useAuth();

  return (
    <div>
      <h1>Welcome to BookReview Platform</h1>
      <p>A comprehensive book review platform built with the MERN stack.</p>
      
      {isAuthenticated ? (
        <div>
          <p>Welcome back, <strong>{user?.name}</strong>! Ready to discover and review some great books?</p>
          <div style={{ marginTop: '2rem' }}>
            <Link to="/books" style={{ 
              display: 'inline-block', 
              backgroundColor: '#005564', 
              color: 'white', 
              padding: '12px 24px', 
              textDecoration: 'none', 
              borderRadius: '4px',
              marginRight: '1rem'
            }}>
              Browse Books
            </Link>
            <Link to="/createbook" style={{ 
              display: 'inline-block', 
              backgroundColor: '#007d93', 
              color: 'white', 
              padding: '12px 24px', 
              textDecoration: 'none', 
              borderRadius: '4px'
            }}>
              Add New Book
            </Link>
          </div>
        </div>
      ) : (
        <div>
          <p>Join our community to discover, review, and share your favorite books!</p>
          <div style={{ marginTop: '2rem' }}>
            <Link to="/books" style={{ 
              display: 'inline-block', 
              backgroundColor: '#005564', 
              color: 'white', 
              padding: '12px 24px', 
              textDecoration: 'none', 
              borderRadius: '4px',
              marginRight: '1rem'
            }}>
              Browse Books
            </Link>
            <Link to="/signup" style={{ 
              display: 'inline-block', 
              backgroundColor: '#007d93', 
              color: 'white', 
              padding: '12px 24px', 
              textDecoration: 'none', 
              borderRadius: '4px',
              marginRight: '1rem'
            }}>
              Sign Up
            </Link>
            <Link to="/login" style={{ 
              display: 'inline-block', 
              backgroundColor: 'transparent', 
              color: '#007d93', 
              padding: '12px 24px', 
              textDecoration: 'none', 
              borderRadius: '4px',
              border: '2px solid #007d93'
            }}>
              Login
            </Link>
          </div>
        </div>
      )}

      <div style={{ marginTop: '3rem', padding: '2rem', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
        <h2>Features</h2>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li style={{ marginBottom: '0.5rem' }}>📚 Browse and search books by title, author, or genre</li>
          <li style={{ marginBottom: '0.5rem' }}>⭐ Rate and review books with detailed feedback</li>
          <li style={{ marginBottom: '0.5rem' }}>📖 Add your own books to the platform</li>
          <li style={{ marginBottom: '0.5rem' }}>🔍 Advanced filtering and sorting options</li>
          <li style={{ marginBottom: '0.5rem' }}>👥 User authentication and personalized experience</li>
        </ul>
      </div>
    </div>
  )
}

export default Home
