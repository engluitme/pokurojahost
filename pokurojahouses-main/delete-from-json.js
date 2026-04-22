import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_FILE = path.join(__dirname, 'data', 'properties.json');

// Properties to delete
const propertiesToDelete = [
  '1772721004827',
  '1770875341044',
  '1772208037807'
];

async function deletePropertiesFromJSON() {
  try {
    // Read the JSON file
    const rawData = fs.readFileSync(DATA_FILE, 'utf8');
    let properties = JSON.parse(rawData);
    
    console.log(`📊 Total properties before deletion: ${properties.length}`);
    
    // Filter out the properties
    const originalCount = properties.length;
    properties = properties.filter(p => !propertiesToDelete.includes(String(p.id)));
    const deletedCount = originalCount - properties.length;
    
    // Write back to file
    fs.writeFileSync(DATA_FILE, JSON.stringify(properties, null, 2), 'utf8');
    
    console.log(`🗑️  Deleted ${deletedCount} properties`);
    console.log(`📊 Total properties after deletion: ${properties.length}`);
    console.log('✅ Successfully removed from JSON file');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

deletePropertiesFromJSON();
