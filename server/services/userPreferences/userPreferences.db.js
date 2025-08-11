import {readFile, writeFile} from 'fs/promises'
import path from 'path';
import { __dirname } from '../../globals.js';
import sql from 'mssql/msnodesqlv8.js';


const config = {
  database: 'DatingApp',
  server: 'T67396\\SQLEXPRESS', // <-- replace with your actual server + instance
  driver: 'msnodesqlv8',
  options: {
    trustedConnection: true
  }
};

try {
  const pool = await sql.connect(config);
  console.log('✅ Connected to SQL Server!');

  const result = await pool.request().query('SELECT 1 AS number');
  console.log(result.recordset);

  await pool.close();
} catch (err) {
  console.error('❌ SQL Connection Error:', err.originalError || err);
}

const dbConfig = {
  server: 'T67396',          // your machine name or IP
  database: 'DatingApp',
  driver: 'msnodesqlv8',
  options: {
    trustedConnection: true, // enables Windows Auth
    trustServerCertificate: true, // optional, depends on your setup
  },
};

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
      console.error('SQL Connection Error:', JSON.stringify(err, Object.getOwnPropertyNames(err), 2));
      return { message: err.message || 'Server error' };
   } finally {
      sql.close();
   }
   // let users = await readFile(path.join(__dirname, 'DB', 'users.json'))
   // users = JSON.parse(users.toString())

   // users.push(user)
   // await writeFile(path.join(__dirname, 'DB', 'users.json'), JSON.stringify(users))

   
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

