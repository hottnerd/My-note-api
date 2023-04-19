const express = require("express");
const {getNotes,
    noteUpdate,
    noteDelete,
    noteAdd
    } = require("../controllers/noteControllers");
const noteRouter = express.Router()

noteRouter.get("/",getNotes);

noteRouter.put("/update/:noteId",noteUpdate);

noteRouter.post("/add",noteAdd);

noteRouter.delete("/delete/:noteId",noteDelete)

module.exports = noteRouter;