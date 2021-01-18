const express = require("express");
const path = require("path");
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/notes.html"));
});



app.get("/api/notes", (req, res) => {
    fs.readFile('./db/db.json', 'utf8', (error, data) =>
        error ? res.json(error) : res.json(data)
    );
});

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.listen(PORT, () => {
    console.log(`App listening on PORT ${PORT}`);
});
