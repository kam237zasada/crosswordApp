const jwt = require('jsonwebtoken');
const { TOKEN_SECRET } = require('../config/index');


generateToken = (req, user) => {
    const ACCESS_TOKEN = jwt.sign({ 
        sub: user._id, 
        rol: user.isAdmin, 
        type: 'ACCESS_TOKEN' 
    }, 
    TOKEN_SECRET, { 
        expiresIn: 864000000
    }); 

    return ACCESS_TOKEN
}

verifyUser = (req, res, next) => {
    let token = req.headers.token;
    if(!token) { token = req.body.token};

    if(!token) {
        return res.status(401).send('Not authorized!')
    }

    const decoded = jwt.decode(token);
    if(!decoded || decoded.sub!==req.params.id) {
        return res.status(401).send("Don't test me Mr.Hacker :) ")
    }

    jwt.verify(token, TOKEN_SECRET, function(err) {
        if(err) { return res.status(401).send('Wrong authorization data!')}
    })

    next();
}

tokenVerifyAdmin = (req, res, next) => {
    let token = req.headers.token
    if(!token) { token = req.body.token};
    if (!token) { 
        return res.status(401).send('Not authorized!'); 
    } 
    jwt.verify(token, TOKEN_SECRET, function(err) { 
        if (err) { 
            return res.status(401).send("Wrong authorization!")
        } 
    const decoded = jwt.decode(token);
    if(!decoded.rol) {
        return res.status(401).send("No permissions!")
    }
        next();
});
}

module.exports = {
    generateToken,
    verifyUser,
    tokenVerifyAdmin
}


