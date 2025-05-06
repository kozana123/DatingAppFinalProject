import jwt from 'jsonwebtoken';

export async function auth(req, res, next) {
    let token = req.headers.authorization.split(' ')[1] 
    let user = jwt.verify(token, 'user')
    console.log(user);
    
    if((user.email != "Dor@example.com"))
        return res.status(403).json({message: "auth failed!"})
    next()
}