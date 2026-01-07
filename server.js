const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

// MongoDB connection string
const MONGO_URI = 'mongodb://localhost:27017/Pizza';
let db;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Connect to MongoDB
MongoClient.connect(MONGO_URI)
    .then(client => {
        console.log('Connected to MongoDB');
        db = client.db('Pizza');
    })
    .catch(error => console.error('MongoDB connection error:', error));

// API endpoint to save location
app.post('/api/save-location', async (req, res) => {
    try {
        console.log('Received location data:', req.body);
        
        const { latitude, longitude, timestamp } = req.body;

        if (!latitude || !longitude) {
            console.log('Missing latitude or longitude');
            return res.status(400).json({ error: 'Latitude and longitude are required' });
        }

        const locationData = {
            latitude,
            longitude,
            timestamp: timestamp || new Date(),
            userAgent: req.headers['user-agent']
        };

        console.log('Saving to database:', locationData);
        const result = await db.collection('loc').insertOne(locationData);
        console.log('Saved successfully with ID:', result.insertedId);

        res.json({ 
            success: true, 
            message: 'Location saved successfully',
            id: result.insertedId 
        });

    } catch (error) {
        console.error('Error saving location:', error);
        res.status(500).json({ error: 'Failed to save location' });
    }
});

// Serve index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`MongoDB connected to: ${MONGO_URI}`);
});
