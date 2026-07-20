const express = require('express');
const cookeParser = require('cookie-parser');
const cors = require('cors')
const app = express();

app.use(express.json());
app.use(cookeParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))

/* require all the routes here from routes folder / auth.routes file */
const authRouter = require('./routes/auth.routes');
const interviewRouter = require('./routes/interview.routes');

/* using all routes here with prefix /api/auth */
app.use('/api/auth', authRouter);
app.use('/api/interview', interviewRouter);

module.exports = app;