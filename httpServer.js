'use strict';

const http = require('http');
const fs = require("fs");
const path = require("path");
const url = require("url");

const petsPath = path.join(__dirname, "pets.json");

const port = process.env.PORT || 8000;

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
    const server = http.createServer(function(req, res) {
        if (req.method  === "GET" && req.url === "/pets") {
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
        } else if (req.method  === "GET" && req.url.startsWith("/pets/"))  {
            let index = parseInt(req.url.substring(6));
            if (Number.isInteger(index)) {
                if (index < 0 || index > petsMaxIndex - 1) {
                    res.statusCode = 404;
                    res.setHeader("Content-Type", "text/plain");
                    res.end("Not Found");
                } else {
                    fs.readFile(petsPath, "utf-8", function(err, data) {
                        if (err) {
                            console.error(err);
                            res.statusCode = 500;
                            res.setHeader("Content-Type", "text/plain");
                            res.end("Internal Server Error");
                            return;
                        }
                    let pets = JSON.parse(data);
                    let petJSON = JSON.stringify(pets[index]);
                    res.setHeader("Content-Type", "application/json");
                    res.end(petJSON);
                    });
                }
            } else {
                res.statusCode = 404;
                res.setHeader("Content-Type", "text/plain");
                res.end("Not Found");
            }
        } else if (req.method === "POST" && req.url === "/pets") {
            let body = "";
            req.on("data", function(chunk) {
                body += chunk.toString();
            });
            req.on("end", function() {
                let params = JSON.parse(body);
                console.log(params);
                let petAge = parseInt(params.age);
                let petKind = params.kind;
                let petName = params.name;
                if (isNaN(petAge) || !petKind || !petName) {
                    res.statusCode = 400;
                    res.setHeader("Content-Type", "text/plain");
                    res.end("Bad Request");
                    return;
                }
                fs.readFile(petsPath, "utf-8", function(err, data) {
                    if (err) {
                        console.error(err);
                        res.statusCode = 500;
                        res.setHeader("Content-Type", "text/plain");
                        res.end("Internal Server Error");
                        return;
                    }
                    let pets = JSON.parse(data);
                    let newPet = {
                        age: Number(petAge),
                        kind: petKind,
                        name: petName
                    };
                    pets.push(newPet);
                    let petsJSON = JSON.stringify(pets);
                    fs.writeFile(petsPath, petsJSON, function(err) {
                        if (err) {
                            console.error(err);
                            res.statusCode = 500;
                            res.setHeader("Content-Type", "text/plain");
                            res.end("Internal Server Error");
                            return;
                        }
                        res.statusCode = 200;
                        res.setHeader("Content-Type", "application/json");
                        res.end(JSON.stringify(newPet));
                     })
                });
            });
        } else {
            res.statusCode = 404;
            res.setHeader("Content-Type", "text/plain");
            res.end("Not Found");
        }
    });
    server.listen(port, function() {
        console.log('Listening on port:', port);
    });
}