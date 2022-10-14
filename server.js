const express = require("express");
const path = require("path");

const routes = require('./controller');
const db = require('./config/connection');
const app = express();
const PORT = 3001;

app.use(express.urlencoded({ extended: false}));
app.use(express.json());
app.use(routes);
app.get('*', (req, res) => res.status(404).end());

db.once('open', () => {
    app.listen(PORT, () => {
        console.log(`API running on port: ${PORT}`);
    });
});