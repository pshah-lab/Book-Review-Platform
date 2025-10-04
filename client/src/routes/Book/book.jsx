import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { VITE_BACKEND_URL } from "../../App";

const Book = () => {
  const baseUrl = `${VITE_BACKEND_URL}/api/books`;
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedGenre, setSelectedGenre] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    current: 1,
    pages: 1,
    total: 0
  });

  useEffect(() => {
    fetchBooks();
  }, [selectedGenre, searchTerm, sortBy, currentPage]);

  const fetchBooks = async () => {
    try {
      setIsLoading(true);
      let url = `${baseUrl}?page=${currentPage}&limit=5`;
      
      if (selectedGenre) {
        url += `&genre=${selectedGenre}`;
      }
      
      if (searchTerm) {
        url += `&search=${searchTerm}`;
      }
      
      if (sortBy) {
        url += `&sort=${sortBy}`;
      }

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Failed to fetch data!");
      }

      const data = await response.json();

      if (data.success) {
        setBooks(data.books);
        setPagination(data.pagination);
      } else {
        setError(data.message || "Failed to fetch books");
      }
    } catch (error) {
      console.log(error);
      setError("Error fetching data. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchBooks();
  };

  return (
    <div>
      <h1>Books</h1>
      <p>
        Browse our collection of books. Use the filters below to find what you're looking for.
      </p>

      <Link to={"/createbook"} style={{ 
        display: 'inline-block', 
        backgroundColor: '#005564', 
        color: 'white', 
        padding: '10px 20px', 
        textDecoration: 'none', 
        borderRadius: '4px',
        marginBottom: '2rem'
      }}>
        + Add New Book
      </Link>

      {/* Search and Filters */}
      <div style={{ 
        display: 'flex', 
        gap: '1rem', 
        marginBottom: '2rem', 
        flexWrap: 'wrap',
        alignItems: 'center'
      }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.5rem' }}>
          <input
            type="text"
            placeholder="Search books..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
          />
          <button type="submit" style={{ 
            padding: '8px 16px', 
            backgroundColor: '#007d93', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            cursor: 'pointer'
          }}>
            Search
          </button>
        </form>

        <div>
          <label>Genre: </label>
          <select 
            value={selectedGenre} 
            onChange={(e) => {
              setSelectedGenre(e.target.value);
              setCurrentPage(1);
            }}
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
          >
            <option value="">All Genres</option>
            <option value="Fiction">Fiction</option>
            <option value="Non-Fiction">Non-Fiction</option>
            <option value="Mystery">Mystery</option>
            <option value="Romance">Romance</option>
            <option value="Science Fiction">Science Fiction</option>
            <option value="Fantasy">Fantasy</option>
            <option value="Thriller">Thriller</option>
            <option value="Biography">Biography</option>
            <option value="History">History</option>
            <option value="Self-Help">Self-Help</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label>Sort by: </label>
          <select 
            value={sortBy} 
            onChange={(e) => {
              setSortBy(e.target.value);
              setCurrentPage(1);
            }}
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
          >
            <option value="createdAt">Newest First</option>
            <option value="title">Title A-Z</option>
            <option value="author">Author A-Z</option>
            <option value="year">Year (Newest)</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>
      </div>

      {/* Results Info */}
      {!isLoading && !error && (
        <p style={{ color: '#666', marginBottom: '1rem' }}>
          Showing {books.length} of {pagination.total} books
        </p>
      )}

      {/* Books List */}
      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : books.length === 0 ? (
        <p>No books found. Try adjusting your search criteria.</p>
      ) : (
        <>
          <ul className="books">
            {books.map((book) => (
              <li key={book._id}>
                <Link to={`/books/${book.slug}`}>
                  <img
                    src={`${VITE_BACKEND_URL}/uploads/${book.thumbnail}`}
                    alt={book.title}
                  />
                  <h3>{book.title}</h3>
                  <p style={{ fontSize: '0.9em', color: '#666' }}>
                    by {book.author} ({book.year})
                  </p>
                  {book.averageRating > 0 && (
                    <p style={{ fontSize: '0.8em', color: '#ffc107' }}>
                      ⭐ {book.averageRating.toFixed(1)} ({book.reviewCount} review{book.reviewCount !== 1 ? 's' : ''})
                    </p>
                  )}
                </Link>
              </li>
            ))}
          </ul>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              gap: '0.5rem',
              marginTop: '2rem'
            }}>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                style={{
                  padding: '8px 12px',
                  backgroundColor: currentPage === 1 ? '#ccc' : '#007d93',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
                }}
              >
                Previous
              </button>

              {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  style={{
                    padding: '8px 12px',
                    backgroundColor: currentPage === page ? '#005564' : '#007d93',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === pagination.pages}
                style={{
                  padding: '8px 12px',
                  backgroundColor: currentPage === pagination.pages ? '#ccc' : '#007d93',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: currentPage === pagination.pages ? 'not-allowed' : 'pointer'
                }}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Book;
