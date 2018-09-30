const jwt = require('jsonwebtoken')
const { JWT_SECRET } = process.env

module.exports = async function(request) {
    try {
        const header = request.get('Authentication')
        const token = header.match(/^Bearer\s(\S+)$/i)[1]

        return await jwt.verify(token, JWT_SECRET)
    } catch (err) {
        return null
    }
}
