const { baseURL } = require('../config/index');


exports.activationMail = (data) => {

    return `<h2>Welcome ${data.login} in Crossword App!</h2><br>
    <p>You have received this mail because you have just created an account in our website. You have just one step left to join the best crossword app in the world!</p>
    <a href="${baseURL}/activation/${data._id}/${data.token}">Click here to activate your account!</a>
    <p>If you did not create any account, just ignore this email.</p>
    <p>This is automatic message, please do not reply to this email.</p>
    <p>Best regards</p>
    <p>Crossword App Team</p>`
}

exports.passwordReset = (data) => {
    return `<h2>Password reset request</h2><br>
    <p>We have just received, that you want to reset your password in Crossword App. Please click below link to do this!</p>
    <a href="${baseURL}/password-reset/${data._id}/${data.token}">Reset password now!</a>
    <p>If you did not requested anything, just ignore this email.</p>
    <p>This is automatic message, please do not reply to this email.</p>
    <p>Best regards</p>
    <p>Crossword App Team</p>`
}