import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import {findSpecificUser, addUserPreferencesToDB, updateSearch,updateUser } from './userPreferences.db.js'


export default class UserPreferences {
    constructor(userId, preferredPartner, relationshipType, heightPreferences, religion, isSmoker, preferredDistanceKm, minAgePreference, maxAgePreference, interests) {
      this.userId = userId
      this.preferredPartner = preferredPartner
      this.relationshipType = relationshipType
      this.heightPreferences = heightPreferences
      this.religion = religion
      this.isSmoker = isSmoker
      this.preferredDistanceKm = preferredDistanceKm
      this.minAgePreference = minAgePreference
      this.maxAgePreference = maxAgePreference
      this.interests = interests
    }

    async createUserPreferences() {
      console.log("run MODEL");
      let user = await addUserPreferencesToDB(this);
      // let token = jwt.sign(user, 'user', {algorithm: 'HS256'})
      return user
    }
  
    static async getUserPreferencesByUserId(id) {
      return await findSpecificUser(id);
    }

    static async updateSearchPreferences(userId, prefs) {

      return await updateSearch(userId, prefs);
    } 
  
    static async updateUserPreferences(userId, prefs) {
      let user = await updateUser(userId, prefs);
      return user
    } 
}


