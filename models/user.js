var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');
var secret = require('../config').secret;

var UserSchema = new mongoose.Schema({
	email: {
		type: String, 
		lowercase: true, 
		unique: true,
		required: [true, "não pode ficar vazio."], 
		match: [/\S+@\S+\.\S+/, 'é inválido.'], 
		index: true
    },
    nome: {
        type: String
	},
	role: {
		type: Array,
		default: ["user"]
    },
    recovery: {
        type: {
            token: String,
            expira: Date
        }
    },
	hash: String,
	salt: String
}, {
	timestamps: true
});

UserSchema.plugin(uniqueValidator, {message: 'já está sendo utilizado.'});

UserSchema.methods.setPassword = function(password){
	this.salt = crypto.randomBytes(16).toString('hex');
	this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
};

UserSchema.methods.validPassword = function(password){
	var hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
	return this.hash === hash;
};

UserSchema.methods.generateJWT = function(){
	var today = new Date();
	var exp = new Date(today);

	exp.setDate(today.getDate() + 60);

	return 'Token '+jwt.sign({
		id: this._id,
		email: this.email,
		exp: parseInt(exp.getTime() / 1000, 10)
	}, secret);
};

UserSchema.methods.getData = function(){
	return {
		_id: this._id,
		email: this.email,
		telefone: this.telefone,
		nome: this.nome,
		role: this.role,
		hasTouchId: this.hasTouchId
	};
};

UserSchema.methods.toAuthJSON = function(){
	return {
		_id: this._id,
		email: this.email,
		nome: this.nome,
		role: this.role,
		devices: this.devices,
		hasTouchId: this.hasTouchId,
		token: this.generateJWT()
	};
};

// RECOVERY
UserSchema.methods.createRecoveryPassword = function(){
	this.recovery = {};
	this.recovery.token = crypto.randomBytes(16).toString('hex');
	this.recovery.expira = new Date( new Date().getTime() + 24*60*60*1000 );
	return this.recovery;
};

UserSchema.methods.doneRecoveryPassword = function(){
	this.recovery = {
		token: null,
		expira: null
	};
	return this.recovery;
};

mongoose.model('User', UserSchema);