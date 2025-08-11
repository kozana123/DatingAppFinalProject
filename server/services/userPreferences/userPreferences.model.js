import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import {findAllUsers, findSpecificUser, addUserPreferencesToDB, } from './userPreferences.db.js'


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
  
    static async getUserPreferencesByUserId(email) {
      return await findSpecificUser(email);
    }

    static async updateSearchPreferences(email, password) {
      let user = await User.findUser(email);

      if (user && bcrypt.compareSync(password, user.password)){
        delete user.password
        let token = jwt.sign(user, 'user', {algorithm: 'HS256'})
        return token
      }      
      else
        return null
    } 
  
    async updateUserPreferences() {
      let user = await addUserToDB(this);
      let token = jwt.sign(user, 'user', {algorithm: 'HS256'})
      return token
    } 
}


