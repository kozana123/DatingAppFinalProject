import {readFile, writeFile} from 'fs/promises'
import path from 'path';
import { __dirname } from '../../globals.js';


export async function findAllUsersPic() {
   let pictures = await readFile(path.join(__dirname, 'DB', 'usersPictures.json'))
   return JSON.parse(pictures.toString())
}

export async function findSpecificUserPic(email) {
   let pictures = await readFile(path.join(__dirname, 'DB', 'usersPictures.json'))
   pictures = JSON.parse(pictures.toString())
   let pic = pictures.find(u => u.email == email)

   return pic
}

export async function addUserPicToDB(pic) {
let picures = await readFile(path.join(__dirname, 'DB', 'usersPictures.json'))
picures = JSON.parse(picures.toString())
picures.push(pic)
await writeFile(path.join(__dirname, 'DB', 'usersPictures.json'), JSON.stringify(picures))

return pic
}  