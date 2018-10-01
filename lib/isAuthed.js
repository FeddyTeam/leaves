const Roles = {
    ADMIN: 'admin',
    EDITOR: 'editor',
}

module.exports = (auth, role) => {
    const isLoggedIn = auth && auth.id

    if (!role) {
        return isLoggedIn
    }

    return auth.roles && auth.roles[role]
}

module.exports.Roles = Roles
