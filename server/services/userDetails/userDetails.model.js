import {
  addUserToDB,
  getUserByEmailAndPasswordFromDB,
  emailExistsInDB,
  getUserByIdFromDB,
  updateProfileImageInDB,
  updateUserLocationInDB,
  deleteUserByIdFromDB,
  updateUserPasswordInDB
} from "./userDetails.db.js";


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

  
    // async addUser() {
    //   console.log("run module");
    //   let user = await addUserToDB(this);
      
    //   // let token = jwt.sign(user, 'user', {algorithm: 'HS256'})
    //   return user
    // } 

    async addUser() {
      return await addUserToDB(this);
    }


    static async emailExists(email) {
      return await emailExistsInDB(email);
    }


    static async getUserByEmailAndPassword(email, password) {
      
      const user = await getUserByEmailAndPasswordFromDB(email);
      if (!user) return null;
      
      if(password == user.user_password){
        return user;
      } else{
        return false;
      }
    }  

    static async getUserById(userId) {
      return await getUserByIdFromDB(userId);
    }
  
 
    static async updateProfileImage(userId, imageUrl) {
      console.log("in module");

      return await updateProfileImageInDB(userId, imageUrl);
    }
  

    static async updateUserLocation(userId, city, latitude, longitude) {
      return await updateUserLocationInDB(userId, city, latitude, longitude);
    }
  

    static async deleteUserById(userId) {
      return await deleteUserByIdFromDB(userId);
    }

     static async updateUserPassword(userId, password) {
      return await updateUserPasswordInDB(userId, password);
    }
  
  
  
    
}



    // static async allUsers() {
    //   return await findAllUsers();
    // }
  
    // static async findUser(email) {
    //   return await findSpecificUser(email);
    // }

    // static async login(email, password) {
    //   let user = await User.findUser(email);

    //   if (user && bcrypt.compareSync(password, user.password)){
    //     delete user.password
    //     let token = jwt.sign(user, 'user', {algorithm: 'HS256'})
    //     return token
    //   }      
    //   else
    //     return null
    // } 