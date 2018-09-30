const Roles = {
    ADMIN: 'admin',
    EDITOR: 'editor',
}

module.exports = auth => {

    if (auth && auth.id) {
        return true
    }

    return false
}

module.exports.Roles = Roles
