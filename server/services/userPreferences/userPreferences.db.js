import {readFile, writeFile} from 'fs/promises'
import path from 'path';
import { __dirname } from '../../globals.js';
import UserPreferences from './userPreferences.model.js'
// import DB from '../../db.js';
import sql from 'mssql';

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

export async function addUserPreferencesToDB(userPref) {
   try {
      const pool = await sql.connect(sqlConfig);
      console.log("run DB");
      
      const result = await pool.request()
         .input('PreferredPartner', sql.NVarChar, userPref.preferredPartner)
         .input('RelationshipType', sql.NVarChar, userPref.relationshipType)
         .input('HeightPreferences', sql.NVarChar, userPref.heightPreferences)
         .input('Religion', sql.NVarChar, userPref.religion)
         .input('IsSmoker', sql.Bit, userPref.isSmoker)
         .input('PreferredDistanceKm', sql.Int, userPref.preferredDistanceKm)
         .input('MinAgePreference', sql.Int, userPref.minAgePreference)
         .input('MaxAgePreference', sql.Int, userPref.maxAgePreference)
         .input('Interests', sql.NVarChar, userPref.interests || null)
         .input('UserId', sql.Int, userPref.userId)
         .query(`
         INSERT INTO user_preferences (
            preferred_partner,
            relationship_type,
            height_preferences,
            religion,
            is_smoker,
            preferred_distance_km,
            min_age_preference,
            max_age_preference,
            interests,
            user_id
         ) 
         VALUES (
            @PreferredPartner,
            @RelationshipType,
            @HeightPreferences,
            @Religion,
            @IsSmoker,
            @PreferredDistanceKm,
            @MinAgePreference,
            @MaxAgePreference,
            @Interests,
            @UserId
         )
         `);

      if (result.rowsAffected[0] > 0) {
         return { message: "Preference created"};
      } else {
         return { message: 'Failed to update preferences' };
      }
   } catch (err) {
      console.error('SQL ERROR:', err);
      throw err; // let it bubble up so controller returns error

   } finally {
      sql.close();
   }
} 

export async function findSpecificUser(userId) {
  try {
    const pool = await sql.connect(sqlConfig);
    const result = await pool
      .request()
      .input('user_id', sql.Int, userId)
      .query('SELECT * FROM user_preferences WHERE user_id = @user_id');

    if (result.recordset.length > 0) {
      const row = result.recordset[0];
      return new UserPreferences(
        row.user_id,
        row.preferred_partner,
        row.relationship_type,
        row.height_preferences,
        row.religion,
        row.is_smoker,
        row.preferred_distance_km,
        row.min_age_preference,
        row.max_age_preference,
        row.interests ?? null
      );
    }

    return null;
  } catch (err) {
    console.error('Error fetching user preferences:', err);
    throw err;
  }
  finally {
      sql.close();
  }
}

export async function updateSearch(userId, prefs) {
  try {
    const pool = await sql.connect(sqlConfig);
    const result = await pool.request()
      .input('PreferredPartner', sql.NVarChar, prefs.preferredPartner ?? null)
      .input('PreferredDistanceKm', sql.Int, prefs.preferredDistanceKm)
      .input('MinAgePreference', sql.Int, prefs.minAgePreference)
      .input('MaxAgePreference', sql.Int, prefs.maxAgePreference)
      .input('UserId', sql.Int, userId)
      .query(`
        UPDATE user_preferences
        SET
          preferred_partner = @PreferredPartner,
          preferred_distance_km = @PreferredDistanceKm,
          min_age_preference = @MinAgePreference,
          max_age_preference = @MaxAgePreference
        WHERE user_id = @UserId
      `);

    return result.rowsAffected[0]; // Same as C# ExecuteNonQuery()
  } catch (err) {
    throw new Error('Database update failed: ' + err.message);
  }
}

export async function updateUser(userId, prefs) {
  try {
   
    const pool = await sql.connect(sqlConfig);
    const result = await pool.request()
      .input("RelationshipType", sql.VarChar, prefs.relationshipType)
      .input("HeightPreferences", sql.VarChar, prefs.heightPreferences)
      .input("Religion", sql.VarChar, prefs.religion)
      .input("IsSmoker", sql.Bit, prefs.isSmoker)
      .input("Interests", sql.VarChar, prefs.interests)
      .input("UserId", sql.Int, userId)
      .query(`
        UPDATE user_preferences
        SET
          relationship_type = @RelationshipType,
          height_preferences = @HeightPreferences,
          religion = @Religion,
          is_smoker = @IsSmoker,
          interests = @Interests
        WHERE user_id = @UserId;
      `);

    return result.rowsAffected[0]; // number of updated rows
  } catch (err) {
    throw new Error("Database update failed: " + err.message);
  }
}



export async function findAllUsers() {
   let users = await readFile(path.join(__dirname, 'DB', 'users.json'))
   return JSON.parse(users.toString())
}

// export async function findSpecificUser(email) {
//    let users = await readFile(path.join(__dirname, 'DB', 'users.json'))
//    users = JSON.parse(users.toString())
//    let user = users.find(u => u.email == email)

//    return user
   
// }

