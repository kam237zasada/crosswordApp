const express = require('express');
const { date } = require('joi');
const jwt = require('jsonwebtoken');
const { Crossword, validateAddCrossword } = require('../models/crossword')
const { User } = require('../models/user');


getCrossword = async (req, res) => {
    const crossword = await Crossword.findOne({"ID": req.params.id})
    if(!crossword) { return res.status(404).send("There's no crossword!")}    

    return res.send(crossword);
}

getRandomCrossword = async (req, res) => {
    const crosswords = await Crossword.find({isApproved: true});
    let maxIndex = crosswords.length-1

    let random = 0 + Math.floor((maxIndex - 1) * Math.random());

    const crossword = crosswords[random];

    res.send({
        ID: crossword.ID}
        );

}

addTry = async (req, res) => {
    const crossword = await Crossword.findById(req.params.id);
    if(!crossword) { return res.status(500).send("Oops, looks like there's no crossword!")}
    
    crossword.tries += 1;


    try {
        await crossword.save()
        res.send({
            message: "Try added"
        })
    } catch(err) {
        res.status(500).send("Oops, something goes wrong!")
    }
}

getAppCrosswords = async (req, res) => {
    const crosswords = await Crossword.find({"isApproved": true});
    let user;
    if(req.headers.token) {
    const encoded = jwt.decode(req.headers.token)
    let id = encoded.sub;
    user = await User.findById(id);
    }
    let expert = [];
    let advanced = [];
    let semiAdvanced = [];
    let beginner = [];
    crosswords.map(crossword => {
        crossword.solved="";
        if(user && user.solved.length>0) {
        user.solved.map(solved => {
            let isSolved = false
            if(solved.id===crossword.id) {
                isSolved = true;
            }
            if(isSolved) {
                crossword.solved = true
            } else {
                crossword.solved = false
            }
        })
    } else {
        crossword.solved=false;
    }
        switch(crossword.difficult) {
            case 'Expert':
                expert.push(crossword)
                break;
            case 'Advanced':
                advanced.push(crossword)
                break;
            case 'Semi-Advanced':
                semiAdvanced.push(crossword)
                break;
            case 'Beginner':
                beginner.push(crossword);
                break;
            default:
                break;
        }


    })
    const response = {
        beginner: beginner,
        semiAdvanced: semiAdvanced,
        advanced: advanced,
        expert: expert
    }
    return res.send(response)
}

getAddedCrosswords = async (req, res) => {
    let user = await User.findById(req.params.id);
    let page = Number(req.params.page);
    let limit = 2;
    let skip = (page-1)*limit;

    let allCrosswords = await Crossword.find({"addedBy._id": user._id});

    let crosswords = await Crossword.find({"addedBy._id": user._id}).skip(skip).limit(limit);

    res.send({
        crosswords: crosswords,
        length: allCrosswords.length});

}

getSolvedCrosswords = async (req, res) => {
    let user = await User.findById(req.params.id);
    let page = Number(req.params.page);
    let limit = 2;
    let skip = (page-1)*limit;

    let solved = user.solved;

    let length = solved.length;

    solved.splice(0, skip);
    solved.splice(limit, (solved.length-limit));

    res.send({
        crosswords: solved,
        length: length
    })
}

getProgressCrosswords = async (req, res) => {
    let user = await User.findById(req.params.id);
    let page = Number(req.params.page);
    let limit = 2;
    let skip = (page-1)*limit;

    let progress = user.tries;

    let length = progress.length;

    progress.splice(0, skip);
    progress.splice(limit, (progress.length-limit));

    res.send({
        crosswords: progress,
        length: length
    })
}


getUnapprovedCrosswords = async (req, res) => {
    const crosswords = await Crossword.find({isApproved: false, isRejected: false});

    if(crosswords.length<1) { return res.status(404).send("There's no crosswords to approve")};

    return res.send(crosswords);
}

addCrossword = async (req, res) => {
    const { error } = validateAddCrossword(req.body);
    if( error ) { return res.status(400).send(error.details[0].message) }

    let currentNumber;
    let crosswords = await Crossword.find();
    if(crosswords.length===0) { currentNumber = 1} else {
    let lastElementIndex = crosswords.length -1;
    currentNumber = crosswords[lastElementIndex].ID +1;
    }
    let difficult = "";
    let fields = req.body.values.length * req.body.values[0].length;
    if(fields<=64) {
        difficult="Beginner"
    } else if(fields<=144) {
        difficult="Semi-Advanced"
    } else if(fields<=256) {
        difficult="Advanced"
    } else if(fields>256) {
        difficult="Expert"
    }

    const user = await User.findById(req.body.addedBy);

    const newCrossword = new Crossword({
        ID: currentNumber,
        isApproved: false,
        isRejected: false,
        values: req.body.values,
        questions: req.body.questions,
        solution: req.body.solution,
        solvedBy: [],
        addedBy: user,
        approvedBy: {},
        difficult: difficult,
        dateCreated: Date.now(),
        tries: 0,
        ratings: [],
        ovrRate: 0
    })



    try {
        await newCrossword.save();
        user.added.push({
            _id: newCrossword._id,
            isApproved: false,
            isRejected: false
        })
        await user.save();
        res.send("New crossword created succesfully")
    } catch(err) {
        res.status(500).send("Oops. something goes wrong, try again later.")
    }
    
}

approveCrossword = async (req, res) => {
    let crossword = await Crossword.findOne({ID: req.params.id});
    if(!crossword) { return res.status(404).send("There's no crossword!")};
    let id = crossword._id.toString()

    let user = await User.findById(crossword.addedBy._id);
    console.log(user)

    const decoded = jwt.decode(req.body.token);

    let admin = await User.findById(decoded.sub);
    let added = user.added;


    if(req.body.action==="approve") {
        crossword.isApproved = true;
        crossword.approvedBy = admin;
        for(let i=0; i<added.length; i++) {
            if(id==added[i]._id) {
                added[i].isApproved=true
                added.set(i, added[i])
            }
        }

        admin.approved.push({
            _id: crossword._id,
            date: Date.now()
        })
        try {
            await crossword.save();
            await admin.save();
            await user.save();
            res.send("Crossword approved")
        } catch (err) {
            console.log(err)
            return res.status(500).send("Oops. Something goes wrong!")
        }
    } else if(req.body.action==="reject") {
        crossword.isRejected = true;
        crossword.rejectedBy = admin
        for(let i=0; i<added.length; i++) {
            if(id==added[i]._id) {
                added[i].isRejected=true
                added.set(i, added[i])
            }
        }
        crossword.rejectMsg = req.body.message;

        try {
            await crossword.save();
            await admin.save();
            await user.save();
            res.send("Crossword rejected")
        } catch (err) {
            return res.status(500).send("Oops. Something goes wrong!")
        }
    }
    
}

saveCrossword = async (req, res) => {
    if(req.headers.token) {
        const encoded = jwt.decode(req.headers.token);
    let user = await User.findById(encoded.sub);
    let crossword = await Crossword.findById(req.body._id);
    let tried = false;
    let tries = user.tries;
    for(let i=0; i<tries.length; i++) {
        if(req.body._id===tries[i]._id) {
            tries[i].values = req.body.crossword
            tries.set(i, tries[i]);
            tried = true
        }
    }

    if(!tried) {
        user.tries.push({
            ID: crossword.ID,
            _id: req.body._id,
            values: req.body.crossword,
            update: Date.now()
        })
    }

    try {
        await user.save()
        res.send("Crossword saved!")
    } catch(err) {
        return res.status(500).send("Oops, something goes wrong!")
    }
    } else { return res.send("You cannot save crossword, when you arent signed in")}
    

}

solveCrossword = async (req, res) => {

    let crossword = await Crossword.findById(req.params.id);
    let user = "unauthorized"

    if(req.headers.token) {
        const encoded = jwt.decode(req.headers.token);
        user = await User.findById(encoded.sub);

        let isSolved = false
        user.solved.map( solve => {
        if(solve._id==crossword._id) {
            isSolved = true
        }
    })
    if(isSolved===false) {
        user.solved.push({
            _id: req.params.id,
            across: crossword.values.length,
            down: crossword.values[0].length,
            ID: crossword.ID,
            addedBy: crossword.addedBy,
            dateSolved: Date.now()
        })
    }

    }
    

    for(let i=0; i<crossword.values.length; i++) {
        for(let j=0; j<crossword.values[i].length; j++) {
            if(crossword.values[i][j].name===req.body.crossword[i][j].name) {
                if(crossword.values[i][j].value!=req.body.crossword[i][j].value) {
                    return res.status(500).send("Something is wrong in this crossword!")
                }
            }
        }
    }

    if(req.headers.token) {
        crossword.solvedBy.push({
            _id: user._id,
            dateSolved: Date.now()
        })
        console.log(user)
        for(let i =0; i<user.tries.length; i++) {
            if(user.tries[i]._id==crossword._id) {
                user.tries.splice(i, 1)
                console.log(user.tries)
            }
        }

        try {
            await user.save() 
        } catch(err) {
            res.status(500).send("Oops, something goes wrong")
        }
    } else {

    crossword.solvedBy.push({
        _id: user,
        dateSolved: Date.now()
    })
}

    try {
        await crossword.save()
        res.send("Crossword solved! Good job!")
    } catch(err) {
        return res.status(500).send("Oops, something goes wrong!")
    }

}

reviewCrossword = async (req, res) => {

    const encoded = jwt.decode(req.headers.token);
    let user = await User.findById(encoded.sub);
    let userId = user._id.toString();

    let crossword = await Crossword.findById(req.params.id);
    let reviewed = false;
    for(let i=0; i<crossword.ratings.length; i++) {
        if(crossword.ratings[i].user==userId) {
            reviewed = true 
        }
    }
    if(!reviewed) {
        crossword.ratings.push({
            user: user._id,
            rating: req.body.rating,
            dateAdded: Date.now()
        });
    } else {
        return res.status(401).send("You have added your rating to this crossword yet. ")
    }
    let ratings = 0
    crossword.ratings.map(rating => {
        let x = Number(rating.rating)
        ratings +=x
    });
    let ovr = ratings/crossword.ratings.length;
    let ovrRound = Number(Math.round(ovr + 'e+2') + 'e-2');

    crossword.ovrRating = ovrRound;

    user.reviewed.push({
        _id: crossword._id,
        rating: req.body.rating,
        dateAdded: Date.now()
    })

    try {
        await crossword.save();
        await user.save()
        res.status(200).send("Crossword rating added sucesfully");
    } catch(err) {
        res.status(500).send("Oops. something goes wrong");
        console.log(err)
    }
}

module.exports = {
    getCrossword,
    getRandomCrossword,
    addTry,
    getAppCrosswords,
    getAddedCrosswords,
    getSolvedCrosswords,
    getProgressCrosswords,
    getUnapprovedCrosswords,
    addCrossword,
    approveCrossword,
    saveCrossword,
    solveCrossword,
    reviewCrossword
}