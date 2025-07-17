import Picture from './upload.model.js'

export async function getAllUsersPic(req, res){

    let pic = await Picture.allUsersPic();

    if(!pic)
        return res.status(404).json({message: 'No pics found'})
    
    return res.status(200).json({message: 'Found', pic} )

}

export async function getUserPic(req, res){
    let {email} = req.params
    let pic = await Picture.findUserPic(email);

    if(!pic)
        return res.status(404).json({message: 'pic not found'})
    
    return res.status(200).json({message: 'Found', pic} )
 }


export async function uploadUserPic(req, res){
    let {email} = req.params
    let pic = new Picture(email, req.file.filename)
    await pic.addPicture()
    return res.status(204).json({message: 'Successfully added'}, pic)
}



export async function updateUserPic(req, res){

}

export async function deleteUserPic(req, res){ 

}