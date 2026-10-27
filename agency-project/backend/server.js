const express = require('express');
const cors = require('cors');
require('dotenv').config();
const apiRoutes = require('./routes/apiRoutes');

const app = express();
app.use(cors());
app.use(express.json());

// Routes connect karein
app.use('/api', apiRoutes);
app.get('/', (req, res) => {
    res.send('Agency Backend Server is Live and Running!');
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Backend Server running on http://localhost:${PORT}`);
});