import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

function singleBook() {
  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    reviewText: ""
  });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState("");

  const { slug } = useParams();
  const { user, token, isAuthenticated } = useAuth();
  const baseUrl = `${import.meta.env.VITE_BACKEND_URL}/api/books/${slug}`;

  useEffect(() => {
    fetchBookData();
    fetchReviews();
  }, [slug]);

  const fetchBookData = async () => {
    try {
      const response = await fetch(baseUrl);

      if (!response.ok) {
        throw new Error("Failed to fetch book data!");
      }

      const data = await response.json();
      setBook(data.book);
    } catch (error) {
      console.log(error);
      setError("Failed to load book data");
    }
  };

  const fetchReviews = async () => {
    try {
      if (!book) return;
      
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/reviews/book/${book._id}`);

      if (response.ok) {
        const data = await response.json();
        setReviews(data.reviews);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setSubmittingReview(true);
    setReviewError("");

    if (!reviewForm.reviewText.trim()) {
      setReviewError("Please enter a review");
      setSubmittingReview(false);
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          bookId: book._id,
          rating: reviewForm.rating,
          reviewText: reviewForm.reviewText
        })
      });

      const data = await response.json();

      if (response.ok) {
        setReviewForm({ rating: 5, reviewText: "" });
        fetchReviews(); // Refresh reviews
        fetchBookData(); // Refresh book data to update average rating
      } else {
        setReviewError(data.message || "Failed to submit review");
      }
    } catch (error) {
      console.log(error);
      setReviewError("Network error. Please try again.");
    } finally {
      setSubmittingReview(false);
    }
  };

  function StarRating({ rating, interactive = false, onRatingChange }) {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          onClick={interactive ? () => onRatingChange(i) : undefined}
          style={{
            cursor: interactive ? 'pointer' : 'default',
            fontSize: '20px',
            color: i <= rating ? '#ffc107' : '#ddd'
          }}
        >
          ⭐
        </span>
      );
    }
    return <div>{stars}</div>;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error || !book) {
    return <div>Error: {error || "Book not found"}</div>;
  }

  return (
    <div>
      <Link to={"/books"}>🔙 Back to Books</Link>
      
      <div className="bookdetails">
        <div className="col-1">
          <img
            src={`${import.meta.env.VITE_BACKEND_URL}/uploads/${book.thumbnail}`}
            alt={book.title}
            style={{ maxHeight: '300px' }}
          />
          <br/>
          {isAuthenticated && user && book.addedBy && book.addedBy._id === user.id && (
            <Link to={`/editbook/${book.slug}`}>✏️ Edit Book</Link>
          )}
        </div>

        <div className="col-2">
          <h1>{book.title}</h1>
          <p><strong>Author:</strong> {book.author}</p>
          <p><strong>Published:</strong> {book.year}</p>
          <p><strong>Genre:</strong> {book.genre}</p>
          <p><strong>Description:</strong></p>
          <p>{book.description}</p>
          
          <div style={{ margin: '20px 0' }}>
            <h3>Average Rating</h3>
            <StarRating rating={Math.round(book.averageRating)} />
            <p>{book.averageRating.toFixed(1)}/5 ({book.reviewCount} review{book.reviewCount !== 1 ? 's' : ''})</p>
          </div>
        </div>
      </div>

      {/* Review Form */}
      {isAuthenticated && (
        <div style={{ marginTop: '2rem', padding: '1rem', border: '1px solid #ddd', borderRadius: '8px' }}>
          <h3>Write a Review</h3>
          {reviewError && (
            <div style={{ color: 'red', marginBottom: '1rem' }}>
              {reviewError}
            </div>
          )}
          <form onSubmit={handleReviewSubmit}>
            <div style={{ marginBottom: '1rem' }}>
              <label>Rating:</label>
              <StarRating 
                rating={reviewForm.rating} 
                interactive={true} 
                onRatingChange={(rating) => setReviewForm({...reviewForm, rating})}
              />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label>Review:</label>
              <textarea
                value={reviewForm.reviewText}
                onChange={(e) => setReviewForm({...reviewForm, reviewText: e.target.value})}
                rows="4"
                style={{ width: '100%', padding: '8px' }}
                placeholder="Share your thoughts about this book..."
                required
              />
            </div>
            <button
              type="submit"
              disabled={submittingReview}
              style={{
                backgroundColor: submittingReview ? '#ccc' : '#005564',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '4px',
                cursor: submittingReview ? 'not-allowed' : 'pointer'
              }}
            >
              {submittingReview ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
        </div>
      )}

      {/* Reviews List */}
      <div style={{ marginTop: '2rem' }}>
        <h3>Reviews ({reviews.length})</h3>
        {reviews.length === 0 ? (
          <p>No reviews yet. Be the first to review this book!</p>
        ) : (
          reviews.map((review) => (
            <div key={review._id} style={{ 
              border: '1px solid #eee', 
              padding: '1rem', 
              marginBottom: '1rem', 
              borderRadius: '8px' 
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <strong>{review.userId.name}</strong>
                <StarRating rating={review.rating} />
              </div>
              <p>{review.reviewText}</p>
              <small style={{ color: '#666' }}>
                {new Date(review.createdAt).toLocaleDateString()}
              </small>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default singleBook;
