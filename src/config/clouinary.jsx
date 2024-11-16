const CLOUDINARY_CLOUD_NAME = "dnkocy8w8";
const CLOUDINARY_UPLOAD_PRESET = "vn0c6zhs";
const CLOUDINARY_API_URL = `https://api.cloudinary.com/v1_1/dnkocy8w8/image/upload`;

export const uploadImageToCloudinary = async (file) => {
  const data = new FormData();
  data.append("file", file);
  data.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
  data.append("cloud_name", CLOUDINARY_CLOUD_NAME);

  try {
    const response = await fetch(CLOUDINARY_API_URL, {
      method: "POST",
      body: data
    });
    const imageData = await response.json();
    return imageData.url;
  } catch (error) {
    console.error("Error uploading image:", error);
    return null;
  }
};

export const uploadAllImages = async (files) => {
  try {
    const uploadPromises = files.map(file => uploadImageToCloudinary(file));
    const urls = await Promise.all(uploadPromises);
    const validUrls = urls.filter(url => url !== null);

    if (validUrls.length === 0) {
      return null;
    }

    return validUrls;
  } catch (error) {
    console.error("Error uploading images:", error);
    return null;
  }
};
