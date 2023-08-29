import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";

function SingleBook() { // Function names should start with capital letters
  const [data, setData] = useState({}); // Initialize state with an object, not an array

  const { slug } = useParams(); // Destructure the slug from the params

  const baseUrl = `http://localhost:8000/api/books/${slug}`;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(baseUrl);

        if (!response.ok) {
          throw new Error("Failed to fetch data!");
        }

        const jsonData = await response.json();

        setData(jsonData);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [slug]); // Include slug as a dependency to re-fetch when the slug changes

  return (
    <div>
      <Link to={"/books"}>🔙Books</Link>

      <div className="bookdetails">
        <div className="col-1">
          <img
            src={`http://localhost:8000/uploads/${data.thumbnail}`}
            alt={data.title}
          />
          <br />
          <Link to={`/editbook/${data.slug}`}>✏️Edit</Link>
        </div>

        <div className="col-2">
          <h1>{data.title}</h1>
          <p>{data.description}</p>
          <p>{data.stars}</p>

          <p>Category</p>
          <ul>
            {data.category?.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default SingleBook;
