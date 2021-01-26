const mongoose = require('mongoose');
const Joi = require('joi');
const { userSchema } = require('./user')

const crosswordSchema = new mongoose.Schema({
    ID: {
        type: Number
    },
    isApproved: {
        type: Boolean
    },
    isRejected: {
        type: Boolean
    },
    values: {
        type: Array,
        required: true
    },
    questions: {
        type: Array
    },
    solution: {
        type: Array,
        required: true
    },
    solvedBy: {
        type: Array
    },
    addedBy: {
        type: Object
    },
    approvedBy: {
        type: Object
    },
    rejectedBy: {
        type: Object
    },
    dateCreated: {
        type: Number,
    },
    difficult: {
        type: String
    },
    tries: {
        type: Number
    },
    ratings: {
        type: Array
    },
    ovrRating: {
        type: Number
    },
    rejectMsg: {
        type: String
    }
})

const Crossword = mongoose.model('Crossword', crosswordSchema);

function validateAddCrossword(crossword) {
    const schema = Joi.object({
        values: Joi.array().required(),
        addedBy: Joi.objectId().required(),
        questions: Joi.array().required(),
        solution: Joi.array().required()
    })

    return schema.validate(crossword)
}




exports.Crossword = Crossword;
exports.validateAddCrossword = validateAddCrossword;