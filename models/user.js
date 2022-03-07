const mongoose = require("mongoose");
const bcrypt = require("bcryptjs")

//todo: .env reference

const userSchema = mongoose.Schema({
    username: { type: String, required: true, mingLength: 5, maxLength: 25},
    email: { type: String, required: true, mingLength: 5},
    password: { type: String, required: true, minLength: 5, maxLength: 250},
    role: { 
        type: String,
        required: true,
        enum: ["Developer", "Submiter", "Team leader", "Admin"]
    },
});

// HANDLING CRYPTED PASSWORDS 
userSchema.pre("save", function(done) {
    const user = this;

    // if user is edited the hashed password is not, again, hashed
    if (!user.isModified("password")) {
        return done()
    }
    // hash the password value
    const saltFactor = parseInt(process.env.SALT_FACTOR);
    bcrypt.genSalt(saltFactor, (err, salt) => {
        if (err) { return done(err) }
        bcrypt.hash(user.password, salt, (err, hashedPassword) => {
            if (err) { return done(err) }
            user.password = hashedPassword;
            done();
        })
    })
})

userSchema.methods.checkPassword = function (passGuess) {
    return bcrypt.compare(passGuess, this.password)
};

// EXPORT MODEL OBJECT
const User = mongoose.model("User", userSchema);
module.exports = User;