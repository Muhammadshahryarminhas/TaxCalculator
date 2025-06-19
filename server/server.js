const express = require('express');
const cors = require('cors');
const fs = require('fs');
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const dataFile = './visits.json';

// Ensure visits.json exists and is valid JSON
if (!fs.existsSync(dataFile)) {
    fs.writeFileSync(dataFile, JSON.stringify({}));
}

let rawData = fs.readFileSync(dataFile, 'utf8');
let visits = rawData ? JSON.parse(rawData) : {};

// Endpoint to track visits
app.post('/visit', (req, res) => {
    const userIp = req.ip;

    if (!visits[userIp]) {
        visits[userIp] = 1;
    } else {
        visits[userIp] += 1;
    }

    fs.writeFileSync(dataFile, JSON.stringify(visits, null, 2));

    const totalVisits = Object.values(visits).reduce((a, b) => a + b, 0);

    res.json({ totalVisits });
});

// Start server
app.listen(PORT, () => {
    console.log(`Visit counter API running on port ${PORT}`);
});
