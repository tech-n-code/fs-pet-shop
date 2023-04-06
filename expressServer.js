const express = require("express");
const fs = require("fs");
const path = require("path");

const petsPath = path.join(__dirname, "pets.json");

const server = express();
const port = process.env.PORT || 3000;

let petsMaxIndex = 0;

fs.readFile(petsPath, "utf-8", function(err, data) {
    if (err) {
        console.error(err);
    }
    let pets = JSON.parse(data);
    petsMaxIndex = pets.length -1;
    console.log(`pets.json max index: ${petsMaxIndex}`);
    startServer();
});

function startServer() {
    server.get("/", function(req, res) {
        res.send("Hello World");
    });
    
    server.listen(port, function() {
        console.log(`Server is listening on port ${port}`)
    });

}

