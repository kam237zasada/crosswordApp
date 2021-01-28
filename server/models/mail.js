const Joi = require('joi');

function validateMail(mail) {
    const schema = Joi.object({
        name: Joi.string().min(2).max(50).required(),
        email: Joi.string().min(3).max(60).email().required(),
        message: Joi.string().max(1000).required()
    })

    return schema.validate(mail)
}

exports.validateMail = validateMail;