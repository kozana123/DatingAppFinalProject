import {readFile, writeFile} from 'fs/promises'
import path from 'path';
import { __dirname } from '../../globals.js';
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

