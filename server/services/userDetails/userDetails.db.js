import {readFile, writeFile} from 'fs/promises'
import path from 'path';
import { __dirname } from '../../globals.js';
import sql from 'mssql' 

const sqlConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    server: process.env.DB_SERVER,
    pool: {
      max: 10,
      min: 0,
      idleTimeoutMillis: 30000
    },
    options: {
      encrypt: false, // true for azure
      trustServerCertificate: true //false for local
    }
  }
export async function addUserToDB(user) {
   
   try {
    await sql.connect(sqlConfig);
console.log("run DB");
    const result = await sql.query`
      INSERT INTO user_details (
        userName,
        userEmail,
        user_password,
        birth_date,
        gender,
        profile_image,
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



