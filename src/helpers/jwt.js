import jwt from 'jsonwebtoken'

const JWTgenerate = (uid) => {
    return new Promise((resolve, reject) => {
        let payload = {
            uid
        }
        jwt.sign(payload, process.env.JWT_SECRET_KEY, {
            expiresIn: process.env.TOKEN_TIME_VALIDATE
        }, (err, token) => {
            if (err) {
                console.log(err)
                reject('No se generó JWT')
            } else {
                resolve(token);
            }

        })
    })
}

module.exports = {JWTgenerate}