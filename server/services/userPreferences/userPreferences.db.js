import {readFile, writeFile} from 'fs/promises'
import path from 'path';
import { __dirname } from '../../globals.js';
import sql from 'mssql' 

const dbConfig = {
  user: 'YOUR_DB_USER',
  password: 'YOUR_DB_PASSWORD',
  server: 'YOUR_DB_SERVER',
  database: 'YOUR_DB_NAME',
  options: {
    encrypt: true, // if using Azure SQL, else false
    trustServerCertificate: true, // depending on your setup
  },
};

export async function findAllUsers() {
   let users = await readFile(path.join(__dirname, 'DB', 'users.json'))
   return JSON.parse(users.toString())
}

export async function findSpecificUser(email) {
   let users = await readFile(path.join(__dirname, 'DB', 'users.json'))
   users = JSON.parse(users.toString())
   let user = users.find(u => u.email == email)

   return user
   
}

export async function addUserPreferencesToDB(user) {
   
   let users = await readFile(path.join(__dirname, 'DB', 'users.json'))
   users = JSON.parse(users.toString())

   users.push(user)
   await writeFile(path.join(__dirname, 'DB', 'users.json'), JSON.stringify(users))

   return user
}  

