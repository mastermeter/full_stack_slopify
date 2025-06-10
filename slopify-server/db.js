import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();




const client = new MongoClient(process.env.MONGODB_URL);
let db;

export async function connectToDatabase() {
  await client.connect();
  db = client.db('slopify'); // Utilise le nom de la base défini dans l'URI (ex: slopifyDB)
  console.log('✅ Connecté à MongoDB Atlas');
}

export function getDb() {
  if (!db) {
    throw new Error('La base de données n\'est pas connectée. Veuillez d\'abord appeler connectToDatabase().');
  }
  return db;
}

export async function getUserByEmail(email) {
  const db = getDb();
  return await db.collection("users").findOne({ email });
}

export async function CreateUser(user) {
  const db = getDb();
  await db.collection("users").insertOne(user);
}
