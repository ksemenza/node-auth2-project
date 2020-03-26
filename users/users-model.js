module.exports = {
    addUser,
    findUserById,
    findUserByUsername,
    findUsers, 
    findUsersByDepartment,
    removeUser    
}

const db = require('../db-config');

function addUser(newUser) {
    return db('users')
        .insert(newUser)
        .then(ids => {
            return findUserById(ids[0]);
        });
}

function findUserById(user_id) {
    return db('users')
        .where({ id: user_id })
        .first();
}

function findUserByUsername(submitted_username) {
    return db('users')
        .where({ username: submitted_username})
        .first();
}

function findUsers() {
    return db('users')
        .select('id', 'username', 'department');
}

function findUsersByDepartment(department) {
    return db('users')
        .where({'users.department': department})
        .select('users.id', 'users.username', 'users.department')
}

function removeUser(user_id) {
    return db('users')
        .where({ id: user_id })
        .del();
}