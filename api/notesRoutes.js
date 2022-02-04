const fs = require('fs');
const { resolve } = require('path');
const dbPath = resolve(__dirname + '/../db/db.json')

module.exports = app => {
    app.get("/api/notes", function (req, res) {
        fs.readFile(dbPath, "utf8", function (err, json) {
            const data = JSON.parse(json) || [];
            res.json(data);
        });
    });

    app.get("/api/notes/:id", function (req, res) {
        const id = Number(req.params.id);
        fs.readFile(dbPath, "utf8", function (err, json) {
            const data = JSON.parse(json) || [];
            const note = data.find(node => node.id === id)
            res.json(note);
        });
    });

    app.post("/api/notes", (req, res) => {
        fs.readFile(dbPath, "utf8", (err, json) => {
            const data = JSON.parse(json) || [];
            const payload = req.body;

            payload.id = Date.now();
            data.push(payload);

            fs.writeFile(dbPath, JSON.stringify(data, null, 2), err => {
                if (err) throw err;
                res.json(data);
            });
        });
    });

    app.delete("/api/notes/:id", (req, res) => {
        const id = Number(req.params.id);
        if (id > 0) {
            fs.readFile(dbPath, "utf8", (err, json) => {
                const data = JSON.parse(json);

                const index = data.findIndex(note => note.id === id)
                data.splice(index, 1)
    
                fs.writeFile(dbPath, JSON.stringify(data, null, 2), err => {
                    if (err) throw err;
                    res.json(data);
                });
            });
        }
        else {
            res.status(401).json({ error: "this is a test note and cannot be deleted" });
        }
    });
};