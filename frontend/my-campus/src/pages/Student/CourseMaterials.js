import React, { useState } from "react";

const CourseMaterials = () => {
  const [materials, setMaterials] = useState([]); // List of uploaded materials
  const [file, setFile] = useState(null); // Selected file
  const [videoUrl, setVideoUrl] = useState(""); // YouTube video link

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleVideoUpload = () => {
    if (videoUrl.trim() === "") {
      alert("Please enter a valid YouTube video URL!");
      return;
    }

    const newMaterial = {
      id: Date.now(),
      type: "video",
      content: videoUrl,
      date: new Date().toLocaleDateString(),
    };
    setMaterials((prevMaterials) => [...prevMaterials, newMaterial]);
    setVideoUrl(""); // Clear the input field
  };

  const handleFileUpload = () => {
    if (!file) {
      alert("Please select a file to upload!");
      return;
    }

    const newMaterial = {
      id: Date.now(),
      type: "file",
      content: `/uploads/${file.name}`, // Assuming the file is uploaded to the /public/uploads directory
      date: new Date().toLocaleDateString(),
    };
    setMaterials((prevMaterials) => [...prevMaterials, newMaterial]);
    setFile(null); // Clear the file input
  };

  return (
    <div className="p-6 bg-white rounded shadow-md max-w-3xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Course Materials</h1>
      <p className="text-gray-600 mb-4">
        Access and upload study materials (PDFs or YouTube videos) for your students here.
      </p>

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
                    📄 <a href={material.content} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                      <strong>{material.content}</strong>
                    </a> - Uploaded on {material.date}
                  </>
                ) : (
                  <>
                    🎥{" "}
                    <div className="my-4">
                      <iframe
                        width="560"
                        height="315"
                        src={`https://www.youtube.com/embed/${new URL(material.content).searchParams.get("v")}`}
                        title="YouTube video"
                        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
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

export default CourseMaterials;
