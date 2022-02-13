

const express = require('express');
const path = require('path');
const fs = require('fs');
const uuid = require('uuid');

// Sets up the Express App
var app = express();
var PORT = process.env.PORT || 3000;

//Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//Set static folder
app.use(express.static(path.join(__dirname, 'public')));

//Notes HTML & API Routes
app.get("/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "/public/notes.html"));
  });

  app.get("/api/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "db/db.json"));
});

app.get("/api/notes/:id", function(req, res) {
    let savedNotes = JSON.parse(fs.readFileSync("db/db.json", "utf8"));
    res.json(savedNotes[Number(req.params.id)]);
});

app.get("*", function(req, res) {
    res.sendFile(path.join(__dirname, "/public/index.html"));
  });

//Save note to db.json
app.post("/api/notes", function(req, res) {
    let savedNotes = JSON.parse(fs.readFileSync("db/db.json", "utf8"));
    let newNote = req.body;
    newNote.id = uuid.v4(),
    savedNotes.push(newNote);

    fs.writeFileSync("db/db.json", JSON.stringify(savedNotes));
    console.log("Note saved to db.json. Content: ", newNote);
    res.json(savedNotes);
})

//Delete Note
app.delete("/api/notes/:id", function(req, res) {
    let savedNotes = JSON.parse(fs.readFileSync("db/db.json", "utf8"));
    let noteID = req.params.id;
    console.log(`Deleting note with ID ${noteID}`);
    savedNotes = savedNotes.filter(currNote => {
        return currNote.id != noteID;
    })
    
    fs.writeFileSync("db/db.json", JSON.stringify(savedNotes));
    res.json(savedNotes);
})

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));