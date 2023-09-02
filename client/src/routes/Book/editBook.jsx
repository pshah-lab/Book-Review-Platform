import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import NoImageSelected from "../../assets/no-image-selected.jpg";

function EditBook() {
  const navigate = useNavigate();
  const urlSlug = useParams();
  const baseUrl = `http://localhost:8000/api/books/${urlSlug.slug}`;

  const [bookId, setBookId] = useState("");

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [stars, setStar] = useState(0);
  const [description, setDescription] = useState("");
  const [categories, setCategories] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [image, setImage] = useState("");

  // Added this line
  const [thumbnail, setThumbnail] = useState("");

  const fetchData = async () => {
    try {
      const response = await fetch(baseUrl);

      if (!response) {
        throw new Error("Failed to fetch data!");
      }

      const data = await response.json();
    //   console.log(data);

      {data.map(element => {

            // console.log(element);

          setBookId(element._id);
    
          setTitle(element.title);
          setSlug(element.slug);
          setStar(element.stars);
          setCategories(element.category);
          setDescription(element.description);
        //   console.log(element.thumbnail);
          setThumbnail(element.thumbnail);


      })}

    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const createBook = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("bookId", bookId);

    formData.append("title", title);
    formData.append("slug", slug);
    formData.append("stars", stars);
    formData.append("description", description);
    formData.append("category", categories);

    if (thumbnail) {
      formData.append("thumbnail", thumbnail);
    }

    try {
      const response = await fetch("http://localhost:8000/api/books", {
        method: "PUT",
        body: formData,
      });

      if (response.ok) {
        setTitle("");
        setSlug("");
        // setThumbnail(null);
        setSubmitted(true);
        console.log("Book added successfully!");
      } else {
        console.log("Failed to submit data");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(URL.createObjectURL(e.target.files[0]));
      setThumbnail(e.target.files[0]);
    }
  };

  const handleCategoryChange = (e) => {
    setCategories(e.target.value.split(",").map((category) => category.trim()));
  };

  const removeBook = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "http://localhost:8000/api/books/" + bookId,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        navigate("/books");
        console.log("Book Removed!");
      }
    } catch (error) {
        console.error(error);
    }
  };

  return (
    <div>
      <h1>Edit Book</h1>
      <p>This is where we use Node.js, Express & MongoDB to grab some data.</p>

      <button onClick={removeBook} className="delete">
        Delete Book
      </button>

      {submitted ? (
        <p>Data Submitted Successfully!</p>
      ) : (
        <form className="bookdetails" onSubmit={createBook}>
          <div className="col-1">
            <label>Upload Thumbnail</label>

            {image ? (
              <img src={`${image}`} alt="preview image" />
            ) : (
              <img
                src={`http://localhost:8000/uploads/${thumbnail}`}
                alt="preview image"
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
              <label>Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div>
              <label>Slug</label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
              />
            </div>
            <div>
              <label>Stars</label>
              <input
                type="text"
                value={stars}
                onChange={(e) => setStar(e.target.value)}
              />
            </div>
            <div>
              <label>Description</label>
              <textarea
                rows="4"
                cols="50"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div>
              <label>Categories (Comma-Separated)</label>
              <input
                type="test"
                value={categories}
                onChange={handleCategoryChange}
              />
            </div>
            <input type="submit" value="Update Book" />
          </div>
        </form>
      )}
    </div>
  );
}

export default EditBook;
