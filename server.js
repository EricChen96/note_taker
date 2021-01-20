const express = require("express");
const path = require("path");
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "./public")));

let idCount = 0;


app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/notes.html"));
});

app.get("/api/notes", (req, res) => {
    fs.readFile('./db/db.json', 'utf8', (error, data) =>
        error ? res.json(error) : res.json(JSON.parse(data))
    );
});


app.post("/api/notes", (req, res) => {
    let newNote = req.body;
    fs.readFile(path.join(__dirname, './db/db.json'), 'utf8', (error, data) => {
        let currentNotes = [];
        // checks if there are other notes
        if (JSON.parse(data).length >= 1) {
            currentNotes = [...JSON.parse(data)];
            idCount = currentNotes[currentNotes.length - 1].id + 1;
        }
        newNote.id = idCount;
        currentNotes.push(newNote);
        fs.writeFile(path.join(__dirname, './db/db.json'), JSON.stringify(currentNotes), (err) =>
            err ? console.error(err) : console.log('Commit logged!')
        );
    });
    res.json(newNote);
});

app.delete("/api/notes/:id", (req, res) => {
    const chosen = parseInt(req.params.id);
    let notes = [];
    fs.readFile(path.join(__dirname, './db/db.json'), 'utf8', (error, data) => {
        if (JSON.parse(data).length >= 1) {
            notes = [...JSON.parse(data)];
            for (let i = 0; i < notes.length; i++) {
                if (chosen === notes[i].id) {
                    notes.splice(i, 1);
                }
            }
        }
        fs.writeFile(path.join(__dirname, './db/db.json'), JSON.stringify(notes), (err) =>
            err ? console.error(err) : console.log('Note Deleted!')
        );
    });
    res.json(true);
});

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.listen(PORT, () => {
    console.log(`App listening on PORT ${PORT}`);
});
