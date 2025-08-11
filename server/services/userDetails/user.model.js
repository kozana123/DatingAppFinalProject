import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import {findAllUsers, findSpecificUser, addUserToDB, } from './user.db.js'


export default class User {
    constructor(name, date, email, password) {
      this.name = name;
      this.date = date;
      this.email = email;
      this.password = bcrypt.hashSync(password, 15);
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
      let user = await addUserToDB(this);
      let token = jwt.sign(user, 'user', {algorithm: 'HS256'})
      return token
    } 
}


