const Joi = require('joi');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    ID: {
        type: Number
    },
    login: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    dateCreated: {
        type: Number,
        default: Date.now()
    },
    solved: {
        type: Array,
        default: []
    },
    tries: {
        type: Array,
        default: []
    },
    approved: {
        type: Array,
        default: []
    },
    added: {
        type: Array,
        default: []
    },
    reviewed: {
        type: Array,
        default: []
    },
    active: {
        type: Boolean,
        default: false
    }
});

const User = mongoose.model('User', userSchema);

function validateUser(user) {
    const schema = Joi.object({
        login: Joi.string().min(5).max(20).required(),
        email: Joi.string().min(3).max(50).email().required(),
        password: Joi.string().min(6).max(20).required(),
        confirmPassword: Joi.string().min(6).max(20).required(),
    })
    return schema.validate(user);
}

function validateDetails(user) {
    const schema = Joi.object({
        login: Joi.string().min(5).max(20).required(),
        email: Joi.string().min(3).max(50).email().required(),
    })
    return schema.validate(user);
}


function validatePassword(user) {
    const schema = Joi.object({
        password: Joi.string().min(6).max(20).required(),
        confirmPassword: Joi.string().min(6).max(20).required()
    })
    return schema.validate(user);
}

exports.User = User;
exports.validateUser = validateUser;
exports.validatePassword = validatePassword;
exports.validateDetails = validateDetails;
exports.userSchema = userSchema;