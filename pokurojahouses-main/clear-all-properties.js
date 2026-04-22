import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;
const DB_NAME = 'pokuroja';
const COLLECTION_NAME = 'properties';

async function clearAllProperties() {
  const client = new MongoClient(MONGO_URI);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');

    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    const result = await collection.deleteMany({});
    console.log(`🗑️  Deleted ${result.deletedCount} properties from MongoDB`);

    console.log('✅ All properties cleared from MongoDB');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.close();
  }
}

clearAllProperties();