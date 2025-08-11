import User from './userDetails.model.js'
import { uploadImage } from '../cloudinaryService.js';

export async function createNewUser(req, res){ 

    try {
        const dto = req.body;
        const file = req.file;

        if (!dto || !file) {
        return res.status(400).json({ message: 'Missing user data or profile image file' });
        }

        // Upload image buffer to Cloudinary
        const cloudinaryUrl = await uploadImage(file.buffer, file.originalname);

        // Create User instance with Cloudinary URL
        const user = new User(
        null, // userId - generated later in DB
        dto.userName,
        dto.userEmail,
        dto.userPassword,
        new Date(dto.birthDate),
        dto.gender,
        cloudinaryUrl,
        dto.city,
        parseFloat(dto.latitude),
        parseFloat(dto.longitude)
        );
console.log("run Controller");
        // Save user & generate JWT token (assuming addUser returns token)
        const token = await user.addUser();

        return res.status(201).json({ message: 'User registered successfully', token });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: err.message || 'Server error' });
    }

}

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