import { router } from "expo-router";
import axios from 'axios';
import {createChat} from "./fireBase";


// const SIGNALING_SERVER_URL = 'http://10.0.0.3:3501';
const SIGNALING_SERVER_URL = 'https://datingappfinalproject-signaling-server.onrender.com';

const apiPreferencesUrl = `${SIGNALING_SERVER_URL}/api/v1/userPreferences`
const apiUsersUrl = `${SIGNALING_SERVER_URL}/api/v1/userDetails`
const apiMatchesUrl = `${SIGNALING_SERVER_URL}/api/v1/matches`
const apiChatSessionsUrl = `${SIGNALING_SERVER_URL}/api/v1/videoChats`
const apireportsUrl = `${SIGNALING_SERVER_URL}/api/v1/reports`


export const checkEmailExists = async (email) => {
  try {
    console.log(email);

    const res = await fetch(`${apiUsersUrl}/check-email?email=${encodeURIComponent(email)}`);
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
    return false
  }
  
};

export const registerUser = async (newUser) => {
  const formData = new FormData();
  
  // Append all text fields
  formData.append('userName', newUser.name);
  formData.append('userEmail', newUser.email);
  formData.append('userPassword', newUser.password);
  formData.append('birthDate', newUser.birthDate); // format: 'YYYY-MM-DD'
  formData.append('gender', newUser.gender);
  formData.append('city', newUser.city);
  formData.append('latitude', newUser.latitude.toString());
  formData.append('longitude', newUser.longitude.toString());

  // Append the image
  const uriParts = newUser.image.split('.');
  const fileType = uriParts[uriParts.length - 1];

  formData.append('profileImageFile', {
    uri: newUser.image,
    name: `profile.${fileType}`,
    type: `image/${fileType}`
  });

  try {
    const response = await axios.post(`${apiUsersUrl}/register`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log('Registration successful:', response.data);
    // const userId = {userId: response.data.token}
    
    router.push({
      pathname: "/registerPages/registerIntrest",
      params: { userId: response.data.token }
    });

  } catch (error) {
    console.error('Registration failed:', error.response?.data || error.message);
  }
  finally{
    return false
  }
};

export const RegisterPreferences = async (prefs, userPreference) => {
    console.log(userPreference);

    const preferences = {
      userId: userPreference.userId, // Replace with actual user ID
      preferredPartner: userPreference.genderPreference,
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
      const response = await fetch(`${apiPreferencesUrl}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(preferences),
      });

      if (response.status === 201) {
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
    
    const res = await fetch(`${apiPreferencesUrl}/updateSearching/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        preferredPartner: userPref.preferredPartner,
        preferredDistanceKm: userPref.preferredDistanceKm,
        minAgePreference: userPref.minAgePreference,
        maxAgePreference: userPref.maxAgePreference,
        relationshipType: userPref.relationshipType,
        heightPreferences: userPref.heightPreferences,
        religion: userPref.religion,
        isSmoker: userPref.isSmoker,
        interests: userPref.interests
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
    
    const res = await fetch(`${apiPreferencesUrl}/updateUser/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        preferredPartner: userPref.preferredPartner,
        preferredDistanceKm: userPref.preferredDistanceKm,
        MinAgePreference: userPref.minAgePreference,
        MaxAgePreference: userPref.maxAgePreference,
        relationshipType: userPref.relationshipType,
        heightPreferences: userPref.heightPreferences,
        religion: userPref.religion,
        isSmoker: userPref.isSmoker,
        interests: userPref.interests
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
    formData.append('profileImageFile', {
      uri: imageUri,
      type: `image/${fileType}`,
      name: fileName,
    });

    const res = await fetch(`${apiUsersUrl}/profile-image/${userId}`, {
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
    const response = await fetch(`${apiUsersUrl}/location/${userId}`, {
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
    const chatId = await createChat()
    const response = await fetch(`${apiMatchesUrl}/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user1ID,
        user2ID,
        matchStatus,
        chatId
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
    const response = await fetch(`${apiMatchesUrl}/matched-users/${userId}`);
    
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

 export const unMatchUser = async (userId, unmatched) => {
  try {
    console.log("try to unmatch" + userId + unmatched);
    
    const response = await fetch(`${apiMatchesUrl}/unmatch/${userId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ unmatchUserId: unmatched }) // 0 or 1
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log('unMatched user:', data);
    
    // You can now use the data (e.g., update state)
    return data;

  } catch (error) {
    console.error('Error fetching matched users:', error);
    return null;
  }
};

export const deleteUserById = async (userId) => {
  try {
    console.log("userId", userId);
    const response = await fetch(`${apiUsersUrl}/delete/${userId}`, {
      method: 'DELETE',
    });

   
    const text = await response.text();
    console.log('Server response:', text);

    if (response.ok) {
      const data = JSON.parse(text);
      console.log('User deleted:', data.message);
    } else {
      console.warn('Deletion failed:', text);
    }
  } catch (error) {
    console.error('Network error:', error);
  }
};

export async function addChatSession(callDate, callDurationMinutes, isMatch) {
  try {
    const response = await axios.post(`${apiChatSessionsUrl}/addSession`, {
      CallDate: callDate,                // string: "2025-09-01T12:34:56"
      CallDurationMinutes: callDurationMinutes, // number
      IsMatch: isMatch                   // boolean (true/false)
    });

    console.log("✅ Chat session saved:", response.data);
    return response.data;

  } catch (error) {
    console.error("❌ Failed to save chat session:", error.response?.data || error.message);
    throw error;
  }
}

export async function addReport(reporterID, reportedUserID, reason, reportDate) {
  try {
    const response = await axios.post(`${apireportsUrl}/report`, {
      ReporterID: reporterID,
      ReportedUserID: reportedUserID,
      Reason: reason,
      ReportDate: reportDate
    });

    console.log("✅ Report saved:", response.data);
    return response.data;

  } catch (error) {
    console.error("❌ Failed to save report:", error.response?.data || error.message);
    throw error;
  }
}


export const changeUserPassword = async (userId, password) => {
  try {
    const response = await fetch(`${apiUsersUrl}/change-password/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({password}),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(text || 'Failed to change password');
    }

    const data = await response.json();
    console.log('✅ Password changed successfully:', data);
    return data;

  } catch (error) {
    console.error('❌ Error changing password:', error);
    throw error;
  }
};
