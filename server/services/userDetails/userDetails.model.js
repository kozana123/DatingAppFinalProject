import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import {findAllUsers, findSpecificUser, addUserToDB, } from './userDetails.db.js'


export default class User {
  constructor(userId, userName, userEmail, userPassword, birthDate, gender, profileImage, city, latitude, longitude) {
    this.userId = userId;
    this.userName = userName;
    this.userEmail = userEmail;
    this.userPassword = userPassword;
    this.birthDate = birthDate;       // Should be a JS Date object
    this.gender = gender;
    this.profileImage = profileImage;
    this.city = city;
    this.latitude = latitude;         // float/number
    this.longitude = longitude;       // float/number
  }

    static async allUsers() {
      return await findAllUsers();
    }
  
    static async findUser(email) {
      return await findSpecificUser(email);
    }

    static async login(email, password) {
      let user = await User.findUser(email);

      if (user && bcrypt.compareSync(password, user.password)){
        delete user.password
        let token = jwt.sign(user, 'user', {algorithm: 'HS256'})
        return token
      }      
      else
        return null
    } 
  
    async addUser() {
      console.log("run module");
      let user = await addUserToDB(this);
      
      // let token = jwt.sign(user, 'user', {algorithm: 'HS256'})
      return user
    } 
}


