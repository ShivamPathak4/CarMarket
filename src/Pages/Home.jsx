import React, { useEffect, useState } from "react";
import { RiHome4Fill } from "react-icons/ri";
import { BiCalendar, BiSearch } from "react-icons/bi";
import { toast } from "react-toastify";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Loader from "../Components/Loader";
import API_BASE_URL from "../baseURL";

const Home = () => {
  const [myPost, setMyPost] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [showSearch, setShowSearch] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  const alertError = (msg) => toast.error(msg);
  const alertSuccess = (msg) => toast.success(msg);

  useEffect(() => {
    const controlSearchBar = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > 200) {
        if (currentScrollY < lastScrollY) {
          setShowSearch(true);
        } else {
          setShowSearch(false);
        }
      } else {
        setShowSearch(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", controlSearchBar);
    return () => window.removeEventListener("scroll", controlSearchBar);
  }, [lastScrollY]);

  const fetchCars = (query = "") => {
    setLoading(true);
    const url = query
      ? `${API_BASE_URL}/sellcar/searchcars?query=${query}`
      : `${API_BASE_URL}/sellcar/getdata`;

    fetch(url, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("Buycartoken"),
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch data");
        }
        return res.json();
      })
      .then((result) => {
        if (query && result.error) {
          alertError(result.error);
          setMyPost([]);
        } else if (query && result.post?.length === 0) {
          alertError("No data found matching the search query.");
          setMyPost([]);
        } else {
          setMyPost(result.post || result);
          if (query) alertSuccess("Search completed successfully!");
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        alertError("Failed to fetch data");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get("query");
    setSearchQuery(query || "");
    fetchCars(query);
  }, [location.search]);

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      alertError("Search query cannot be empty");
      return;
    }
    navigate(`?query=${encodeURIComponent(searchQuery)}`);
  };

  const showDescription = (id) => {
    localStorage.setItem("postId", id);
    navigate("/description");
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-gray-50 md:mt-10">
      {/* Sticky Search Bar */}
      <div
        className={`fixed top-0 left-0 right-0 z-50 bg-white shadow-md transform transition-transform duration-300 ${
          showSearch ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="container mx-auto px-4 py-3">
          <div className="relative max-w-xl mx-auto">
            <input
              type="text"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Search cars..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
            />
            <BiSearch className="absolute left-3 top-2.5 text-gray-400 h-5 w-5" />
            <button
              onClick={handleSearch}
              className="absolute right-3 top-2 text-blue-500 hover:text-blue-600"
            >
              Search
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
              <div className="space-y-4">
                <div>
                  <div className="relative">
                    <input
                      type="text"
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Search cars..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleSearch();
                        }
                      }}
                    />
                    <BiSearch className="absolute left-3 top-2.5 text-gray-400 h-5 w-5" />
                    <button
                      onClick={handleSearch}
                      className="absolute right-3 top-2 text-blue-500 hover:text-blue-600"
                    >
                      Search
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            {myPost.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myPost.map((el) => (
                  <div
                    key={el._id}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-200"
                  >
                    <div className="relative pt-[56.25%]">
                      <img
                        src={el.images[0]}
                        alt={`${el.car_Manufacturer} ${el.model}`}
                        className="absolute top-0 left-0 w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4 space-y-3">
                      <div className="flex items-center space-x-2 text-gray-600">
                        <BiCalendar className="h-5 w-5" />
                        <span className="font-medium">{el.year}</span>
                        <span className="font-medium">{el.car_Manufacturer}</span>
                        <span className="text-sm">{el.model}</span>
                      </div>

                      <div className="text-sm text-gray-600">
                        KMs on Odometer: {el.KMs_on_Odometer}
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-blue-600">₹ {el.price}</span>
                        <div className="flex items-center space-x-1 text-gray-600">
                          <RiHome4Fill className="h-5 w-5" />
                          <span className="text-sm">{el.Registration_Place}</span>
                        </div>
                      </div>

                      <div className="text-sm text-gray-600">
                        Color: {el.Original_Paint}
                      </div>

                      <button
                        onClick={() => showDescription(el._id)}
                        className="w-full mt-4 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 rounded-lg transition duration-200"
                      >
                        Show Description
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-64 bg-white rounded-lg shadow-md">
                <div className="text-center">
                  <p className="text-gray-600 text-lg">No cars found matching your search.</p>
                  <p className="text-gray-400 text-sm mt-2">Try adjusting your search criteria.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
