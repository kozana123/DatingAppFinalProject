import {readFile, writeFile} from 'fs/promises'
import path from 'path';
import { __dirname } from '../../globals.js';
import sql from 'mssql/msnodesqlv8.js';

const dbConfig = {
  server: 'T67396',          // your machine name or IP
  database: 'DatingApp',
  driver: 'msnodesqlv8',
  options: {
    trustedConnection: true, // enables Windows Auth
    trustServerCertificate: true, // optional, depends on your setup
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

export async function addUserPreferencesToDB(userPref) {
   try {
      const pool = await sql.connect(dbConfig);

      const result = await pool.request()
         .input('PreferredPartner', sql.NVarChar, userPref.PreferredPartner)
         .input('RelationshipType', sql.NVarChar, userPref.RelationshipType)
         .input('HeightPreferences', sql.NVarChar, userPref.HeightPreferences)
         .input('Religion', sql.NVarChar, userPref.Religion)
         .input('IsSmoker', sql.Bit, userPref.IsSmoker)
         .input('PreferredDistanceKm', sql.Int, userPref.PreferredDistanceKm)
         .input('MinAgePreference', sql.Int, userPref.MinAgePreference)
         .input('MaxAgePreference', sql.Int, userPref.MaxAgePreference)
         .input('Interests', sql.NVarChar, userPref.Interests || null)
         .input('UserId', sql.Int, userPref.UserId)
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
         ) VALUES (
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
         return "Create new Preference"; // No Content
      } else {
         return 'Failed to update preferences';
      }
   } catch (err) {
      console.error('SQL Connection Error:', JSON.stringify(err, Object.getOwnPropertyNames(err), 2));
      return err.message || 'Server error';
   }
   // let users = await readFile(path.join(__dirname, 'DB', 'users.json'))
   // users = JSON.parse(users.toString())

   // users.push(user)
   // await writeFile(path.join(__dirname, 'DB', 'users.json'), JSON.stringify(users))

   
}  

