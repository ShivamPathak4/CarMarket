import React, { useEffect, useState } from "react";
import { Slide } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css';
import { toast } from "react-toastify";
import baseURL from "../baseURL"; 

const Description = () => {
  const id = localStorage.getItem("postId");
  const [specData, setSpecData] = useState({});
  const [loading, setLoading] = useState(true);
  const [imageLoading, setImageLoading] = useState(true);
  const [showContact, setShowContact] = useState(false);

  useEffect(() => {
    fetch(`${baseURL}/sellcar/getdatabyid/${id}`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("Buycartoken"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        setSpecData(result.data);
        setLoading(false);
      })
      .catch(err => {
        toast.error("Failed to load car details");
        setLoading(false);
      });
  }, [id]);

  const slideProperties = {
    duration: 3000,
    transitionDuration: 500,
    infinite: true,
    indicators: true,
    scale: 0.4,
    arrows: true,
    prevArrow: (
      <div className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white/80 p-1 sm:p-2 rounded-full cursor-pointer hover:bg-white transition-all z-10">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-6 sm:w-6 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </div>
    ),
    nextArrow: (
      <div className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white/80 p-1 sm:p-2 rounded-full cursor-pointer hover:bg-white transition-all z-10">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-6 sm:w-6 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    )
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const specifications = [
    { label: "Car Manufacturer", value: specData.car_Manufacturer },
    { label: "Name of Model", value: specData.model },
    { label: "Year of Model", value: specData.year || 2015 },
    { label: "Km on Odometer", value: `${specData.KMs_on_Odometer || 0} KM` },
    { label: "Registration Place", value: specData.Registration_Place },
    { label: "Original Color", value: specData.Original_Paint },
    { label: "Number of Accidents", value: specData.Number_of_accidents_reported || 0 },
    { label: "Number of Owners", value: specData.Number_of_previous_buyers || 0 },
    { label: "Major Scratches", value: specData.Major_Scratches || 0 },
    { label: "Asking Price", value: `₹ ${specData.price || 0}` },
    { label: "Posted By", value: specData.name }
  ];

  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8 mt-3 sm:mt-5 max-w-7xl">
      {/* Image Carousel Section */}
      <div className="mb-8 sm:mb-12">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6 px-2">Car Images</h2>
        <div className="relative rounded-xl overflow-hidden shadow-lg">
          {imageLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
              <div className="w-8 h-8 sm:w-12 sm:h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
          <div className="aspect-w-16 aspect-h-9">
            <Slide {...slideProperties}>
              {specData.images?.map((url, index) => (
                <div key={index} className="relative w-full h-full">
                  <img
                    src={url}
                    alt={`Car Image ${index + 1}`}
                    className="w-full h-full object-contain bg-gray-100"
                    onLoad={() => setImageLoading(false)}
                    onError={() => setImageLoading(false)}
                  />
                </div>
              ))}
            </Slide>
          </div>
        </div>
      </div>

      {/* Dealer's Data Section */}
      <div className="px-2">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">Car Details</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {specifications.map(({ label, value }, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="p-4 sm:p-6">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1 sm:mb-2">
                  {label}
                </h3>
                <p className="text-lg sm:text-xl font-medium text-gray-900">
                  {value}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Section */}
      <div className="mt-8 sm:mt-12 px-2">
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Contact Details</h2>
            {showContact ? (
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="text-base sm:text-lg font-medium text-gray-900">{specData.phone || "+91 9876543210"}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="text-base sm:text-lg font-medium text-gray-900">{specData.email || "dealer@buycars.com"}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="text-base sm:text-lg font-medium text-gray-900">{specData.location || specData.Registration_Place}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <button 
                  onClick={() => setShowContact(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 sm:py-3 px-6 sm:px-8 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                >
                  Show Contact Details
                </button>
                <p className="mt-3 sm:mt-4 text-sm text-gray-500">Click to view seller's contact information</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Description;
