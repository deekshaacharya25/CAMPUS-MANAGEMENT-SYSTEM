import React, { useState, useEffect, useRef } from "react"; // Adjust the path as necessary
import ProfileImage from "../../assets/profilepicture.jpg"; // Default image
import axios from "axios"; // Import axios for making HTTP requests
import { jwtDecode } from "jwt-decode"; // Correctly import the named export

const MyProfile = () => {
  const [faculty, setFaculty] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [updatedFaculty, setUpdatedFaculty] = useState({});
  const [updatedProfile, setUpdatedProfile] = useState({
    dateOfBirth: "",
    address: {
      street: "",
      city: "",
      state: "",
      pincode: ""
    },
    socialLinks: {
      linkedin: "",
      github: "",
      portfolio: ""
    },
    skills: [],
    department: "",
    designation: "",
  });
  const [selectedImage, setSelectedImage] = useState(null); 
  const fileInputRef = useRef(null); // Add ref for file input
  const [showEditOption, setShowEditOption] = useState(false); // State to control edit option visibility

  
  const fetchProfile = async () => {
    const accessToken = localStorage.getItem("access_token");

    if (!accessToken) {
        console.error("No access token found.");
        alert("Please log in again.");
        return;
    }

    let facultyId;
    try {
        const decodedToken = jwtDecode(accessToken);
        const currentTime = Date.now() / 1000;
        if (decodedToken.exp < currentTime) {
            console.error("Access token has expired.");
            alert("Access token has expired. Please log in again.");
            return;
        }
        facultyId = decodedToken.id; 
    } catch (error) {
        console.error("Failed to decode access token:", error);
        alert("Invalid access token.");
        return;
    }

    try {
        const userResponse = await axios.get(`http://localhost:3000/api/user/list/faculties`, {
            headers: {
                'access_token': accessToken,
            },
        });

        if (userResponse.data.responseCode === 200) {
            const loggedInFaculty = userResponse.data.responseData.find(faculty => faculty._id === facultyId);
            if (loggedInFaculty) {
                setFaculty(loggedInFaculty);
                
                // Fetch department name using departmentId
                const departmentId = loggedInFaculty.departmentId; // Assuming departmentId is available
                console.log(departmentId)
                if (departmentId) {
                    const departmentResponse = await axios.get(`http://localhost:3000/api/department/list/?department_id=${departmentId}`, {
                        headers: {
                            'access_token': accessToken,
                        },
                    });

                    if (departmentResponse.data.responseCode === 200) {
                        
                        const departmentName = departmentResponse.data.responseData[0]?.name;
                        console.log("Fetched Department Name:", departmentName);
                        setUpdatedProfile(prev => ({
                            ...prev,
                            department: departmentName || "N/A" 
                        }));
                }
            }
        } 
      }

        const profileResponse = await axios.get(`http://localhost:3000/api/profile/faculty/list/?faculty_id=${facultyId}`, {
            headers: {
                'access_token': accessToken,
            },
        });

        if (profileResponse.data.responseCode === 200) {
          const profileData = profileResponse.data.responseData;
          if (profileData.dateOfBirth) {
            const date = new Date(profileData.dateOfBirth);
            profileData.dateOfBirth = date.toISOString().split('T')[0];
          }
          setProfile(profileData);
          setUpdatedProfile(prev => ({
            ...prev,
            ...profileData
          }));
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        alert("An error occurred while fetching the data. Please try again.");
      }
    };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    setShowEditOption(false);
  };

  const handleProfileChange = (e, section, field) => {
    const { value } = e.target;
  try{
    if (section) {
      setUpdatedProfile(prev => {
        console.log('Previous state for section update:', prev);
        console.log(`Updating ${section}.${field} to:`, value);
        return {
          ...prev,
          [section]: {
            ...prev[section],
            [field]: value
          }
        };
      });
    } else {
      setUpdatedProfile(prev => ({
        ...prev,
        [field]: value
      }));
    }
  } catch (error) {
      console.error("Error updating profile field:", error);
      alert("Error updating field. Please try again.");
    }
  };

  const handleSave = async () => {
    const accessToken = localStorage.getItem("access_token");

    if (updatedProfile.dateOfBirth) {
      const dateOfBirth = new Date(updatedProfile.dateOfBirth);
      if (isNaN(dateOfBirth.getTime())) {
        alert("Please enter a valid date of birth");
        return;
      }
    }

    const formattedDate = updatedProfile.dateOfBirth ? new Date(updatedProfile.dateOfBirth).toISOString() : null;

    const profileData = {
      dateOfBirth: formattedDate,
      address: updatedProfile.address,
      socialLinks: updatedProfile.socialLinks,
      skills: Array.isArray(updatedProfile.skills) ? updatedProfile.skills : [],
      department: updatedProfile.department,
      designation: updatedProfile.designation,
    };

    try {

      const response = await axios.put(`http://localhost:3000/api/profile/faculty/add?faculty_id=${faculty._id}`, profileData, {
        headers: {
          access_token:accessToken, 
          'Content-Type': 'application/json'
        },
      });

      if (response.data.responseCode === 200) {
        await fetchProfile();
        setIsEditing(false);
        alert("Profile updated successfully!");
      } else {
        alert("Failed to update profile: " + response.data.responseMessage);
      }
    } catch (error) {
      console.error("Error updating profile:", error.response ? error.response.data : error.message);
      alert("Failed to update profile");
    }
  };


  const handleImageChange = async (event) => {
    const file = event.target.files[0]; 
    if (file) {

      if (file.size > 10 * 1024 * 1024) {
        alert("File size exceeds 10MB. Please select a smaller file.");
        return;
      }

      const formData = new FormData();
      formData.append('image', file); 

      const accessToken = localStorage.getItem("access_token"); 

      try {
  
        const response = await axios.put(`http://localhost:3000/api/user/edit/?u_id=${faculty._id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            access_token : accessToken, // Include access token in the headers
          },
        });

        if (response.data.responseCode === 200) {
          await fetchProfile();
          alert("Profile picture updated successfully!");
        } else {
          alert("Failed to update profile picture: " + response.data.responseMessage);
        }
      } catch (error) {
        console.error("Error updating profile picture:", error.response ? error.response.data : error.message);
        alert("Failed to update profile picture. Please try again."); // User-friendly error message
      }
    } 
  };

  const handleImageClick = () => {
    setShowEditOption(!showEditOption); // Toggle edit option visibility
  };

  const handleAddProfile = (e) => {
    e.preventDefault();
    setShowProfileForm(true);
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    
    const dateOfBirth = new Date(updatedProfile.dateOfBirth);
    if (isNaN(dateOfBirth.getTime())) {
      alert("Please enter a valid date of birth.");
      return;
    }

    try {
        const response = await axios.put(`http://localhost:3000/api/profile/faculty/add?faculty_id=${faculty._id}`,
        {
          dateOfBirth: updatedProfile.dateOfBirth,
          address: updatedProfile.address,
          designation: updatedProfile.designation,
          socialLinks: updatedProfile.socialLinks,
          skills: updatedProfile.skills,
          department: updatedProfile.department
        });

        if (response.data.responseCode === 200) {
            await fetchProfile();
            setIsEditing(false);
            alert("Profile updated successfully!");
            setShowProfileForm(false);
        } else {
            alert("Failed to update profile: " + response.data.responseMessage);
        }
    } catch (error) {
        console.error("Error updating profile:", error);
        alert("Failed to update profile. Please try again.");
    }
  };

  if (!faculty) {
    return <p>Loading profile...</p>;
  }


  const imageUrl = updatedFaculty.imagePreview || 
    (faculty?.image?.[0] ? `http://localhost:3000/uploads/${faculty.image[0]}` : ProfileImage);

  return (
    <div className="bg-white min-h-screen p-6">
      {/* Header with Add Profile Button */}
      <div className="max-w-6xl mx-auto mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-yellow-800">My Profile</h1>
        {!profile && (
          <button
            onClick={handleAddProfile}
            className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 transition-colors"
          >
            Add Profile
          </button>
        )}
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md">
        <div className="flex flex-col md:flex-row gap-8 p-6">
          {/* Left Section - Profile Photo and Basic Info */}
          <div className="md:w-1/3 flex flex-col items-center">
            <div className="relative mb-4">
              <img
                src={imageUrl}
                alt="Faculty Avatar"
                className="w-48 h-48 rounded-full object-cover border-2 border-yellow-200 cursor-pointer"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = ProfileImage;
                }}
                onClick={handleImageClick} // Show edit option on image click
              />
              {showEditOption && ( // Show edit option if toggled
                <>
                  <button
                    onClick={() => fileInputRef.current.click()} // Trigger file input click
                    className="absolute bottom-2 right-2 bg-white p-2 rounded-full shadow hover:bg-yellow-50"
                    title="Change Profile Picture"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-600" viewBox="0 0 20 20" fill="currentColor">
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
            <h2 className="text-xl font-bold text-yellow-800 mb-2">{faculty.name}</h2>
            <div className="space-y-2 text-center">
              <p className="text-gray-600">
                <span className="font-medium text-gray-600">Email:</span> {faculty.email}
              </p>
              <p className="text-gray-600">
                <span className="font-medium text-gray-600">Phone:</span> {faculty.phone}
              </p>
              <p className="text-gray-600">
                <span className="font-medium text-gray-600">Department:</span> {updatedProfile.department || "N/A"}
              </p>
              <p className="text-gray-600">
                <span className="font-medium text-gray-600">Designation:</span> {profile?.designation || "N/A"}
              </p>
            </div>
          </div>

          {/* Right Section - Profile Details */}
          <div className="md:w-2/3">
            {profile ? (
              <div className="space-y-6">
                

                {/* Skills */}
                <div className="border-b pb-4 mb-4">
                  <h2 className="text-xl font-semibold mb-3 text-yellow-800">Skills & Expertise</h2>
                  <div className="flex  justify-center flex-wrap gap-2">
                    {profile.skills?.map((skill, index) => (
                      <span key={index} className="bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-600">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Address Information */}
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-yellow-800 mb-3">Address Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <p className="text-gray-600">
                      <span className="font-medium text-gray-600">Street:</span> {profile.address?.street || "N/A"}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-medium text-gray-600">City:</span> {profile.address?.city || "N/A"}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-medium text-gray-600">State:</span> {profile.address?.state || "N/A"}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-medium text-gray-600">Pincode:</span> {profile.address?.pincode || "N/A"}
                    </p>
                  </div>
                </div>

                {/* Social Links */}
                {(profile.socialLinks?.linkedin || profile.socialLinks?.github || profile.socialLinks?.portfolio) && (
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-yellow-800 mb-3">Professional Links</h3>
                    <div className="space-y-2">
                      {profile.socialLinks?.linkedin && (
                        <a href={profile.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" 
                           className="text-blue-600 hover:text-blue-800 block">LinkedIn</a>
                      )}
                      {profile.socialLinks?.github && (
                        <a href={profile.socialLinks.github} target="_blank" rel="noopener noreferrer"
                           className="text-blue-600 hover:text-blue-800 block">GitHub</a>
                      )}
                      {profile.socialLinks?.portfolio && (
                        <a href={profile.socialLinks.portfolio} target="_blank" rel="noopener noreferrer"
                           className="text-blue-600 hover:text-blue-800 block">Portfolio</a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-gray-600">No profile information available. Click "Add Profile" to create your profile.</p>
            )}
          </div>
        </div>

        {/* Edit Button */}
        <div className="p-6 border-t border-gray-200">
          <button
            onClick={handleEditToggle}
            className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 transition-colors"
          >
            {isEditing ? "Cancel" : "Edit Profile"}
          </button>
        </div>
      </div>

      {/* Edit Form */}
      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-yellow-800">Edit Profile</h2>
              <button
                onClick={handleEditToggle}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-6">
              {/* Basic Information Section */}
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-yellow-800 mb-4">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-yellow-800 mb-1">Date of Birth</label>
                    <input
                      type="date"
                      value={updatedProfile.dateOfBirth || ''}
                      onChange={(e) => handleProfileChange(e, null, 'dateOfBirth')}
                      className="w-full border border-yellow-300 rounded-md p-2 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-yellow-800 mb-1">Designation</label>
                    <input
                      type="text"
                      value={updatedProfile.designation || ''}
                      onChange={(e) => handleProfileChange(e, null, 'designation')}
                      className="w-full border border-yellow-300 rounded-md p-2 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Skills Section */}
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-yellow-800 mb-4">Skills</h3>
                <div>
                  <label className="block text-sm font-medium text-yellow-800 mb-1">Skills (comma-separated)</label>
                  <input
                    type="text"
                    value={updatedProfile.skills?.join(', ') || ''}
                    onChange={(e) => setUpdatedProfile(prev => ({
                      ...prev,
                      skills: e.target.value.split(',').map(skill => skill.trim())
                    }))}
                    className="w-full border border-yellow-300 rounded-md p-2 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Address Information Section */}
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-yellow-800 mb-4">Address Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-yellow-800 mb-1">Street</label>
                    <input
                      type="text"
                      value={updatedProfile.address?.street || ''}
                      onChange={(e) =>handleProfileChange(e, 'address', 'street')}
                      className="w-full border border-yellow-300 rounded-md p-2 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-yellow-800 mb-1">City</label>
                    <input
                      type="text"
                      value={updatedProfile.address?.city || ''}
                      onChange={(e) => handleProfileChange(e, 'address', 'city')}
                      className="w-full border border-yellow-300 rounded-md p-2 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-yellow-800 mb-1">State</label>
                    <input
                      type="text"
                      value={updatedProfile.address?.state || ''}
                      onChange={(e) => handleProfileChange(e, 'address', 'state')}
                      className="w-full border border-yellow-300 rounded-md p-2 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-yellow-800 mb-1">Pincode</label>
                    <input
                      type="text"
                      value={updatedProfile.address?.pincode || ''}
                      onChange={(e) =>handleProfileChange(e, 'address', 'pincode')}
                      className="w-full border border-yellow-300 rounded-md p-2 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Social Links Section */}
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-yellow-800 mb-4">Social Links</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-yellow-800 mb-1">LinkedIn URL</label>
                    <input
                      type="url"
                      value={updatedProfile.socialLinks?.linkedin || ''}
                      onChange={(e) => handleProfileChange(e, 'socialLinks', 'linkedin')}
                      className="w-full border border-yellow-300 rounded-md p-2 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-yellow-800 mb-1">GitHub URL</label>
                    <input
                      type="url"
                      value={updatedProfile.socialLinks?.github || ''}
                      onChange={(e) => handleProfileChange(e, 'socialLinks', 'github')}
                      className="w-full border border-yellow-300 rounded-md p-2 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-yellow-800 mb-1">Portfolio URL</label>
                    <input
                      type="url"
                      value={updatedProfile.socialLinks?.portfolio || ''}
                      onChange={(e) => handleProfileChange(e, 'socialLinks', 'portfolio')}
                      className="w-full border border-yellow-300 rounded-md p-2 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-4 pt-4">
                <button
                  onClick={handleEditToggle}
                  className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-6 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showProfileForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">Add Profile Information</h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              handleProfileSubmit(e);
            }}>

              {/* Date of Birth Field */}
              <input
                type="date"
                name="dateOfBirth"
                placeholder="Date of Birth"
                value={updatedProfile.dateOfBirth}
                onChange={(e) => setUpdatedProfile({ ...updatedProfile, dateOfBirth: e.target.value })}
                className="border p-2 w-full rounded mb-4"
                required
              />

              {/* Address Information Section */}
              <h3 className="text-lg font-semibold mb-2">Address Information</h3>
              <input
                type="text"
                name="street"
                placeholder="Street"
                value={updatedProfile.address?.street}
                onChange={(e) => setUpdatedProfile({
                  ...updatedProfile,
                  address: {
                    ...updatedProfile.address,
                    street: e.target.value
                  }
                })}
                className="border p-2 w-full rounded mb-4"
                required
              />
              <input
                type="text"
                name="city"
                placeholder="City"
                value={updatedProfile.address?.city}
                onChange={(e) => setUpdatedProfile({
                  ...updatedProfile,
                  address: {
                    ...updatedProfile.address,
                    city: e.target.value
                  }
                })}
                className="border p-2 w-full rounded mb-4"
                required
              />
              <input
                type="text"
                name="state"
                placeholder="State"
                value={updatedProfile.address?.state}
                onChange={(e) => setUpdatedProfile({
                  ...updatedProfile,
                  address: {
                    ...updatedProfile.address,
                    state: e.target.value
                  }
                })}
                className="border p-2 w-full rounded mb-4"
                required
              />
              <input
                type="text"
                name="pincode"
                placeholder="Pincode"
                value={updatedProfile.address?.pincode}
                onChange={(e) => setUpdatedProfile({
                  ...updatedProfile,
                  address: {
                    ...updatedProfile.address,
                    pincode: e.target.value
                  }
                })}
                className="border p-2 w-full rounded mb-4"
                required
              />

              {/* Social Links Section */}
              <h3 className="text-lg font-semibold mb-2">Social Links</h3>
              <input
                type="url"
                name="linkedin"
                placeholder="LinkedIn Profile URL"
                value={updatedProfile.socialLinks.linkedin}
                onChange={(e) => setUpdatedProfile({
                  ...updatedProfile,
                  socialLinks: {
                    ...updatedProfile.socialLinks,
                    linkedin: e.target.value
                  }
                })}
                className="border p-2 w-full rounded mb-4"
              />
              <input
                type="url"
                name="github"
                placeholder="GitHub Profile URL"
                value={updatedProfile.socialLinks.github}
                onChange={(e) => setUpdatedProfile({
                  ...updatedProfile,
                  socialLinks: {
                    ...updatedProfile.socialLinks,
                    github: e.target.value
                  }
                })}
                className="border p-2 w-full rounded mb-4"
              />
              <input
                type="url"
                name="portfolio"
                placeholder="Portfolio Website URL"
                value={updatedProfile.socialLinks.portfolio}
                onChange={(e) => setUpdatedProfile({
                  ...updatedProfile,
                  socialLinks: {
                    ...updatedProfile.socialLinks,
                    portfolio: e.target.value
                  }
                })}
                className="border p-2 w-full rounded mb-4"
              />

              {/* Skills Section */}
              <h3 className="text-lg font-semibold mb-2">Skills</h3>
              <input
                type="text"
                name="skills"
                placeholder="Enter skills (comma separated)"
                value={updatedProfile.skills.join(", ")}
                onChange={(e) => setUpdatedProfile({
                  ...updatedProfile,
                  skills: e.target.value.split(",").map(skill => skill.trim())
                })}
                className="border p-2 w-full rounded mb-4"
              />

              {/* Department Field */}
              <input
                type="text"
                name="department"
                placeholder="Department"
                value={updatedProfile.department}
                onChange={(e) => setUpdatedProfile({ ...updatedProfile, department: e.target.value })}
                className="border p-2 w-full rounded mb-4"
                required
              />

              {/* Designation Field */}
              <input
                type="text"
                name="designation"
                placeholder="Designation"
                value={updatedProfile.designation}
                onChange={(e) => setUpdatedProfile({ ...updatedProfile, designation: e.target.value })}
                className="border p-2 w-full rounded mb-4"
                required
              />

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
          </div>
        </div>
      )}
    </div>
  );
};

export default MyProfile;
