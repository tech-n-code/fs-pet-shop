const express = require("express");
const fs = require("fs");
const path = require("path");

const petsPath = path.join(__dirname, "pets.json");

const app = express();
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
    app.get("/", function(req, res) {
        res.send("Hello World");
    });

    app.get("/pets", function(req, res) {
        fs.readFile(petsPath, "utf-8", function(err, data) {
            if (err) {
                console.error(err);
                res.statusCode = 500;
                res.setHeader("Content-Type", "text/plain");
                res.end("Internal Server Error");
                return;
            }
            let pets = JSON.parse(data);
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify(pets));
        });
    });

    app.get("/pets/:index", function(req, res) {
        petIndex = parseInt(req.params.index);
        console.log(petIndex);
        fs.readFile(petsPath, "utf-8", function(err, data) {
            if (err) {
                console.error(err);
                res.statusCode = 500;
                res.setHeader("Content-Type", "text/plain");
                res.end("Internal Server Error");
                return;
            } else if (isNaN(petIndex) || petIndex < 0) {
                res.statusCode = 404;
                res.setHeader("Content-Type", "text/plain");
                res.end("Not Found");
            } else if (petIndex <= petsMaxIndex) {
                let pets = JSON.parse(data);
                let petJSON = JSON.stringify(pets[petIndex]);
                res.setHeader("Content-Type", "application/json");
                res.end(petJSON);
            } else {
                res.statusCode = 404;
                res.setHeader("Content-Type", "text/plain");
                res.end("Not Found");
            }
        });
    });
    
    app.listen(port, function() {
        console.log(`Server is listening on port ${port}`)
    });
}

