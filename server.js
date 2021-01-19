const express = require("express");
const path = require("path");
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

let idCount = 0;


app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/notes.html"));
});

app.get("/api/notes", (req, res) => {
    fs.readFile('./db/db.json', 'utf8', (error, data) =>
        error ? res.json(error) : res.json(JSON.parse(data))
    );
});

let currentNotes = [];

app.post("/api/notes", (req, res) => {
    let newNote = req.body;
    // currentNotes.push(newNote);
    fs.readFile('./db/db.json', 'utf8', (error, data) => {
        if(data) {
            currentNotes = [... JSON.parse(data)];
            idCount = currentNotes[currentNotes.length-1].id+1;
        }
        newNote.id = idCount;
        currentNotes.push(newNote);
        fs.writeFile('./db/db.json', JSON.stringify(currentNotes), (err) =>
            err ? console.error(err) : console.log('Commit logged!')
        );
    })
    res.json(newNote);
});

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.listen(PORT, () => {
    console.log(`App listening on PORT ${PORT}`);
});
