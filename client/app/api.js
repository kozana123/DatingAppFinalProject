

const apiPreferencesUrl = "http://www.DatingServer.somee.com/api/userpreferences/"

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
      const text = await res.text();
      console.warn("Update failed:", text);
    }
  } catch (err) {
    console.error("Error updating preferences:", err);
  }
};


export const updateUserDetails = async (userPref, userId) => {
  try {
    console.log("updateUserDetails");
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
      const text = await res.text();
      console.warn("Update failed:", text);
    }
  } catch (err) {
    console.error("Error updating preferences:", err);
  }
};
//user pref: {"heightPreferences": "", "interests": "Introvert,Adventurous,Romantic,Traveler,Fitness Lover,Gaming,Cooking,Traveling", "isSmoker": false, "maxAgePreference": 35, "minAgePreference": 24, "preferredDistanceKm": 103, "preferredPartner": "Other", "relationshipType": "love", "religion": "", "userId": 9}