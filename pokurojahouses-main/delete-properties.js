import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;
const DB_NAME = 'pokuroja';
const COLLECTION_NAME = 'properties';

// Properties to delete - multiple variations to catch all formats
const propertiesToDelete = [
  '1772721004827',
  '1770875341044',
  '1772208037807'
];

async function deleteFromMongoDB() {
  const client = new MongoClient(MONGO_URI);
  
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);
    
    let totalDeleted = 0;
    
    for (const propId of propertiesToDelete) {
      console.log(`\n🗑️  Attempting to delete: ${propId}`);
      
      // Build a query that matches multiple possible field types
      const query = {
        $or: [
          { id: propId },                    // string match
          { id: parseInt(propId) },         // numeric match
          { id: { $eq: propId } },          // explicit string equality
        ]
      };
      
      const result = await collection.deleteMany(query);
      totalDeleted += result.deletedCount;
      
      if (result.deletedCount > 0) {
        console.log(`   ✅ Deleted ${result.deletedCount} document(s)`);
      } else {
        console.log(`   ℹ️  No documents found for id: ${propId}`);
      }
    }
    
    console.log(`\n✅ Total deleted from MongoDB: ${totalDeleted}`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.close();
  }
}

deleteFromMongoDB();
