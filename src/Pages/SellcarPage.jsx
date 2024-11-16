import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { uploadAllImages } from "../config/clouinary";
import Loader from "../Components/Loader";
import { HiX, HiPlus } from "react-icons/hi";
import baseURL from "../baseURL"; 
const initData = {
  images: [],
  company: "",
  model: "",
  year: "",
  paint: "",
  tags: [],
  Num_of_prev_buyers: "",
  Registration_place: "",
  KM_driven: "",
  Major_scratches: "",
  price: "",
};

const SellcarPage = () => {
  const [inputData, setInputData] = useState(initData);
  const [imageUrls, setImageUrls] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const navigate = useNavigate();

  const {
    company,
    model,
    year,
    paint,
    tags,
    Num_of_prev_buyers,
    Registration_place,
    KM_driven,
    Major_scratches,
    price,
  } = inputData;

  const alertError = (msg) => toast.error(msg);
  const alertSuccess = (msg) => toast.success(msg);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (imageFiles.length === 0) {
      alertError("Please select at least one image");
      return;
    }

    if (imageFiles.length > 10) {
      alertError("Maximum 10 images allowed");
      return;
    }

    const uploadedUrls = await uploadAllImages(imageFiles);
    if (!uploadedUrls) return;

    try {
      setLoading(true);
      const response = await fetch(`${baseURL}/sellcar/addcar`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("Buycartoken"),
        },
        body: JSON.stringify({
          images: uploadedUrls,
          car_Manufacturer: company,
          model,
          year,
          Original_Paint: paint,
          tags,
          Number_of_previous_buyers: Num_of_prev_buyers,
          Registration_Place: Registration_place,
          KMs_on_Odometer: KM_driven,
          Major_Scratches: Major_scratches,
          price,
        }),
      });

      const data = await response.json();
      if (data.error) {
        alertError(data.error);
      } else {
        alertSuccess("Successfully Posted!");
        navigate("/");
      }
    } catch (error) {
      console.error("Error posting car data:", error);
      alertError("Failed to post car data");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { value, name } = e.target;
    setInputData({
      ...inputData,
      [name]: value,
    });
  };

  const handleImageSelect = (event) => {
    const files = Array.from(event.target.files);

    if (files.length > 10) {
      alertError("Maximum 10 images allowed");
      return;
    }

    setImageFiles(files);
    const newImageUrls = files.map((file) => URL.createObjectURL(file));
    setImageUrls(newImageUrls);
  };

  const handleAddTag = (e) => {
    e.preventDefault();
    if (!tagInput.trim()) return;

    setInputData((prev) => ({
      ...prev,
      tags: [...prev.tags, tagInput.trim()],
    }));
    setTagInput("");
  };

  const handleRemoveTag = (tag) => {
    setInputData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  };

  useEffect(() => {
    return () => {
      imageUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [imageUrls]);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 sm:p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Sell Your Car</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image Upload Section */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Images of Car (Select up to 10 images)
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-blue-500 transition-colors">
                <div className="space-y-1 text-center">
                  <div className="flex text-sm text-gray-600">
                    <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                      <span>Upload images</span>
                      <input
                        type="file"
                        className="sr-only"
                        multiple
                        accept="image/*"
                        onChange={handleImageSelect}
                      />
                    </label>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG up to 10 images</p>
                </div>
              </div>
              
              {imageUrls.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  {imageUrls.map((url, index) => (
                    <div key={index} className="relative aspect-w-1 aspect-h-1">
                      <img
                        src={url}
                        alt={`Preview ${index + 1}`}
                        className="object-cover rounded-lg"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Company</label>
                  <input
                    type="text"
                    name="company"
                    value={company}
                    onChange={handleChange}
                    placeholder="Enter car company (e.g., Maruti, Hyundai)"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Model</label>
                  <input
                    type="text"
                    name="model"
                    value={model}
                    onChange={handleChange}
                    placeholder="e.g., Wagon R, Vitara Brezza"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Year</label>
                  <input
                    type="number"
                    name="year"
                    value={year}
                    onChange={handleChange}
                    placeholder="e.g., 2010, 2021"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Paint</label>
                  <input
                    type="text"
                    name="paint"
                    value={paint}
                    onChange={handleChange}
                    placeholder="e.g., Red, White"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Tags</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-1 inline-flex items-center p-0.5 hover:bg-blue-200 rounded-full"
                        >
                          <HiX className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleAddTag(e)}
                      placeholder="Add a tag and press Enter"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                    <button
                      type="button"
                      onClick={handleAddTag}
                      className="ml-2 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <HiPlus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Number of previous buyers
                  </label>
                  <input
                    type="number"
                    name="Num_of_prev_buyers"
                    value={Num_of_prev_buyers}
                    onChange={handleChange}
                    placeholder="e.g., 1, 2, 3"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Registration Place
                  </label>
                  <input
                    type="text"
                    name="Registration_place"
                    value={Registration_place}
                    onChange={handleChange}
                    placeholder="e.g., city name"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    KMs on Odometer
                  </label>
                  <input
                    type="number"
                    name="KM_driven"
                    value={KM_driven}
                    onChange={handleChange}
                    placeholder="e.g., 12000, 15000"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Major Scratches
                  </label>
                  <input
                    type="number"
                    name="Major_scratches"
                    value={Major_scratches}
                    onChange={handleChange}
                    placeholder="e.g., 1, 2, 3"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Price</label>
                  <input
                    type="number"
                    name="price"
                    value={price}
                    onChange={handleChange}
                    placeholder="e.g., 500000, 110000"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
              >
                {loading ? "Submitting..." : "Submit"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SellcarPage;