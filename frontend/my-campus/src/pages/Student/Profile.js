import React, { useState, useEffect, useRef } from "react"; // Adjust the path as necessary
import ProfileImage from "../../assets/profilepicture.jpg"; // Default image
import axios from "axios"; // Import axios for making HTTP requests
import { jwtDecode } from "jwt-decode"; // Correctly import the named export

const MyProfile = () => {
  const [student, setStudent] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [updatedStudent, setUpdatedStudent] = useState({});
  const [updatedProfile, setUpdatedProfile] = useState({
    semester: "",
    dateOfBirth: "",
    address: {
      street: "",
      city: "",
      state: "",
      pincode: ""
    },
    academicDetails: {
      cgpa: "",
      backlogCount: 0,
      admissionYear: ""
    },
    socialLinks: {
      linkedin: "",
      github: "",
      portfolio: ""
    },
    skills: []
  });
  const [selectedImage, setSelectedImage] = useState(null); // Add state for new image
  const fileInputRef = useRef(null); // Add ref for file input

  const fetchProfile = async () => {
    const accessToken = localStorage.getItem("access_token");

    if (!accessToken || accessToken.split('.').length !== 3) {
      console.error("Invalid access token.");
      alert("Invalid access token. Please log in again.");
      return;
    }

    let studentId;
    try {
      const decodedToken = jwtDecode(accessToken);
      const currentTime = Date.now() / 1000;
      if (decodedToken.exp < currentTime) {
        console.error("Access token has expired.");
        alert("Access token has expired. Please log in again.");
        return;
      }
      studentId = decodedToken.id;
    } catch (error) {
      console.error("Failed to decode access token:", error);
      alert("Invalid access token.");
      return;
    }

    try {
      // Fetch user data
      const userResponse = await axios.get(`http://localhost:3000/api/user/list/students`, {
        headers: {
          'access_token': accessToken,
        },
      });

      if (userResponse.data.responseCode === 200) {
        const loggedInStudent = userResponse.data.responseData.find(student => student._id === studentId);
        
        if (loggedInStudent) {
          setStudent(loggedInStudent);
          setUpdatedStudent(loggedInStudent);
        }
      }

      // Fetch profile data
      const profileResponse = await axios.get(`http://localhost:3000/api/profile`, {
        params: { user_id: studentId },
        headers: {
          'access_token': accessToken,
        },
      });

      if (profileResponse.data.responseCode === 200) {
        setProfile(profileResponse.data.responseData);
        setUpdatedProfile(profileResponse.data.responseData);
      }

    } catch (error) {
      console.error("Error fetching profile:", error.response ? error.response.data : error.message);
      alert("An error occurred while fetching the profile.");
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedStudent({ ...updatedStudent, [name]: value });
  };

  // Add function to handle image selection
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
      // Preview the selected image
      const reader = new FileReader();
      reader.onloadend = () => {
        setUpdatedStudent(prev => ({
          ...prev,
          imagePreview: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Update handleSave to include image upload
  const handleSave = async () => {
    const accessToken = localStorage.getItem("access_token");
    try {
      const formData = new FormData();
      
      // Append all updated fields to formData
      Object.keys(updatedStudent).forEach(key => {
        if (key !== 'imagePreview') {
          formData.append(key, updatedStudent[key]);
        }
      });

      // Append the new image if selected
      if (selectedImage) {
        formData.append('image', selectedImage);
      }

      const response = await axios.put(
        `http://localhost:3000/api/user/edit/?u_id=${student._id}`,
        formData,
        {
          headers: {
            'access_token': accessToken,
            'Content-Type': 'multipart/form-data', // Important for file upload
          },
        }
      );

      if (response.data.responseCode === 200) {
        setStudent(response.data.responseData);
        setIsEditing(false);
        setSelectedImage(null);
      } else {
        console.error("Failed to update profile:", response.data.responseMessage);
      }
    } catch (error) {
      console.error("Error updating student profile:", error);
    }
  };

  // Add function to trigger file input click
  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleAddProfile = () => {
    setShowProfileForm(true);
  };

  const handleProfileSubmit = async () => {
    try {
      const accessToken = localStorage.getItem("access_token");
      await axios.put(
        `http://localhost:3000/api/profile/update`,
        updatedProfile,
        {
          headers: {
            'access_token': accessToken
          }
        }
      );
      setShowProfileForm(false);
      fetchProfile(); // Refresh the profile data
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  if (!student) {
    return <p>Loading profile...</p>;
  }

  // Update image URL construction
  const imageUrl = updatedStudent.imagePreview || 
    (student?.image?.[0] ? `http://localhost:3000/uploads/${student.image[0]}` : ProfileImage);

  return (
    <div className="profile-page bg-white p-6 rounded shadow-md">
      {/* Add Profile Button */}
      <div className="flex justify-end mb-4">
        {!profile && (
          <button
            onClick={handleAddProfile}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add Profile
          </button>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Left Section: Profile Photo */}
        <div className="md:w-1/3 flex flex-col items-center">
          <div className="relative">
            <img
              src={imageUrl}
              alt="Student Avatar"
              className="rounded-full w-48 h-48 object-cover border border-gray-300 mb-4"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = ProfileImage;
              }}
            />
            {isEditing && (
              <>
                <button
                  onClick={handleImageClick}
                  className="absolute bottom-6 right-0 bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600"
                  title="Change Profile Picture"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  className="hidden"
                />
              </>
            )}
          </div>
          <h1 className="text-2xl font-bold">{student.name}</h1>
        </div>

        {/* Right Section: Profile Details */}
        <div className="md:w-2/3">
          <div className="space-y-4">
            {/* Basic Information */}
            <div className="border-b pb-4">
              <h2 className="text-xl font-semibold mb-3">Basic Information</h2>
              <p><span className="font-medium">Email:</span> {student.email}</p>
              <p><span className="font-medium">Phone:</span> {student.phone}</p>
              <p><span className="font-medium">Department:</span> {student.department}</p>
            </div>

            {/* Academic Information */}
            {profile && (
              <>
                <div className="border-b pb-4">
                  <h2 className="text-xl font-semibold mb-3">Academic Details</h2>
                  <p><span className="font-medium">Semester:</span> {profile.semester}</p>
                  <p><span className="font-medium">CGPA:</span> {profile.academicDetails?.cgpa}</p>
                  <p><span className="font-medium">Backlogs:</span> {profile.academicDetails?.backlogCount}</p>
                  <p><span className="font-medium">Admission Year:</span> {profile.academicDetails?.admissionYear}</p>
                </div>

                {/* Contact Information */}
                <div className="border-b pb-4">
                  <h2 className="text-xl font-semibold mb-3">Contact Information</h2>
                  <p><span className="font-medium">Address:</span></p>
                  <p className="ml-4">{profile.address?.street}</p>
                  <p className="ml-4">{profile.address?.city}, {profile.address?.state}</p>
                  <p className="ml-4">{profile.address?.pincode}</p>
                </div>

                {/* Professional Links */}
                <div className="border-b pb-4">
                  <h2 className="text-xl font-semibold mb-3">Professional Links</h2>
                  <p><span className="font-medium">LinkedIn:</span> <a href={profile.socialLinks?.linkedin} className="text-blue-500 hover:underline">{profile.socialLinks?.linkedin}</a></p>
                  <p><span className="font-medium">GitHub:</span> <a href={profile.socialLinks?.github} className="text-blue-500 hover:underline">{profile.socialLinks?.github}</a></p>
                  <p><span className="font-medium">Portfolio:</span> <a href={profile.socialLinks?.portfolio} className="text-blue-500 hover:underline">{profile.socialLinks?.portfolio}</a></p>
                </div>

                {/* Skills */}
                <div>
                  <h2 className="text-xl font-semibold mb-3">Skills</h2>
                  <div className="flex flex-wrap gap-2">
                    {profile.skills?.map((skill, index) => (
                      <span key={index} className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Address Information */}
            <div className="border-b pb-4">
              <h2 className="text-xl font-semibold mb-3">Address Information</h2>
              <div className="space-y-2">
                <input
                  type="text"
                  name="street"
                  placeholder="Street Address"
                  value={updatedProfile.address?.street || ""}
                  onChange={(e) => setUpdatedProfile({
                    ...updatedProfile,
                    address: {
                      ...updatedProfile.address,
                      street: e.target.value
                    }
                  })}
                  className="border p-2 w-full rounded"
                />
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={updatedProfile.address?.city || ""}
                  onChange={(e) => setUpdatedProfile({
                    ...updatedProfile,
                    address: {
                      ...updatedProfile.address,
                      city: e.target.value
                    }
                  })}
                  className="border p-2 w-full rounded"
                />
                <input
                  type="text"
                  name="state"
                  placeholder="State"
                  value={updatedProfile.address?.state || ""}
                  onChange={(e) => setUpdatedProfile({
                    ...updatedProfile,
                    address: {
                      ...updatedProfile.address,
                      state: e.target.value
                    }
                  })}
                  className="border p-2 w-full rounded"
                />
                <input
                  type="text"
                  name="pincode"
                  placeholder="Pincode"
                  value={updatedProfile.address?.pincode || ""}
                  onChange={(e) => setUpdatedProfile({
                    ...updatedProfile,
                    address: {
                      ...updatedProfile.address,
                      pincode: e.target.value
                    }
                  })}
                  className="border p-2 w-full rounded"
                />
              </div>
            </div>
          </div>

          {/* Edit Button */}
          <div className="mt-6">
            <button
              onClick={() => setIsEditing(true)}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Edit Profile
            </button>
          </div>
        </div>
      </div>

      {/* Add Profile Form Modal */}
      {showProfileForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-2xl">
            <h2 className="text-2xl font-bold mb-4">Add Profile Information</h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              handleProfileSubmit();
            }}>
              {/* Form fields for all profile information */}
              {/* ... Add input fields for all profile data ... */}
              <div className="flex justify-end gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => setShowProfileForm(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Save Profile
                </button>
              </div>
            </form>

            {/* Academic Details Section */}
            <div className="border-b pb-4 mb-4">
              <h2 className="text-xl font-semibold mb-3">Academic Details</h2>
              <div className="space-y-2">
                <input
                  type="number"
                  name="cgpa"
                  step="0.01"
                  min="0"
                  max="10"
                  placeholder="CGPA"
                  value={updatedProfile.academicDetails?.cgpa || ""}
                  onChange={(e) => setUpdatedProfile({
                    ...updatedProfile,
                    academicDetails: {
                      ...updatedProfile.academicDetails,
                      cgpa: parseFloat(e.target.value)
                    }
                  })}
                  className="border p-2 w-full rounded"
                />
                <input
                  type="number"
                  name="backlogCount"
                  min="0"
                  placeholder="Number of Backlogs"
                  value={updatedProfile.academicDetails?.backlogCount || ""}
                  onChange={(e) => setUpdatedProfile({
                    ...updatedProfile,
                    academicDetails: {
                      ...updatedProfile.academicDetails,
                      backlogCount: parseInt(e.target.value)
                    }
                  })}
                  className="border p-2 w-full rounded"
                />
                <input
                  type="number"
                  name="admissionYear"
                  min="2000"
                  max="2099"
                  placeholder="Admission Year"
                  value={updatedProfile.academicDetails?.admissionYear || ""}
                  onChange={(e) => setUpdatedProfile({
                    ...updatedProfile,
                    academicDetails: {
                      ...updatedProfile.academicDetails,
                      admissionYear: parseInt(e.target.value)
                    }
                  })}
                  className="border p-2 w-full rounded"
                />
              </div>
            </div>

            {/* Social Links Section */}
            <div className="border-b pb-4 mb-4">
              <h2 className="text-xl font-semibold mb-3">Social Links</h2>
              <div className="space-y-2">
                <input
                  type="url"
                  name="linkedin"
                  placeholder="LinkedIn Profile URL"
                  value={updatedProfile.socialLinks?.linkedin || ""}
                  onChange={(e) => setUpdatedProfile({
                    ...updatedProfile,
                    socialLinks: {
                      ...updatedProfile.socialLinks,
                      linkedin: e.target.value
                    }
                  })}
                  className="border p-2 w-full rounded"
                />
                <input
                  type="url"
                  name="github"
                  placeholder="GitHub Profile URL"
                  value={updatedProfile.socialLinks?.github || ""}
                  onChange={(e) => setUpdatedProfile({
                    ...updatedProfile,
                    socialLinks: {
                      ...updatedProfile.socialLinks,
                      github: e.target.value
                    }
                  })}
                  className="border p-2 w-full rounded"
                />
                <input
                  type="url"
                  name="portfolio"
                  placeholder="Portfolio Website URL"
                  value={updatedProfile.socialLinks?.portfolio || ""}
                  onChange={(e) => setUpdatedProfile({
                    ...updatedProfile,
                    socialLinks: {
                      ...updatedProfile.socialLinks,
                      portfolio: e.target.value
                    }
                  })}
                  className="border p-2 w-full rounded"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyProfile;
