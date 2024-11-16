import React, { useEffect, useState } from "react";
// import axios from "axios";
import "../Css/Home.css";
import { toast } from "react-toastify";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Spinner,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../baseURL"; 

const Search = () => {
  const [myPost, setMyPost] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // Global search query
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const alertError = (msg) => toast.error(msg);
  const alertSuccess = (msg) => toast.success(msg);

  // Fetch all posts on initial load
  useEffect(() => {
    setLoading(true);
    fetch(`${API_BASE_URL}/sellcar/getdata`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("Buycartoken"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        setMyPost(result);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        alertError("Failed to fetch data");
        setLoading(false);
      });
  }, []);

  // Fetch filtered data based on global search query
  const handleSearch = () => {
    if (!searchQuery.trim()) {
      alertError("Search query cannot be empty");
      return;
    }

    setLoading(true);
    fetch(`${API_BASE_URL}/sellcar/searchcars?query=${searchQuery}`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("Buycartoken"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.error) {
          alertError(result.error);
        } else {
          setMyPost(result.post);
          alertSuccess("Search completed successfully!");
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error searching cars:", error);
        alertError("Failed to search data");
        setLoading(false);
      });
  };

  const showDescription = (id) => {
    localStorage.setItem("postId", id);
    navigate("/description");
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Spinner thickness="4px" speed="0.65s" color="blue.500" size="xl" />
      </div>
    );
  }

  return (
    <div className="yourpost_container">
      <div className="yourpost">
        <div className="postandsidebar">
          <div className="sidebar">
            {/* Global search */}
            <FormControl>
              <FormLabel>Search for Cars</FormLabel>
              <Input
                type="text"
                placeholder="Search by tags, name, model, price, or city"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleSearch();
                  }
                }}
              />
            </FormControl>
            <Button
              style={{
                width: "100%",
                marginTop: "10px",
                backgroundColor: "skyblue",
                color: "white",
              }}
              onClick={handleSearch}
            >
              Search
            </Button>
          </div>

          <div className="posts">
            {myPost &&
              myPost.map((el) => (
                <div className="galary" key={el._id}>
                  <img
                    src={el.images[0]}
                    alt="post"
                    className="items"
                  />
                  <div className="details">
                    <p>{`Manufacturer: ${el.car_Manufacturer}`}</p>
                    <p>{`Model: ${el.model}`}</p>
                    <p>{`Year: ${el.year}`}</p>
                    <p>{`Price: ₹ ${el.price}`}</p>
                    <p>{`City: ${el.Registration_Place}`}</p>
                  </div>
                  <Button onClick={() => showDescription(el._id)}>
                    Show Description
                  </Button>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;
