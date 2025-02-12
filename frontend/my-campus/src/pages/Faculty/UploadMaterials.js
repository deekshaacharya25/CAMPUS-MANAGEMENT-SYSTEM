import React, { useState, useEffect } from "react";
import axios from "axios";

const UploadMaterials = ({ courseId }) => {
  const [materials, setMaterials] = useState([]); // Initialize with an empty array
  const [file, setFile] = useState(null); // Selected file
  const [pdfUrl, setPdfUrl] = useState(""); // PDF URL
  const [videoUrl, setVideoUrl] = useState(""); // YouTube video link
  const [title, setTitle] = useState(""); // Title of the material
  const [description, setDescription] = useState(""); // Description of the material
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(""); // Error messages

  const accessToken = localStorage.getItem('access_token');

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/course/materials?course_id=${courseId}`, {
          headers: { 'access_token': accessToken }
        });
        setMaterials(response.data.responseData.materials || []); // Ensure materials is an array
      } catch (err) {
        console.error("Failed to fetch materials:", err);
        setError("Failed to fetch materials. Please try again later.");
      }
    };
    fetchMaterials();
  }, [courseId, accessToken]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError(""); // Clear previous errors
  };

  const handlePdfUpload = async () => {
    if (!pdfUrl) {
      setError("Please enter a PDF URL!");
      return;
    }

    setLoading(true);
    try {
      const newMaterial = {
        type: "pdf",
        pdfUrl,
        title,
        description,
        course_id: courseId,
        createdAt: new Date().toISOString(),
      };
      const response = await axios.post("http://localhost:3000/api/course/materials/upload/pdf", newMaterial, {
        headers: { 'access_token': accessToken }
      });
      console.log("PDF Upload Response:", response.data);
      setMaterials((prevMaterials) => [...prevMaterials, newMaterial]);
      setPdfUrl(""); // Clear the input field
      setTitle(""); // Clear the title field
      setDescription(""); // Clear the description field
    } catch (err) {
      console.error("Failed to upload PDF URL:", err);
      setError("Failed to upload PDF URL. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleVideoUpload = async () => {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
    if (!youtubeRegex.test(videoUrl)) {
      setError("Please enter a valid YouTube video URL!");
      return;
    }

    setLoading(true);
    try {
      const newMaterial = {
        type: "video",
        videoUrl, // Ensure the field name matches what the backend expects
        title,
        description,
        course_id: courseId,
        createdAt: new Date().toISOString(),
      };
      const response = await axios.post("http://localhost:3000/api/course/materials/upload/video", newMaterial, {
        headers: { 'access_token': accessToken }
      });
      console.log("Video Upload Response:", response.data);
      setMaterials((prevMaterials) => [...prevMaterials, newMaterial]);
      setVideoUrl(""); // Clear the input field
      setTitle(""); // Clear the title field
      setDescription(""); // Clear the description field
    } catch (err) {
      console.error("Failed to upload video:", err);
      setError("Failed to upload video. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async () => {
    if (!file) {
      setError("Please select a file to upload!");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("File size exceeds 5 MB. Please select a smaller file.");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", title);
      formData.append("description", description);
      formData.append("course_id", courseId);

      const response = await axios.post("http://localhost:3000/api/course/materials/upload/file", formData, {
        headers: { 
          "Content-Type": "multipart/form-data",
          'access_token': accessToken 
        },
      });

      const newMaterial = {
        type: "file",
        content: file.name,
        title,
        description,
        file_url: response.data.file_url, // Assuming the response contains the file URL
        createdAt: new Date().toISOString(),
        course_id: courseId,
      };
      setMaterials((prevMaterials) => [...prevMaterials, newMaterial]);
      setFile(null); // Clear the file input
      setTitle(""); // Clear the title field
      setDescription(""); // Clear the description field
      document.querySelector("input[type='file']").value = ""; // Reset input field
    } catch (err) {
      console.error("Failed to upload file:", err);
      setError("Failed to upload file. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="p-6 bg-white rounded shadow-md max-w-4xl mx-auto mt-10 h-96 overflow-y-auto">
      <h1 className="text-2xl font-bold mb-4">Upload Materials</h1>
      <p className="text-gray-600 mb-4">
        Upload study materials for your students here.
      </p>

      {error && <p className="text-red-500 mb-4">{error}</p>}
      {loading && <p className="text-blue-500 mb-4">Uploading...</p>}

      {/* File Upload Section */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Upload File</h2>
        <input
          type="file"
          onChange={handleFileChange}
          className="block w-full border p-2 rounded mb-2"
        />
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="block w-full border p-2 rounded mb-2"
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="block w-full border p-2 rounded mb-2"
        />
        <button
          onClick={handleFileUpload}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Upload File
        </button>
      </div>

      {/* PDF URL Upload Section */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Upload PDF URL</h2>
        <input
          type="url"
          placeholder="Enter PDF URL"
          value={pdfUrl}
          onChange={(e) => setPdfUrl(e.target.value)}
          className="block w-full border p-2 rounded mb-2"
        />
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="block w-full border p-2 rounded mb-2"
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="block w-full border p-2 rounded mb-2"
        />
        <button
          onClick={handlePdfUpload}
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
        >
          Upload PDF URL
        </button>
      </div>

      {/* Video Upload Section */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Upload YouTube Video</h2>
        <input
          type="url"
          placeholder="Enter YouTube video URL"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          className="block w-full border p-2 rounded mb-2"
        />
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="block w-full border p-2 rounded mb-2"
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="block w-full border p-2 rounded mb-2"
        />
        <button
          onClick={handleVideoUpload}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Upload Video
        </button>
      </div>

      {/* Uploaded Materials */}
      <div className="border rounded-md p-4 bg-gray-50">
        <h2 className="text-xl font-semibold mb-3">Uploaded Materials</h2>
        {materials.length === 0 ? (
          <p className="text-gray-500">No materials uploaded yet.</p>
        ) : (
          <ul className="list-disc list-inside">
            {materials.map((material, index) => (
              <li key={material._id || index} className="mb-2">
                {material.type === "file" ? (
                  <>
                    <a
                      href={material.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      <strong>{material.title}</strong>
                    </a>{" "}
                    - Uploaded on {formatDate(material.createdAt)}
                  </>
                ) : material.type === "pdf" ? (
                  <>
                    <a
                      href={material.content}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      {material.title}
                    </a>{" "}
                    - Uploaded on {formatDate(material.createdAt)}
                  </>
                ) : (
                  <>
                    <a
                      href={material.content}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      {material.title}
                    </a>{" "}
                    - Uploaded on {formatDate(material.createdAt)}
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default UploadMaterials;
