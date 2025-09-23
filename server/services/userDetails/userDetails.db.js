import { __dirname } from '../../globals.js';
import { connectDB, sql } from '../../db.js';


export async function addUserToDB(user) {
   
   try {
    const pool = await connectDB();
    console.log("run DB");
    const result = await pool.query`
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
  }
}

// בדיקת אם אימייל קיים
export async function emailExistsInDB(email) {
  try {
    const pool = await connectDB();
    const result = await pool.query`
      SELECT COUNT(*) AS count
      FROM user_details
      WHERE userEmail = ${email}
    `;
    return result.recordset[0].count > 0;
  } catch (error) {
    console.error("SQL Email Exists Error:", error);
    throw new Error("Failed to check if email exists");
  } 
}


export async function getUserByEmailAndPasswordFromDB(email) {
    console.log("in DB");
  try {
    const pool = await connectDB()
    const result = await pool.query`
      SELECT *
      FROM user_details
      WHERE userEmail = ${email}
    `;
    return result.recordset.length > 0 ? result.recordset[0] : null;
  } catch (error) {
    console.error("SQL Get User By Email Error:", error);
    throw new Error("Failed to get user by email");
  }
}

// קבלת משתמש לפי ID
export async function getUserByIdFromDB(userId) {
  try {
    const pool = await connectDB();
    const result = await pool.query`
      SELECT *
      FROM user_details
      WHERE user_id = ${userId}
    `;

    await sql.connect(result);

    return result.recordset.length > 0 ? result.recordset[0] : null;
  } catch (error) {
    console.error("SQL Get User By ID Error:", error);
    throw new Error("Failed to get user by ID");
  }
}


export async function updateProfileImageInDB(userId, imageUrl) {
  try {
    const pool = await connectDB();
    const result = await pool.query`
      UPDATE user_details
      SET profile_image = ${imageUrl}
      WHERE user_id = ${userId}
    `;
    return result.rowsAffected[0] > 0;
  } catch (error) {
    console.error("SQL Update Profile Image Error:", error);
    throw new Error("Failed to update profile image");
  }
}


export async function updateUserLocationInDB(userId, city, latitude, longitude) {
  try {
    const pool = await connectDB();
    const result = await pool.query`
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
  }
}


export async function deleteUserByIdFromDB(userId) {
  try {
    const pool = await connectDB();
    const result = await pool.query`
      DELETE FROM user_preferences WHERE user_id = ${userId}
      DELETE FROM user_details WHERE user_id = ${userId}
    `;
    return result.rowsAffected[0] > 0;
  } catch (error) {
    console.error("SQL Delete User Error:", error);
    throw new Error("Failed to delete user");
  }
}

export async function updateUserPasswordInDB(userId, password) {
  try {
    const pool = await connectDB();
    const result = await pool.query`
      UPDATE user_details
      SET user_password = ${password}
      WHERE user_id = ${userId}
    `;
    return result.rowsAffected[0] > 0;
  } catch (error) {
    console.error("SQL Update password Error:", error);
    throw new Error("Failed to update user password");
  }
}


