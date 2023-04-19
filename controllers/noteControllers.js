const createHttpError = require("http-errors");
const { default: mongoose } = require("mongoose");
const Note = require("../models/noteModel");

const getNotes = async (req,res,next) => {
    try {
        const notes = await Note.find().populate("userId","-email -admin").exec();
        res.status(200).json(notes)
    } catch (err) {
        next(err)
    }
};

const noteUpdate = async (req,res,next) => {
    const noteId = req.params.noteId;
    const newTitle = req.body.title;
    const newText = req.body.text;
    const userId = req.user._id;

    try{
        if(!mongoose.isValidObjectId(noteId)){
            throw createHttpError(400,"Invalid note ID");
        }
        if(!newTitle){
            throw createHttpError(400,"Note must contain title");
        }

        const note = await Note.findById(noteId).exec();
        
        if(!note){
            throw createHttpError(404,"Note not found");
        }

        if(!(note.userId.equals(userId) || req.user.admin)){
            throw createHttpError(401,"You cannot access this note");
        }

        note.title = newTitle;
        note.text = newText || note.text;

        const updatedNote = await note.save();
     
        const populatedUpdatedNote = await Note.findById(updatedNote._id).populate("userId","-email -admin").exec();

        res.status(200).json(populatedUpdatedNote);
        
    } catch (err) {
        next(err);
    } 
};

const noteDelete = async (req,res,next) => {
    const noteId = req.params.noteId;
    const userId = req.user._id;

    try{
        if(!mongoose.isValidObjectId(noteId)){
            throw createHttpError(400,"Invalid note ID");
        }

        const note = await Note.findById(noteId).exec();

        if(!note){
            throw createHttpError(404,"Note not found");
        }

        if(!(note.userId.equals(userId) || req.user.admin)){
            throw createHttpError(401,"You cannot delete this note");
        }
        
        await Note.deleteOne({ _id: noteId });

        res.sendStatus(204);
    } catch (err) {
        next(err);
    }
    
};

const noteAdd = async (req,res,next) => {
    const title = req.body.title;
    const text = req.body.text;
    const userId = req.user._id;

    try{
        if(!title){
            throw createHttpError(400,"Note must contain title");
        }
        if(!text){
            throw createHttpError(400,"Note must contain body");
        }
        const note = Note({
            title : title,
            text : text,
            userId: userId
        });

        const savedNote = await note.save();
     
        const newNote = await Note.findById(savedNote._id).populate("userId","-email -admin").exec();

        res.status(200).json(newNote);

    } catch (err) {
        next(err);
    } 
};



module.exports = {getNotes,
                  noteUpdate,
                  noteDelete,
                  noteAdd
                };