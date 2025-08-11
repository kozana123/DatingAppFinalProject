import {readFile, writeFile} from 'fs/promises'
import path from 'path';
import { __dirname } from '../../globals.js';
// import DB from '../../db.js';
// import sql from 'mssql';

import * as sql from 'mssql';

const dbConfig = {
  server: 'T67396',
  database: 'DatingApp',
  options: {
    trustedConnection: true,
    trustServerCertificate: true,
  },
};

export async function addUserPreferencesToDB(userPref) {
   try {
      const pool = await sql.connect(dbConfig);
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
         OUTPUT INSERTED.preference_id
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
         return { message: "Preference created", id: result.recordset[0].preference_id };
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

