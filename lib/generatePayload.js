module.exports = user => {
    return {
        id: user.id || user._id,
        roles: user.roles || {},
    }
}
