var mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Setup schema
var userSchema = Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    fullName: String,
    // gender: String,
    // phone: String,
    // create_date: {
    //     type: Date,
    //     default: Date.now
    // },

});

const User = mongoose.model('User', userSchema);

module.exports = {

    save: (entity, passHash) => {    
            
        var user = new User({
            email : entity.email,
            password: passHash,
            fullName: entity.fullName,
        });
        
        return user.save();    
    },

    findOneEmail: (email) => {
        return User.findOne({email: email}).exec();
    }
}


