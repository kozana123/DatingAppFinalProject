

 import UserPreferences from './userPreferences.model.js'

export async function createNewUserPreferences(req, res){ 
    let {userId, preferredPartner, relationshipType, heightPreferences, religion, isSmoker, preferredDistanceKm, minAgePreference, maxAgePreference, interests} = req.body
    console.log("run CONTROLLER");
    let user = new UserPreferences(userId, preferredPartner, relationshipType, heightPreferences, religion, isSmoker, preferredDistanceKm, minAgePreference, maxAgePreference, interests)
    let token = await user.createUserPreferences()
    if (token) {
    return res.status(201).json(token);
    } else {
    return res.status(400).json(token);
    }
    
}

export async function getPreferences(req, res) {
    const userId = req.params.userId;
    console.log(userId);
    
    try {
      const prefs = await UserPreferences.getUserPreferencesByUserId(userId);
      if (!prefs) {
        return res.status(404).json({message: `Preferences for user ${userId} not found.`});
      }
      return res.status(201).json(prefs);
    } catch (error) {
      return res.status(500).json({message: error.message});
    }
  }

  export async function updateSearchingPreferences(req, res) {
    const userId = req.params.userId;
    const {preferredPartner, preferredDistanceKm, minAgePreference, maxAgePreference} = req.body;
  
    if (!userId) {
      return res.status(400).json({message: 'Missing userId'});
    }
  
    let prefs = new UserPreferences(userId, preferredPartner, null, null, null, null, preferredDistanceKm, minAgePreference, maxAgePreference, null);
    console.log("run CONTROLLER");
  
    try {
      let rowsAffected = await UserPreferences.updateSearchPreferences(userId, prefs);
      if (rowsAffected > 0) {
        return res.sendStatus(204);
      }
      return res.status(404).json({message: 'User not found or no changes made'});
    } catch (error) {
      return res.status(500).json({message: error.message});
    }
  }

  export async function updateUserPreferences(req, res) {
    const userId = req.params.userId;
    const {relationshipType, heightPreferences, religion, isSmoker, interests} = req.body;
  
    if (!userId) {
      return res.status(400).json({message: 'Missing userId'});
    }
  
    let prefs = new UserPreferences(userId, null, relationshipType, heightPreferences, religion, isSmoker, null, null, null, interests);
  
    try {
      let rowsAffected = await UserPreferences.updateUserPreferences(userId, prefs);
      if (rowsAffected > 0) {
        return res.sendStatus(204);
      }
      return res.status(404).json({message: 'User not found or no changes made'});
    } catch (error) {
      return res.status(500).json({message: error.message});
    }
  }

  export async function test(req, res){ 
    let {userId, preferredPartner, relationshipType, heightPreferences, religion, isSmoker, preferredDistanceKm, minAgePreference, maxAgePreference, interests} = req.body

    let user = new UserPreferences(userId, preferredPartner, relationshipType, heightPreferences, religion, isSmoker, preferredDistanceKm, minAgePreference, maxAgePreference, interests)

    return await res.status(200).json({message: user})
}


  
// // POST /userPreferences
// export async function updatePreferences(req, res) {
//   const prefs = req.body;
//   if (!prefs) {
//     return res.status(400).json({ message: 'Invalid preferences data' });
//   }

//   try {
//     const rowsAffected = await userPreferencesDb.updatePreferences(prefs);
//     if (rowsAffected > 0) {
//       return res.sendStatus(204); // No Content
//     }
//     return res.status(500).json({ message: 'Failed to update preferences' });
//   } catch (err) {
//     return res.status(500).json({ message: err.message });
//   }
// }

// // GET /:userId
// export async function getPreferences(req, res) {
//   const { userId } = req.params;
//   try {
//     const prefs = await userPreferencesDb.getUserPreferencesByUserId(userId);
//     if (!prefs) {
//       return res.status(404).json({ message: `Preferences for user ${userId} not found.` });
//     }
//     return res.json(prefs);
//   } catch (err) {
//     return res.status(500).json({ message: err.message });
//   }
// }

// // PUT /editUserPreferences/:userId
// export async function updateSearchingPreferences(req, res) {
//   const { userId } = req.params;
//   const prefs = req.body;

//   if (!prefs) {
//     return res.status(400).json({ message: 'Invalid preferences data' });
//   }

//   try {
//     const rowsAffected = await userPreferencesDb.updateSelectedPreferences(userId, prefs);
//     if (rowsAffected > 0) {
//       return res.sendStatus(204);
//     }
//     return res.status(404).json({ message: 'User not found or no changes made' });
//   } catch (err) {
//     return res.status(500).json({ message: err.message });
//   }
// }

// // PUT /editUserDetails/:userId
// export async function updateUserPreferences(req, res) {
//   const { userId } = req.params;
//   const prefs = req.body;

//   if (!prefs) {
//     return res.status(400).json({ message: 'Invalid preferences data' });
//   }

//   try {
//     const rowsAffected = await userPreferencesDb.updateUserPreferences(userId, prefs);
//     if (rowsAffected > 0) {
//       return res.sendStatus(204);
//     }
//     return res.status(404).json({ message: 'User not found or no changes made' });
//   } catch (err) {
//     return res.status(500).json({ message: err.message });
//   }
// }













export async function getAllUsers(req, res){

    let users = await User.allUsers();

    if(!users)
        return res.status(404).json({message: 'No users found'})
    
    return res.status(200).json({message: 'Found', users} )
 }

export async function getUsersById(req, res){
    let {email} = req.params
    let user = await User.findUser(email);

    if(!user)
        return res.status(404).json({message: 'User not found'})
    
    return res.status(200).json({message: 'Found', user} )
 }

export async function createNewUser(req, res){ 
    let {name, date, email, password} = req.body

    if(!name || !date || !email || !password){
        return res.status(404).json({message: 'Information missing'})
    }

    let user = new User(name, date, email, password)
    let token = await user.addUser()
    return res.status(404).json({message: 'Successfully added', token})


}

export async function loginUser(req, res){
    let {email, password} = req.body

    if(!email || !password)
        return res.status(400).json({message: "empty input"})

    let token = await User.login(email, password)
    
    if(!token)
        return res.status(408).json({message: "invalid inputs"})
    
    return res.status(208).json({message: "Loging success!", token})
}

export async function updateUser(req, res){
    let u = new User().update()
 }

export async function deleteUser(req, res){
    console.log("delete");
    
 }