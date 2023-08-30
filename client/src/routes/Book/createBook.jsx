import React, { useState } from "react";
import NoImageSelected from "../../assets/no-image-selected.jpg";

function createBook() {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  // const [stars, setStar] = useState(0);
  // const [description, setDescription] = useState("");
  // const [categories, setCategories] = useState([]);
  // const [thumbnail, setThumbnail] = useState(null);
  // const [submitted, setSubmitted] = useState("");

  const createBook = async (e) => {
    e.preventDefault();
    console.table([title, slug]);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("slug", slug);
    // formData.append("stars", stars);
    // formData.append("description", description);
    // formData.append("category", categories);
    // formData.append("thumbnail", thumbnail);



    try {

      // const response = await fetch("http://localhost:8000/api/books", {
      //   method: "POST",
      //   body: formData,
      // });
      
      const response = await fetch("http://localhost:8000/api/books", {
        method: "POST",
        headers: { "Content-Type": "applications/json" },
        body: JSON.stringify(
          {
          title: title,
          slug: slug,
          }
        )
      })

      if (response.ok) {
        setTitle("");
        setSlug("");
        // setSubmitted(true);
      } else {
        // console.log("Failed to Submit Data");
        console.log(response);
      }
    } catch (error) {
      console.log(error);
    }
  };


  const handleCategoryChange = (e) => {
    setCategories(e.target.value.split(",").map((category) => category.trim()));
  }


  return (
    <div>
      <h1>Create Book</h1>
      <p>
        This is where we use NodeJs, Express & MongoDB to grab some data. The
        data below is pulled from a MongoDB database.
      </p>

      
        <form className="bookdetails" onSubmit={createBook}>
          <div className="col-1">
            <label>Upload Thumbnail</label>
            <img src={NoImageSelected} alt="preview image" />
            <input type="file" accept="image/gif, image/jpeg, image/png" />
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


            {/* <div>
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
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

        
            <div>
              <label>Categories (comma-separated)</label>
              <input
                type="text"
                value={categories}
                onChange={handleCategoryChange}
              />
            </div> */}

            <input type="submit" value="Add Book" />
          </div>
        </form>
   
    </div>
  );
}

export default createBook;
