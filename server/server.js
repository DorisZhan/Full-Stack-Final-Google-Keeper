const express = require('express');
const app = express();
const mongoose = require('mongoose');
const {MongoClient} = require('mongodb');
const uri = "mongodb+srv://fz2355:1wI85vFOj2Rd9SE2@fullstackfinal.f3qmtgx.mongodb.net/?retryWrites=true&w=majority&appName=fullstackfinal";
const { ObjectId } = require('mongodb');
const { Schema } = mongoose;

const NoteSchema = new Schema({
    title: {type: String, required: true},
    content: {type: String, required: true}
})

const NotesModel = mongoose.model('NoteModel', NoteSchema);
const bodyParser = require('body-parser');
app.use(bodyParser.json());
const client = new MongoClient(uri);
const notesdb = client.db("Notesdb");
mongoose.connect(uri);
console.log("database started")
async function main() {
    try {
        await client.connect();
        app.listen(3000, () => {console.log("Server at port 3000");});
    } catch (error) {
        console.error(error);
    }
}

app.get("/NOTES/getAll", async (req, res) => {
    try {
        const allnotes = await notesdb.collection('notes').find().toArray();
        console.log("Full table request");
        res.status(200).send(allnotes);
    } catch (error) {
        console.error("Failed to retrieve items", error);
        res.status(500).send(error);
    }
});

app.post("/NOTES/AddNote", async (req, res) => {
    try {
        const newNote = new NotesModel({...req.body});
        const insertedNote = await notesdb.collection('notes').insertOne(newNote);
        console.log("Note insertion request", req.body);
        res.status(201).send(insertedNote);
    } catch (error) {
        console.error("Failed to insert item", error);
        res.status(500).send(error);
    }
});

app.delete("/NOTES/:id", async (req, res) => {
    const idd = req.params.id;
    console.log("Note deletion request", idd);
    try {
        const result = await notesdb.collection('notes').findOneAndDelete({ _id: new ObjectId(idd) });
        res.send({status: 200});
    } catch (error) {
        console.error("Failed to delete item", error);
        res.status(500).send(error);
    }
});

main().catch(console.error);