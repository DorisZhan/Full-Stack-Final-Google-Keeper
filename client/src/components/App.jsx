import React, { useEffect, useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Note from "./Note";


function App() {
  const [totnotes, setNotes] = useState([]);
  const [noteInput, setNoteInput] = useState({title: "", content: "" });
    //initialize the notes from database
  useEffect(() => {
    fetch('/NOTES/getAll').then(
      response => response.json()
    ).then(
      data => {
        setNotes(data);
        //console.log(data);
  }).catch(console.error);
  }, []);
  //type box state
  function record(event) {
    const { name, value } = event.target;
    setNoteInput((currentInput) => ({ ...currentInput, [name]: value }));
  }
  //add note state
  function handleAdd() {
    // event.preventDefault();
    if (noteInput.title && noteInput.content) {
      const req_options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(noteInput),
      };
      console.log(noteInput);
      fetch('/NOTES/AddNote', req_options)
      .then(response => response.json())
      .then(data => {  //backend needs to return the data with id
        setNotes(oldnotes => [...oldnotes, data]);
        console.log('data added', data);
        setNoteInput({title: "", content: ""});
      })
      .catch(console.error);
    }
  }
  
  function handleDelete(noteKey) {
    fetch('/NOTES/'+noteKey, { method: "DELETE" })
      .then(() => {
        setNotes(prev => prev.filter(note => note._id !== noteKey));  // Optimistically remove the note from state
      })
      .catch(console.error);
  }

  return (
    <div>
      <Header />
      <form onSubmit={handleAdd}>
        <input
          name="title"
          placeholder="Title"
          value={noteInput.title}
          onChange={record}
        />
        <textarea
          name="content"
          placeholder="Take a note..."
          rows="3"
          value={noteInput.content}
          onChange={record}
        />
        <button type="submit">Add</button>
      </form>
      {totnotes.map((note) => (
        <Note
          //key={note.key}
          id={note._id}
          title={note.title}
          content={note.content}
          onDelete={() => handleDelete(note._id)}
        />
      ))}
      <Footer />
    </div>
  );
}

export default App;
