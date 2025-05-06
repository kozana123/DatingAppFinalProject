import {addUserPicToDB, findAllUsersPic, findSpecificUserPic} from './upload.db.js'


export default class Picture {
    constructor(email, pictureName) {
      this.email = email;
      this.pictureName = pictureName
    }

    static async allUsersPic() {
        return await findAllUsersPic();
    }
    
    static async findUserPic(email) {
        return await findSpecificUserPic(email);
    }

    async addPicture() {
        return await addUserPicToDB(this);
    }
}