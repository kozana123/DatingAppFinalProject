import { router } from "expo-router";
import axios from 'axios';

const apiPreferencesUrl = "http://www.DatingServer.somee.com/api/userpreferences/"
const apiUsersUrl = "http://www.DatingServer.somee.com/api/users/"
const apiMatchesUrl = "http://www.DatingServer.somee.com/api/Matches/"



export const checkEmailExists = async (email) => {
  try {
    const res = await fetch(`${apiUsersUrl}check-email?email=${encodeURIComponent(email)}`);
    const data = await res.json();
    console.log(res);
    
    if (data.exists) {
      alert("Email already registered");
    } else {
      console.log("Email is available");
      return !data.exists
    }
  } catch (err) {
    console.error("Email check failed:", err);
  }
  
};


export const registerUser = async (newUser) => {
  const formData = new FormData();
  console.log("Register Run");
  
  // Append all text fields
  formData.append('UserName', newUser.name);
  formData.append('UserEmail', newUser.email);
  formData.append('UserPassword', newUser.password);
  formData.append('BirthDate', newUser.birthDate); // format: 'YYYY-MM-DD'
  formData.append('Gender', newUser.gender);
  formData.append('City', newUser.city);
  formData.append('Latitude', newUser.latitude.toString());
  formData.append('Longitude', newUser.longitude.toString());

  // Append the image
  const uriParts = newUser.image.split('.');
  const fileType = uriParts[uriParts.length - 1];
  
  

  formData.append('ProfileImageFile', {
    uri: newUser.image,
    name: `profile.${fileType}`,
    type: `image/${fileType}`
  });

  try {
    const response = await axios.post(apiUsersUrl+"register", formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log('Registration successful:', response.data);
    const userId = {userId: response.data.userId}
    
    router.push({pathname:"/registerPages/registerIntrest", params: userId})

  } catch (error) {
    console.error('Registration failed:', error.response?.data || error.message);
  }
};

export const RegisterPreferences = async (prefs, userPreference) => {
    console.log(userPreference);

    const preferences = {
      userId: userPreference.userId, // Replace with actual user ID
      preferredPartner: userPreference.genderPreference ,
      relationshipType: userPreference.interest,
      heightPreferences: "",
      religion: "",
      isSmoker: false,
      preferredDistanceKm: 30,
      minAgePreference: 25,
      maxAgePreference: 35,
      interests: prefs,
    };

    try {
      const response = await fetch(`${apiPreferencesUrl}userPreferences`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(preferences),
      });

      if (response.status === 204) {
        console.log("Preferences updated successfully.");
        router.push("/login")
      } else {
        const text = await response.text();
        console.warn("POST failed:",response.status, text);
      }
    } catch (error) {
      console.error("Error sending preferences:", error);
    }
  };

export const updateUserSearch = async (userPref, userId) => {
  try {
    console.log("updateUserSearch");
    
    const res = await fetch(`${apiPreferencesUrl}editUserPreferences/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        PreferredPartner: userPref.preferredPartner,
        PreferredDistanceKm: userPref. preferredDistanceKm,
        MinAgePreference: userPref.minAgePreference,
        MaxAgePreference: userPref.maxAgePreference,
        RelationshipType: userPref.relationshipType,
        HeightPreferences: userPref.heightPreferences,
        Religion: userPref.religion,
        IsSmoker: userPref.isSmoker,
        Interests: userPref.interests
      }),
    });

    if (res.status === 204) {
      console.log("updateUserSearch updated successfully");
    } else {
      console.log(await res.text());
      const text = await res.text();
      console.warn("Update failed:", text);
    }
  } catch (err) {
    console.error("Error updating preferences:", err);
  }
};


export const updateUserDetails = async (userPref, userId) => {
  try {
    
    const res = await fetch(`${apiPreferencesUrl}editUserDetails/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        PreferredPartner: userPref.preferredPartner,
        PreferredDistanceKm: userPref.preferredDistanceKm,
        MinAgePreference: userPref.minAgePreference,
        MaxAgePreference: userPref.maxAgePreference,
        RelationshipType: userPref.relationshipType,
        HeightPreferences: userPref.heightPreferences,
        Religion: userPref.religion,
        IsSmoker: userPref.isSmoker,
        Interests: userPref.interests
      }),
    });

    if (res.status === 204) {
      console.log("updateUserDetails updated successfully");
    } else {
      console.log(await res.text());
      const text = await res.text();
      
      console.warn("Update failed:", text);
    }
  } catch (err) {
    console.error("Error updating preferences:", err);
  }
};

export const updateProfileImage = async (userId, imageUri) => {
  try {
    const formData = new FormData();

    // Extract the file name from the image URI
    const fileName = imageUri.split('/').pop();
    const fileType = fileName.split('.').pop();

    formData.append('userId', userId); // Optional: if the backend needs it
    formData.append('newImage', {
      uri: imageUri,
      type: `image/${fileType}`,
      name: fileName,
    });

    const res = await fetch(`${apiUsersUrl}update-profile-image/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    });

    if (res.ok) {
      const result = await res.json();
      console.log('✅ Image updated:', result);
      return result;
    } else {
      const errText = await res.text();
      console.warn('⚠️ Failed to update image:', errText);
    }
  } catch (err) {
    console.error('❌ Error updating image:', err);
  }
};

export const updateUserLocation = async (userId, city, latitude, longitude) => {
  try {
    const response = await fetch(`${apiUsersUrl}updateLocation/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        city,
        latitude,
        longitude,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Location updated successfully:', data);
      return data;
    } else {
      const errorText = await response.text();
      console.warn('⚠️ Failed to update location:', errorText);
    }
  } catch (error) {
    console.error('❌ Error updating user location:', error);
  }
};

export const addMatch = async (user1ID, user2ID, matchStatus) => {
  try {
    const response = await fetch(`${apiMatchesUrl}add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user1ID,
        user2ID,
        matchStatus,
      }),
    });

    const contentType = response.headers.get('content-type');

    let data;
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text(); // fallback to raw text
      console.error('Non-JSON response:', text);
      return;
    }

    if (response.ok) {
      console.log('✅ Match added:', data.message);
      // handle success (e.g., show success message or update UI)
    } else {
      console.warn('⚠️ Error adding match:', data);
      // handle error (e.g., show error message)
    }
  } catch (error) {
    console.error('❌ Network error:', error);
  }
};


 export const fetchMatchedUsers = async (userId) => {
  try {
    const response = await fetch(`${apiMatchesUrl}matched-users/${userId}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Matched users:', data);
    
    // You can now use the data (e.g., update state)
    return data;

  } catch (error) {
    console.error('Error fetching matched users:', error);
    return null;
  }
};
//user pref: {"heightPreferences": "", "interests": "Introvert,Adventurous,Romantic,Traveler,Fitness Lover,Gaming,Cooking,Traveling", "isSmoker": false, "maxAgePreference": 35, "minAgePreference": 24, "preferredDistanceKm": 103, "preferredPartner": "Other", "relationshipType": "love", "religion": "", "userId": 9}