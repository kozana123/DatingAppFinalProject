import User from './user.model.js'


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