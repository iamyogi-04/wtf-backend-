const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    uid:{type: 'string',unique: true},
    firstname:{type: 'string', required: true},
    lastname:{type: 'string', required: true},
    email:{type: 'string', required: true ,unique: true},
    password:{type: 'string', required: true },
    mobile:{type:'string', required: true  },
    role:{type:'string', required: true},
    status:{type:'string', required: true},
})

const UserDb = mongoose.model('UserDb', UserSchema);

module.exports = UserDb;