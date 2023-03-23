const fs = require("fs");

let arg1 = process.argv[2];
let arg2 = process.argv[3];
let arg3 = process.argv[4];
let arg4 = process.argv[5];
let arg5 = process.argv[6];

switch(arg1) {
    case "read":
        console.log("You selected 'read'.");
        read(arg2);
        break;
    case "create":
        console.log("You selected 'create'.") 
        if (!arg2 || !arg3 || !arg4) {
            console.log("Usage: node pets.js create <age> <kind> <name>");
            break;
        } else {
            create(arg2, arg3, arg4);
        };
        break;
    case "update":
        console.log("You selected 'update'.");
        if (!arg2 || !arg3 || !arg4 || !arg5) {
            console.log("Usage: node pets.js update <index> <age> <kind> <name>");
        } else {
            update(arg2, arg3, arg4, arg5);
        }
        break;
    case "destroy":
        console.log("You selected 'destroy'.");
        if (!arg2) {
            console.log("Usage: node pets.js destroy <index>");
        } else {
            destroy(arg2);            
        }
        break;
    default:
        console.log("Usage: node pets.js [read <index> | create <age> <kind> <name> | update <index> <age> <kind> <name> | destroy <index>]");
}

function read(index) {
    fs.readFile("./pets.json", "utf-8", function(err, data) {
        if (err) throw err;
        let pets = JSON.parse(data);
        if (index === undefined) {
            console.log(pets);
        } else if (isNaN(index)) {
            console.log("Index is not a number.");
        } else if (index > pets.length - 1){
            console.log(`Index needs to be smaller than ${pets.length - 1}.`);
        } else {
            console.log(pets[Math.abs(index)]);
        }
    });
}

function create(petAge, petKind, petName) {
    fs.readFile("./pets.json", "utf-8", function(err, data) {
        let pets = JSON.parse(data);
        pets.push({age: Number(petAge), kind: petKind, name: petName});
        let petsJSON = JSON.stringify(pets)
        console.log(petsJSON);
        fs.writeFile("./pets.json", petsJSON, "utf-8", function(err) {
            if (err) throw err;
            console.log("The file has been saved!")
        });
    });
}

function update(index, petAge, petKind, petName) {
    fs.readFile("./pets.json", "utf-8", function(err, data) {
        if (err) throw err;
        let pets = JSON.parse(data);
        pets[index] = {
            age: Number(petAge),
            kind: petKind,
            name: petName
        };
        let petsJSON = JSON.stringify(pets)
        console.log(pets[index]);
        fs.writeFile("./pets.json", petsJSON, "utf-8", function(err) {
            if (err) throw err;
            console.log("The file has been saved!")
        });
    });
}

function destroy(index) {
    fs.readFile("./pets.json", "utf-8", function(err, data) {
        if (err) throw err;
        let pets = JSON.parse(data);
        let destroyedPet = pets[index];
        console.log(destroyedPet);
        pets.splice(index, 1);
        let petsJSON = JSON.stringify(pets)
        fs.writeFile("./pets.json", petsJSON, "utf-8", function(err) {
            if (err) throw err;
        });
    });
}