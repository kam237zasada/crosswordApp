const { validateMail } = require('../models/mail');
const { appKey, secretKey, smtpAccount } = require('../config/index');
const request = require('request')


sendMail = async (req, res) => {
    const error = validateMail(req.body);
    if(error.error) {
        return res.status(400).send(error.error.details[0].message);
    };

    try {
        await request.post({
        url: 'https://api.emaillabs.net.pl/api/new_sendmail',
        headers: {
            'content-type' : 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + new Buffer.from(`${appKey}:${secretKey}`).toString("base64")
        },
        form: {
            to: {
                'kam237zasada@wp.pl': ''
            },
            'subject': `Contact from ${req.body.name} to Crossword App`,
            'html':`<p>${req.body.message}</p>`,
            'smtp_account': smtpAccount,
            'from_name': 'Crossword App',
            'from': 'admin@crossword-app.pl',
            'reply_to': req.body.email
        }
    },
    function (error, response, body) {
        res.send('Message sent!')
    }
    )
} catch(err) {
    return res.status(500).send("Oops. Something goes wrong.")
}
}

module.exports = {
    sendMail
}