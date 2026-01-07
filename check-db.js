const { MongoClient } = require('mongodb');

const MONGO_URI = 'mongodb://localhost:27017/Pizza';

async function checkDatabase() {
    try {
        const client = await MongoClient.connect(MONGO_URI);
        console.log('Connected to MongoDB');
        
        const db = client.db('Pizza');
        const locations = await db.collection('loc').find({}).toArray();
        
        console.log('\n=== Locations in database ===');
        console.log(`Total records: ${locations.length}`);
        
        if (locations.length > 0) {
            console.log('\nRecords:');
            locations.forEach((loc, index) => {
                console.log(`\n${index + 1}.`);
                console.log(`   ID: ${loc._id}`);
                console.log(`   Latitude: ${loc.latitude}`);
                console.log(`   Longitude: ${loc.longitude}`);
                console.log(`   Timestamp: ${loc.timestamp}`);
                console.log(`   User Agent: ${loc.userAgent || 'N/A'}`);
            });
        } else {
            console.log('No locations found in database.');
        }
        
        await client.close();
    } catch (error) {
        console.error('Error:', error);
    }
}

checkDatabase();
