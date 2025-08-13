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
      SELECT SCOPE_IDENTITY() AS userId;`;

    // result.recordset[0].userId contains the newly inserted user ID
    const insertedUserId = result.recordset[0].userId;
    console.log(insertedUserId);
    
    return insertedUserId
    
  } catch (error) {
    console.error('SQL Insert Error:', error);
    throw new Error('Failed to insert user into database');
  } finally {
    await sql.close();
  }
}

// בדיקת אם אימייל קיים
export async function emailExistsInDB(email) {
  try {
    await sql.connect(sqlConfig);
    const result = await sql.query`
      SELECT COUNT(*) AS count
      FROM user_details
      WHERE userEmail = ${email}
    `;
    return result.recordset[0].count > 0;
  } catch (error) {
    console.error("SQL Email Exists Error:", error);
    throw new Error("Failed to check if email exists");
  } finally {
    await sql.close();
  }
}


export async function getUserByEmailAndPasswordFromDB(email) {
    console.log("in DB");
  try {
    await sql.connect(sqlConfig);
    const result = await sql.query`
      SELECT *
      FROM user_details
      WHERE userEmail = ${email}
    `;
    return result.recordset.length > 0 ? result.recordset[0] : null;
  } catch (error) {
    console.error("SQL Get User By Email Error:", error);
    throw new Error("Failed to get user by email");
  } finally {
    await sql.close();
  }
}

// קבלת משתמש לפי ID
export async function getUserByIdFromDB(userId) {
  try {
    await sql.connect(sqlConfig);
    const result = await sql.query`
      SELECT *
      FROM user_details
      WHERE user_id = ${userId}
    `;

    await sql.connect(result);

    return result.recordset.length > 0 ? result.recordset[0] : null;
  } catch (error) {
    console.error("SQL Get User By ID Error:", error);
    throw new Error("Failed to get user by ID");
  } finally {
    await sql.close();
  }
}


export async function updateProfileImageInDB(userId, imageUrl) {
  try {
    await sql.connect(sqlConfig);
    const result = await sql.query`
      UPDATE user_details
      SET profile_image = ${imageUrl}
      WHERE user_id = ${userId}
    `;
    return result.rowsAffected[0] > 0;
  } catch (error) {
    console.error("SQL Update Profile Image Error:", error);
    throw new Error("Failed to update profile image");
  } finally {
    await sql.close();
  }
}


export async function updateUserLocationInDB(userId, city, latitude, longitude) {
  try {
    await sql.connect(sqlConfig);
    const result = await sql.query`
      UPDATE user_details
      SET city = ${city},
          latitude = ${latitude},
          longitude = ${longitude}
      WHERE user_id = ${userId}
    `;
    return result.rowsAffected[0] > 0;
  } catch (error) {
    console.error("SQL Update Location Error:", error);
    throw new Error("Failed to update user location");
  } finally {
    await sql.close();
  }
}


export async function deleteUserByIdFromDB(userId) {
  try {
    await sql.connect(sqlConfig);
    const result = await sql.query`
      DELETE FROM user_preferences WHERE user_id = ${userId}
      DELETE FROM user_details WHERE user_id = ${userId}
    `;
    return result.rowsAffected[0] > 0;
  } catch (error) {
    console.error("SQL Delete User Error:", error);
    throw new Error("Failed to delete user");
  } finally {
    await sql.close();
  }
}



// export async function findAllUsers() {
//    let users = await readFile(path.join(__dirname, 'DB', 'users.json'))
//    return JSON.parse(users.toString())
// }

// export async function findSpecificUser(email) {
//    let users = await readFile(path.join(__dirname, 'DB', 'users.json'))
//    users = JSON.parse(users.toString())
//    let user = users.find(u => u.email == email)

//    return user
   
// }



