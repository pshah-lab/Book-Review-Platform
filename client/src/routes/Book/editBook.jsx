import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import NoImageSelected from "../../assets/no-image-selected.jpg";

function EditBook() {
  const navigate = useNavigate();
  const urlSlug = useParams();
  const baseUrl = `${import.meta.env.VITE_BACKEND_URL}/api/books/${urlSlug.slug}`;
  const { token } = useAuth();

  const [bookId, setBookId] = useState("");
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [genre, setGenre] = useState("Other");
  const [year, setYear] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [image, setImage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [thumbnail, setThumbnail] = useState("");

  const fetchData = async () => {
    try {
      const response = await fetch(baseUrl);

      if (!response.ok) {
        throw new Error("Failed to fetch data!");
      }

      const data = await response.json();
      
      if (data.success && data.book) {
        const book = data.book;
        setBookId(book._id);
        setTitle(book.title);
        setAuthor(book.author);
        setDescription(book.description);
        setGenre(book.genre);
        setYear(book.year.toString());
        setThumbnail(book.thumbnail);
      }

    } catch (error) {
      console.log(error);
      setError("Failed to load book data");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const updateBook = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validation
    if (!title || !author || !description || !genre || !year) {
      setError("Please fill in all required fields");
      setLoading(false);
      return;
    }

    if (isNaN(year) || year < 1000 || year > new Date().getFullYear()) {
      setError("Please enter a valid year");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("author", author);
    formData.append("description", description);
    formData.append("genre", genre);
    formData.append("year", year);

    if (thumbnail && typeof thumbnail === 'object') {
      formData.append("thumbnail", thumbnail);
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/books/${bookId}`, {
        method: "PUT",
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitted(true);
        console.log("Book updated successfully!");
      } else {
        setError(data.message || "Failed to update book");
      }
    } catch (error) {
      console.log(error);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const onImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(URL.createObjectURL(e.target.files[0]));
      setThumbnail(e.target.files[0]);
    }
  };

  const removeBook = async (e) => {
    e.preventDefault();
    if (!window.confirm("Are you sure you want to delete this book?")) {
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/books/${bookId}`,
        {
          method: "DELETE",
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.ok) {
        navigate("/books");
        console.log("Book Removed!");
      } else {
        const data = await response.json();
        setError(data.message || "Failed to delete book");
      }
    } catch (error) {
      console.error(error);
      setError("Network error. Please try again.");
    }
  };

  return (
    <div>
      <h1>Edit Book</h1>
      <p>Update the book information below.</p>

      {error && (
        <div style={{ 
          color: 'red', 
          backgroundColor: '#ffe6e6', 
          padding: '10px', 
          borderRadius: '4px', 
          marginBottom: '1rem' 
        }}>
          {error}
        </div>
      )}

      <button onClick={removeBook} className="delete" style={{ marginBottom: '1rem' }}>
        Delete Book
      </button>

      {submitted ? (
        <div style={{ 
          color: 'green', 
          backgroundColor: '#e6ffe6', 
          padding: '10px', 
          borderRadius: '4px', 
          marginBottom: '1rem' 
        }}>
          Book updated successfully!
        </div>
      ) : (
        <form className="bookdetails" onSubmit={updateBook}>
          <div className="col-1">
            <label>Upload Thumbnail</label>

            {image ? (
              <img src={`${image}`} alt="preview image" style={{ maxHeight: '200px', marginBottom: '10px' }} />
            ) : (
              <img
                src={`${import.meta.env.VITE_BACKEND_URL}/uploads/${thumbnail}`}
                alt="preview image"
                style={{ maxHeight: '200px', marginBottom: '10px' }}
              />
            )}

            <input
              type="file"
              accept="image/gif, image/jpeg, image/png"
              onChange={onImageChange}
            />
          </div>
          <div className="col-2">
            <div>
              <label>Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div>
              <label>Author *</label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                required
              />
            </div>
            <div>
              <label>Published Year *</label>
              <input
                type="number"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                min="1000"
                max={new Date().getFullYear()}
                required
              />
            </div>
            <div>
              <label>Genre *</label>
              <select
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                required
              >
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
              <label>Description *</label>
              <textarea
                rows="4"
                cols="50"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              style={{
                backgroundColor: loading ? '#ccc' : '#005564',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '4px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '16px'
              }}
            >
              {loading ? 'Updating Book...' : 'Update Book'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default EditBook;
