// Mac Wayne Backend Server
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// In-memory storage (replace with database in production)
let users = {};
let purchases = {};

// User management
app.post('/api/user', (req, res) => {
    const { userId } = req.body;
    if (!users[userId]) {
        users[userId] = {
            id: userId,
            created: new Date(),
            purchases: []
        };
    }
    res.json({ success: true, user: users[userId] });
});

// Get user purchases
app.get('/user-purchases/:userId', (req, res) => {
    const { userId } = req.params;
    const userPurchases = purchases[userId] || [];
    res.json({ purchases: userPurchases });
});

// Process purchase
app.post('/api/purchase', (req, res) => {
    const { userId, item, price, type } = req.body;
    
    const purchase = {
        id: Date.now().toString(),
        userId,
        item,
        price,
        type,
        date: new Date(),
        status: 'completed'
    };
    
    if (!purchases[userId]) {
        purchases[userId] = [];
    }
    purchases[userId].push(purchase);
    
    res.json({ 
        success: true, 
        purchase,
        message: 'Purchase completed successfully'
    });
});

// Get audio file with range support
app.get('/public/audio/*', (req, res) => {
    const filePath = path.join(__dirname, req.path);
    
    if (!fs.existsSync(filePath)) {
        return res.status(404).send('Audio file not found');
    }
    
    const stat = fs.statSync(filePath);
    const fileSize = stat.size;
    const range = req.headers.range;
    
    if (range) {
        const parts = range.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
        const chunksize = (end - start) + 1;
        const file = fs.createReadStream(filePath, { start, end });
        const head = {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunksize,
            'Content-Type': 'audio/mpeg',
        };
        res.writeHead(206, head);
        file.pipe(res);
    } else {
        const head = {
            'Content-Length': fileSize,
            'Content-Type': 'audio/mpeg',
        };
        res.writeHead(200, head);
        fs.createReadStream(filePath).pipe(res);
    }
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        timestamp: new Date(),
        users: Object.keys(users).length,
        purchases: Object.keys(purchases).length
    });
});

// Serve main pages
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/music', (req, res) => {
    res.sendFile(path.join(__dirname, 'music.html'));
});

app.get('/test-audio', (req, res) => {
    res.sendFile(path.join(__dirname, 'test-audio.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`🎵 Mac Wayne Server running on http://localhost:${PORT}`);
    console.log(`📁 Serving files from: ${__dirname}`);
    console.log(`🎧 Audio endpoint: http://localhost:${PORT}/public/audio/`);
    console.log(`💳 Purchase API: http://localhost:${PORT}/api/purchase`);
});

module.exports = app;