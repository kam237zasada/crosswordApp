const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const request = require('request');
const { generateToken } = require('./auth');
const { User, validateUser, validatePassword, validateDetails } = require('../models/user')
const { Crossword } = require('../models/crossword')
const { appKey, secretKey } = require('../config/index');
const templates = require('../templates');


getUser = async (req, res) => {
    const decoded = jwt.decode(req.headers.token);
    let user;

    try {
        user = await User.findById(decoded.sub).select("-password")
        if(!user) { return res.status(404).send("There's no user!") }
        return res.send(user);
        } catch (err) {
            return res.status(404).send('There is no user')
        }
}

getUserById = async (req, res) => {
    const user = await User.findById(req.params.id).select("-password");
    if(!user) { return res.status(404).send("There's no user!")};

    return res.send(user);
}

getUsers = async (req, res) => {
    const users = await User.find().select("-password");
    if(users.length<1) { return res.status(404).send("There's no registered users!")};

    return res.send(users)
}

getUsersByQuery = async (req, res) => {
    const reg = new RegExp(req.params.query, "i")

    const users = await User.find({isAdmin: false}).or([
        {"login" : {$regex: reg}},
        {"email": { $regex: reg}}
    ]).select("-password")

    if(users.length<1) { return res.status(404).send("There's no users! Search again")}

    res.send(users);
}

getAdmins = async (req, res) => {
    const admins = await User.find({isAdmin: true}).select("-password");
    if(admins.length<1) { return res.status(404).send("There's no admins")};

    return res.send(admins)
}



addUser = async (req, res) => {
    const error = validateUser(req.body);
    if(error.error) {
        return res.status(400).send(error.error.details[0].message);
    };

    const existingLogin = await User.find({"login": req.body.login});
    if(existingLogin.length>0) { return res.status(400).send("An user with that login is already registered, type different login.")};

    const existingEmail = await User.find({"email": req.body.email});
    if(existingEmail.length>0) { return res.status(400).send("An user with that email is already registered, If you don't remember password, use Password Reminder")};

    if(req.body.password!=req.body.confirmPassword) { return res.status(400).send("Passwords are not the same!")}

    let currentNumber;
    let users = await User.find();
    if(users.length===0) { currentNumber = 1} else {
    let lastElementIndex = users.length -1;
    currentNumber = users[lastElementIndex].ID +1;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const newUser = new User({
        login: req.body.login,
        email: req.body.email,
        password: hashedPassword,
        ID: currentNumber
    });


    try {
        await newUser.save();
        res.send({
            message:"New user added successfully. Check your email to confirm your account!",
            _id: newUser._id
            
        });
    
    } catch (error) { return res.status(500).send("Ooops. something goes wrong! Try again later!");}

    let token = generateToken(req, newUser)

    try {
        await request.post({
        url: 'https://api.emaillabs.net.pl/api/new_sendmail',
        headers: {
            'content-type' : 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + new Buffer.from(`${appKey}:${secretKey}`).toString("base64")
        },
        form: {
            to: {
                [req.body.email]: ''
            },
            'subject': `Welcome in Crossword's world!`,
            'html':templates.activationMail({login: newUser.login, _id: newUser._id, token: token }),
            'smtp_account': '1.torebkowamania.smtp',
            'from': 'admin@crossword-app.pl',
            'from_name': 'Crossword App'
        }
    },
    function (error, response, body) {
    }
    )
} catch(err) {
    return res.status(500).send("Oops. Something goes wrong.")
}

}

accountActivation = async (req, res) => {
    const user = await User.findById(req.params.id).select("-password");
    if(!user) { return res.status(404).send('There is no user!')}

    user.set({
        active: true
    })

    try {
        await user.save();
        res.send('Your account is now active!')
    } catch(err) {
        return res.status(500).send('Oops. something goes wrong')
    }
}

userLogin = async (req, res) => {
    const login = await User.findOne({login: req.body.login});

    if(!login) { return res.status(400).send("Login or password is/are incorrect.")}

    const validatePassword = await bcrypt.compare(req.body.password, login.password);

    if(!validatePassword) { return res.status(400).send("Login or password is/are incorrect.")};

    if(!login.active) { return res.status(400).send(`You have to activate your account. Check your mailbox! Sometimes you can find our message in SPAM`)}

    let token = generateToken(req, login)

    try {
        res.send({
            message: `User ${login.login} sign in succesfully.`,
            login: login.login,
            email: login.email,
            _id: login._id,
            isAdmin: login.isAdmin,
            solved: login.solved,
            tries: login.tries,
            approved: login.approved,
            jwt_access: token,
            active: login.active
        })
    } catch (error) { res.status(500).send("Ooops. something goes wrong! Try again later!");}
}

resendActivation = async (req, res) => {
    let user;
    try {
        user = await User.findById(req.params.id);
    } catch(err) {

    }
    if(!user) { 
        user = await User.findOne({email: req.params.id})
    }
    if(!user) {
        return res.status(404).send('Oops. It looks like there is no user!');
    }

    if(user.active) {
        return res.status(400).send('You are an active user now. You do not have to do this. Maybe reset your password')
    }

    let token = generateToken(req, user)

    try {
        await request.post({
        url: 'https://api.emaillabs.net.pl/api/new_sendmail',
        headers: {
            'content-type' : 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + new Buffer.from(`${appKey}:${secretKey}`).toString("base64")
        },
        form: {
            to: {
                [user.email]: ''
            },
            'subject': `Welcome in Crossword's world!`,
            'html':templates.activationMail({login: user.login, _id: user._id, token: token }),
            'smtp_account': '1.torebkowamania.smtp',
            'from': 'admin@crossword-app.pl',
            
        }
    },
    function (error, response, body) {
    }
    )
    res.send('Email sent. Check your email. Sometimes it could take few minutes. Check your SPAM folder too.')
} catch(err) {
    return res.status(500).send("Oops. Something goes wrong.")
}

}

passwordReminder = async (req, res) => {
    const user = await User.findOne({email: req.body.email});
        if(!user) { return res.status(404).send('Oops. It looks like there is no user with that email.')};
        if(!user.active) { return res.status(400).send('Your account is unactive! You have to active with link which was sent to you by email when you have registered account. Check your SPAM folder or resend activation link.')}

        let token = generateToken(req, user)
        try {
            await request.post({
            url: 'https://api.emaillabs.net.pl/api/new_sendmail',
            headers: {
                'content-type' : 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + new Buffer.from(`${appKey}:${secretKey}`).toString("base64")
            },
            form: {
                to: {
                    [user.email]: ''
                },
                'subject': `Password reset`,
                'html':templates.passwordReset({_id: user._id, token: token }),
                'smtp_account': '1.torebkowamania.smtp',
                'from': 'admin@crossword-app.pl',
                'from_name': 'Crossword App'
            }
        },
        function (error, response, body) {
        }
        )
        res.send('Mail sent. Please check your mailbox. Sometimes it takes few minutes. Please check your SPAM folder also.')
    } catch(err) {
        return res.status(500).send("Oops. Something goes wrong.")
    }
}

resetPassword = async (req, res) => {
    const user = await User.findById(req.params.id);
    if(!user) { return res.status(404).send("Oops. It looks like there is no user.")};
    
    if(req.body.password!==req.body.confirmPassword) { return res.status(400).send("Passwords must be the same.")}

    const { error } = validatePassword({password: req.body.password, confirmPassword: req.body.confirmPassword});
    if(error) {
        return res.status(400).send(error.details[0].message);
    };

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    user.set({
        password: hashedPassword
    });

    try {
        await user.save();
        res.send('Password updated! You can now just sign in!')
    } catch(err) {
        return res.status(500).send('Oops. Something goes wrong.')
    }
}

updateUser = async (req, res) => {
    const encoded = jwt.decode(req.headers.token);
    const user = await User.findById(encoded.sub);
    let id = user._id.toString();

    const checkPassword = await bcrypt.compare(req.body.currentPassword, user.password);
    if(!checkPassword) { return res.status(400).send("Current password is not correct!")};

    const existingLogin = await User.findOne({"login": req.body.login});
    if(existingLogin && encoded.sub!=existingLogin._id) { return res.status(400).send("An user with that login is already registered, type different login.")};

    const existingEmail = await User.findOne({"email": req.body.email});
    if(existingEmail && encoded.sub!=existingEmail._id) { return res.status(400).send("An user with that email is already registered!")};

    const { error } = validateDetails({login: req.body.login, email: req.body.email});
    if(error) {
        return res.status(400).send(error.details[0].message);
    };

    user.set({
        login: req.body.login,
        email: req.body.email
    });

    const crosswords = await Crossword.find()    

    try {
        await user.save()

        res.send("User updated!")
    } catch (err) {
        return res.status(500).send("Oops. Something goes wrong!")
    }

    for(let i =0; i<crosswords.length; i++) {
        if(crosswords[i].addedBy._id==id) {
            crosswords[i].set({
                addedBy: user,
                approvedBy: user
            })
           await crosswords[i].save()
        }

}
}

updatePassword = async (req, res) => {
    const encoded = jwt.decode(req.headers.token);
    const user = await User.findById(encoded.sub);

    const checkPassword = await bcrypt.compare(req.body.currentPassword, user.password);
    if(!checkPassword) { return res.status(400).send("Current password is not correct!")};

    if(req.body.newPassword!=req.body.confirmNewPassword) { return res.status(400).send("Passwords in 'New Password' and 'Confirm New Password' are not the same!")}

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.newPassword, salt);

    const { error } = validatePassword({password: req.body.newPassword, confirmPassword: req.body.confirmNewPassword});
    if(error) {
        return res.status(400).send(error.details[0].message);
    };

    user.set({
        password: hashedPassword
    });

    try {
        await user.save();
        res.send("Password updated successfully!");
    } catch (error) { res.status(500).send("Ooops. Something goes wrong! Try again later!"); }

}

appointAdmin = async (req, res) => {
    const user = await User.findById(req.body.userID);
    if(!user) { return res.status(404).send("There's no user!")}

    const encoded = jwt.decode(req.headers.token);
    const admin = await User.findById(encoded.sub);

    const checkPassword = await bcrypt.compare(req.body.password, admin.password);
    if(!checkPassword) { return res.status(400).send("Password is not correct!")};

    if(req.body.action==="add") {
        user.set({
            isAdmin: true
        })
        try {
            await user.save();
            res.send(`User ${user.login} appointed to an admin successfully`)
        } catch(err) { res.status(500).send("Oops. Something goes wrong! Try again later!")}
    }
    else if(req.body.action==="delete") {
        if(encoded.sub===req.body.userID) {
            return res.status(400).send('You could not delete yourself!');
        }
        user.set({
            isAdmin: false
        })
        try {
            await user.save();
            res.send(`${user.login} is not an admin now`)
        } catch(err) { res.status(500).send("Oops. Something goes wrong! Try again later!")}
    } else {
        return res.status(500).send("Oops.Something goes wrong!")
    }
    

    


}

module.exports = {
    getUser,
    getUserById,
    getUsers,
    getUsersByQuery,
    getAdmins,
    addUser,
    accountActivation,
    userLogin,
    resendActivation,
    resetPassword,
    passwordReminder,
    updateUser,
    updatePassword,
    appointAdmin
}
    
