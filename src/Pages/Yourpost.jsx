import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import baseURL from "../baseURL"; 
const YourPost = () => {
  const [myPost, setMyPost] = useState([]);
  const [myName, setMyName] = useState("");
  const [loading, setLoading] = useState(true);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [updateFormData, setUpdateFormData] = useState({
    car_Manufacturer: "",
    model: "",
    year: "",
    Original_Paint: "",
    Number_of_previous_buyers: "",
    Registration_Place: "",
    KMs_on_Odometer: "",
    Major_Scratches: "",
    price: "",
    images: [],
    tags: []
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${baseURL}/sellcar/getpost/${JSON.parse(localStorage.getItem("user"))._id}`,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("Buycartoken"),
          },
        }
      );
      const data = await response.json();
      setMyPost(data.post);
      setMyName(data.user.name);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = (post) => {
    setSelectedPost(post);
    setUpdateFormData({
      car_Manufacturer: post.car_Manufacturer,
      model: post.model,
      year: post.year,
      Original_Paint: post.Original_Paint,
      Number_of_previous_buyers: post.Number_of_previous_buyers,
      Registration_Place: post.Registration_Place,
      KMs_on_Odometer: post.KMs_on_Odometer,
      Major_Scratches: post.Major_Scratches,
      price: post.price,
      images: post.images,
      tags: post.tags || []
    });
    setIsUpdateModalOpen(true);
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${baseURL}/sellcar/updatedata/${selectedPost._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: "Bearer " + localStorage.getItem("Buycartoken"),
        },
        body: JSON.stringify(updateFormData)
      });
      if (response.ok) {
        fetchPosts();
        setIsUpdateModalOpen(false);
      }
    } catch (error) {
      console.error("Error updating post:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      setLoading(true);
      try {
        await fetch(`${baseURL}/sellcar/deletepost/${id}`, {
          method: 'DELETE',
          headers: {
            Authorization: "Bearer " + localStorage.getItem("Buycartoken"),
          }
        });
        fetchPosts();
      } catch (error) {
        console.error("Error deleting post:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (myPost.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">No Posts Yet</h2>
          <p className="text-gray-600 mb-6">Create your first post to get started!</p>
          <button
            onClick={() => navigate("/sellyourcar")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-md transition-colors"
          >
            Create Post
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Welcome, {myName}</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myPost.map((post) => (
            <div key={post._id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="relative h-48">
                <img
                  src={post.images[0]}
                  alt={post.car_Manufacturer}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-semibold text-gray-800">
                    {post.car_Manufacturer} {post.model}
                  </h3>
                  <span className="text-lg font-bold text-blue-600">₹{post.price.toLocaleString()}</span>
                </div>
                
                <div className="space-y-2 text-sm text-gray-600">
                  <p className="flex items-center gap-2">
                    <span className="font-medium">Year:</span> {post.year}
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="font-medium">Color:</span> {post.Original_Paint}
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="font-medium">KMs:</span> {post.KMs_on_Odometer}
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="font-medium">Location:</span> {post.Registration_Place}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 mt-3">
                  {post.tags?.map((tag, index) => (
                    <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => handleUpdate(post)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition-colors"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => handleDelete(post._id)}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-md transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {isUpdateModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Update Car Details</h2>
                <form onSubmit={handleUpdateSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Company
                      </label>
                      <input
                        type="text"
                        value={updateFormData.car_Manufacturer}
                        onChange={(e) => setUpdateFormData({...updateFormData, car_Manufacturer: e.target.value})}
                        className="w-full p-2 border rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Model
                      </label>
                      <input
                        type="text"
                        value={updateFormData.model}
                        onChange={(e) => setUpdateFormData({...updateFormData, model: e.target.value})}
                        className="w-full p-2 border rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Year
                      </label>
                      <input
                        type="number"
                        value={updateFormData.year}
                        onChange={(e) => setUpdateFormData({...updateFormData, year: e.target.value})}
                        className="w-full p-2 border rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Color
                      </label>
                      <input
                        type="text"
                        value={updateFormData.Original_Paint}
                        onChange={(e) => setUpdateFormData({...updateFormData, Original_Paint: e.target.value})}
                        className="w-full p-2 border rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Previous Buyers
                      </label>
                      <input
                        type="number"
                        value={updateFormData.Number_of_previous_buyers}
                        onChange={(e) => setUpdateFormData({...updateFormData, Number_of_previous_buyers: e.target.value})}
                        className="w-full p-2 border rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Registration Place
                      </label>
                      <input
                        type="text"
                        value={updateFormData.Registration_Place}
                        onChange={(e) => setUpdateFormData({...updateFormData, Registration_Place: e.target.value})}
                        className="w-full p-2 border rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Kilometers
                      </label>
                      <input
                        type="number"
                        value={updateFormData.KMs_on_Odometer}
                        onChange={(e) => setUpdateFormData({...updateFormData, KMs_on_Odometer: e.target.value})}
                        className="w-full p-2 border rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Major Scratches
                      </label>
                      <input
                        type="number"
                        value={updateFormData.Major_Scratches}
                        onChange={(e) => setUpdateFormData({...updateFormData, Major_Scratches: e.target.value})}
                        className="w-full p-2 border rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Price
                      </label>
                      <input
                        type="number"
                        value={updateFormData.price}
                        onChange={(e) => setUpdateFormData({...updateFormData, price: e.target.value})}
                        className="w-full p-2 border rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tags (comma-separated)
                      </label>
                      <input
                        type="text"
                        value={updateFormData.tags.join(", ")}
                        onChange={(e) => setUpdateFormData({...updateFormData, tags: e.target.value.split(",").map(tag => tag.trim())})}
                        className="w-full p-2 border rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Image URLs (comma-separated)
                      </label>
                      <input
                        type="text"
                        value={updateFormData.images.join(", ")}
                        onChange={(e) => setUpdateFormData({...updateFormData, images: e.target.value.split(",").map(url => url.trim())})}
                        className="w-full p-2 border rounded-md"
                      />
                    </div>
                  </div>

                  <div className="flex gap-4 mt-6">
                    <button
                      type="submit"
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition-colors"
                    >
                      Update
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsUpdateModalOpen(false)}
                      className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 rounded-md transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default YourPost;