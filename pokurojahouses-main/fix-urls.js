import('dotenv/config');
import { MongoClient } from 'mongodb';

const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
  console.log('MongoDB not configured');
  process.exit(0);
}

console.log('Connecting to MongoDB...');
const client = new MongoClient(mongoUri);
await client.connect();
const db = client.db(process.env.MONGO_DB_NAME || 'pokuroja');

console.log('Fetching properties...');
const properties = await db.collection('properties').find({}).toArray();
console.log(`Found ${properties.length} properties`);

let updated = 0;

for (const prop of properties) {
  let needsUpdate = false;
  const updateObj = {};

  if (prop.image_url && typeof prop.image_url === 'string' && prop.image_url.includes('localhost:3000')) {
    updateObj.image_url = prop.image_url.replace('localhost:3000', 'localhost:5000');
    needsUpdate = true;
    console.log(`Updating image_url for property ${prop.id}`);
  }

  if (prop.image_urls && Array.isArray(prop.image_urls)) {
    updateObj.image_urls = prop.image_urls.map(url =>
      (typeof url === 'string' && url.includes('localhost:3000')) ? url.replace('localhost:3000', 'localhost:5000') : url
    );
    if (JSON.stringify(updateObj.image_urls) !== JSON.stringify(prop.image_urls)) {
      needsUpdate = true;
      console.log(`Updating image_urls for property ${prop.id}`);
    }
  }

  if (needsUpdate) {
    await db.collection('properties').updateOne({ _id: prop._id }, { $set: updateObj });
    updated++;
  }
}

console.log(`Updated ${updated} MongoDB records`);
await client.close();
console.log('Done!');