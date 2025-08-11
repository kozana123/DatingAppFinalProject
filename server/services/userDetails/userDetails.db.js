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
    encrypt: false, // if using Azure SQL, else false
    trustServerCertificate: true, // depending on your setup
  },
};

export async function addUserToDB(user) {
   
   try {
    await sql.connect(dbConfig);

    const result = await sql.query`
      INSERT INTO users (
        userName,
        userEmail,
        userPassword,
        birthDate,
        gender,
        profileImage,
        city,
        latitude,
        longitude
      ) VALUES (
        ${user.userName},
        ${user.userEmail},
        ${user.userPassword},
        ${user.birthDate},
        ${user.gender},
        ${user.profileImage},
        ${user.city},
        ${user.latitude},
        ${user.longitude}
      );
      SELECT SCOPE_IDENTITY();`;

    // result.recordset[0].userId contains the newly inserted user ID
    const insertedUserId = result.recordset[0].userId;

    return {
      userId: insertedUserId,
    };
  } catch (error) {
    console.error('SQL Insert Error:', error);
    throw new Error('Failed to insert user into database');
  } finally {
    await sql.close();
  }
}  





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



