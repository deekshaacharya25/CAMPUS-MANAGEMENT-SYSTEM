// import React, { useState } from "react";

// const UploadMaterials = () => {
//   const [materials, setMaterials] = useState([]); // List of uploaded materials
//   const [file, setFile] = useState(null); // Selected file
//   const [videoUrl, setVideoUrl] = useState(""); // YouTube video link

//   const handleFileChange = (e) => {
//     setFile(e.target.files[0]);
//   };

//   const handleVideoUpload = () => {
//     if (videoUrl.trim() === "") {
//       alert("Please enter a valid YouTube video URL!");
//       return;
//     }

//     const newMaterial = {
//       id: Date.now(),
//       type: "video",
//       content: videoUrl,
//       date: new Date().toLocaleDateString(),
//     };
//     setMaterials((prevMaterials) => [...prevMaterials, newMaterial]);
//     setVideoUrl(""); // Clear the input field
//   };

//   const handleFileUpload = () => {
//     if (!file) {
//       alert("Please select a file to upload!");
//       return;
//     }

//     const newMaterial = {
//       id: Date.now(),
//       type: "file",
//       content: file.name,
//       date: new Date().toLocaleDateString(),
//     };
//     setMaterials((prevMaterials) => [...prevMaterials, newMaterial]);
//     setFile(null); // Clear the file input
//   };

//   return (
//     <div className="p-6 bg-white rounded shadow-md max-w-3xl mx-auto mt-10">
//       <h1 className="text-2xl font-bold mb-4">Upload Materials</h1>
//       <p className="text-gray-600 mb-4">
//         Upload study materials (PDFs or YouTube videos) for your students here.
//       </p>

//       {/* File Upload Section */}
//       <div className="mb-4">
//         <h2 className="text-lg font-semibold mb-2">Upload PDF</h2>
//         <input
//           type="file"
//           accept=".pdf"
//           onChange={handleFileChange}
//           className="block w-full border p-2 rounded mb-2"
//         />
//         <button
//           onClick={handleFileUpload}
//           className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//         >
//           Upload PDF
//         </button>
//       </div>

//       {/* Video Upload Section */}
//       <div className="mb-4">
//         <h2 className="text-lg font-semibold mb-2">Upload YouTube Video</h2>
//         <input
//           type="url"
//           placeholder="Enter YouTube video URL"
//           value={videoUrl}
//           onChange={(e) => setVideoUrl(e.target.value)}
//           className="block w-full border p-2 rounded mb-2"
//         />
//         <button
//           onClick={handleVideoUpload}
//           className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
//         >
//           Upload Video
//         </button>
//       </div>

//       {/* Uploaded Materials */}
//       <div className="border rounded-md p-4 bg-gray-50">
//         <h2 className="text-xl font-semibold mb-3">Uploaded Materials</h2>
//         {materials.length === 0 ? (
//           <p className="text-gray-500">No materials uploaded yet.</p>
//         ) : (
//           <ul className="list-disc list-inside">
//             {materials.map((material) => (
//               <li key={material.id} className="mb-2">
//                 {material.type === "file" ? (
//                   <>
//                     📄 <strong>{material.content}</strong> - Uploaded on{" "}
//                     {material.date}
//                   </>
//                 ) : (
//                   <>
//                     🎥 <a
//                       href={material.content}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="text-blue-600 underline"
//                     >
//                       YouTube Video
//                     </a>{" "}
//                     - Uploaded on {material.date}
//                   </>
//                 )}
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>
//     </div>
//   );
// };

// export default UploadMaterials;


import React, { useState, useEffect } from "react";
import axios from "axios";

const UploadMaterials = () => {
  const [materials, setMaterials] = useState([]); // List of uploaded materials
  const [file, setFile] = useState(null); // Selected file
  const [videoUrl, setVideoUrl] = useState(""); // YouTube video link
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(""); // Error messages

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const response = await axios.get("/getMaterials");
        setMaterials(response.data);
      } catch (err) {
        console.error("Failed to fetch materials:", err);
      }
    };
    fetchMaterials();
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError(""); // Clear previous errors
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
        content: videoUrl,
        date: new Date().toLocaleDateString(),
      };
      await axios.post("/uploadMaterial", newMaterial);
      setMaterials((prevMaterials) => [...prevMaterials, newMaterial]);
      setVideoUrl(""); // Clear the input field
    } catch (err) {
      console.error("Failed to upload video:", err);
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

      const response = await axios.post("/uploadMaterial", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const newMaterial = {
        type: "file",
        content: file.name,
        date: new Date().toLocaleDateString(),
      };
      setMaterials((prevMaterials) => [...prevMaterials, newMaterial]);
      setFile(null); // Clear the file input
      document.querySelector("input[type='file']").value = ""; // Reset input field
    } catch (err) {
      console.error("Failed to upload file:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded shadow-md max-w-3xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Upload Materials</h1>
      <p className="text-gray-600 mb-4">
        Upload study materials (PDFs or YouTube videos) for your students here.
      </p>

      {error && <p className="text-red-500 mb-4">{error}</p>}
      {loading && <p className="text-blue-500 mb-4">Uploading...</p>}

      {/* File Upload Section */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Upload PDF</h2>
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          className="block w-full border p-2 rounded mb-2"
        />
        <button
          onClick={handleFileUpload}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Upload PDF
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
            {materials.map((material) => (
              <li key={material.id} className="mb-2">
                {material.type === "file" ? (
                  <>
                    📄 <strong>{material.content}</strong> - Uploaded on{" "}
                    {material.date}
                  </>
                ) : (
                  <>
                    🎥 <a
                      href={material.content}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      YouTube Video
                    </a>{" "}
                    - Uploaded on {material.date}
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
