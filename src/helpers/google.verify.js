const token_id = '128905102745-sg1o74sf0veu04ganlessh92ggli3b3m.apps.googleusercontent.com';
// const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_ID);

const verify = async(token) => {
    //console.log(token);
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: token_id,
    });
    const payload = ticket.getPayload();
    const { name, email, picture } = payload
    return { name, email, picture }
}

module.exports = { verify };