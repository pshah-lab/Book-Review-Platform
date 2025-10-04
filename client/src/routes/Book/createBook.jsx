import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import NoImageSelected from "../../assets/no-image-selected.jpg";

function CreateBook() {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [genre, setGenre] = useState("Other");
  const [year, setYear] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [image, setImage] = useState(NoImageSelected);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [thumbnail, setThumbnail] = useState(null);
  const { token } = useAuth();

  const createBook = async (e) => {
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
    if (thumbnail) {
      formData.append("thumbnail", thumbnail);
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/books`, {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setTitle("");
        setAuthor("");
        setDescription("");
        setGenre("Other");
        setYear("");
        setThumbnail(null);
        setImage(NoImageSelected);
        setSubmitted(true);
        console.log("Book added successfully!");
      } else {
        setError(data.message || "Failed to add book");
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
  }


  return (
    <div>
      <h1>Create Book</h1>
      <p>Add a new book to the platform. All fields are required.</p>

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

      {submitted ? (
        <div style={{ 
          color: 'green', 
          backgroundColor: '#e6ffe6', 
          padding: '10px', 
          borderRadius: '4px', 
          marginBottom: '1rem' 
        }}>
          Book added successfully!
        </div>
      ) : (
        <form className="bookdetails" onSubmit={createBook}>
          <div className="col-1">
            <label>Upload Thumbnail</label>
            <img src={image} alt="preview image" style={{ maxHeight: '200px', marginBottom: '10px' }} />
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
              {loading ? 'Adding Book...' : 'Add Book'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default CreateBook;
