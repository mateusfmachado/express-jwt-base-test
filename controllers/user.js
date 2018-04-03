var mongoose = require('mongoose');
var passport = require('passport');
var User = mongoose.model('User');

module.exports = {

	newUser: function(req,res,next){
        var user = new User();
        
        if(!req.body.email){
			return res.status(422).json({errors: {email: "não pode ficar vazio"}});
        }
        if(!req.body.password){
			return res.status(422).json({errors: {password: "não pode ficar vazio"}});
		}

        user.email = req.body.email;
        user.nome = req.body.nome;
		user.setPassword(req.body.password);

		user.save().then(function(){
			return res.json({user: user.toAuthJSON()});
		}).catch(next);
	},

	login: function(req,res,next){
		if(!req.body.user.email){
			return res.status(422).json({errors: {email: "não pode ficar vazio"}});
		}

		if(!req.body.user.password){
			return res.status(422).json({errors: {password: "não pode ficar vazio"}});
		}

		passport.authenticate('local', {session: false}, function(err, user, info){
			if(err){
				return next(err);
			}

			if(user){
				user.token = user.generateJWT();
				return res.json({user: user.toAuthJSON()});
			} else {
				return res.status(422).json(info);
			}
		})(req,res,next);

	},

	getUser: function(req,res,next){
		User.findById(req.payload.id).then(function(user){
			if(!user){
				return res.sendStatus(401);
			}

			return res.json({user: user.toAuthJSON()});
		}).catch(next);
	},

	updateUser: function(req,res,next){
		User.findById(req.payload.id).then(function(user){
			if(!user){
				return res.sendStatus(401);
            }
            
            if(typeof req.body.nome !== 'undefined'){
				user.nome = req.body.nome;
            }

			if(typeof req.body.email !== 'undefined'){
				user.email = req.body.email;
			}

			if(typeof req.body.password !== 'undefined'){
				user.setPassword(req.body.password);
			}

			return user.save().then(function(){
				return res.json({user: user.toAuthJSON()});
			});
		}).catch(next);
	},

	updatePassword: function(req,res,next){
		User.findById(req.payload.id).then(function(user){
			if(!user){
				return res.sendStatus(401);
			}

			if(!req.body.newPassword || !req.body.oldPassword){
				return res.sendStatus(422);
			}

			if(user.validPassword(req.body.oldPassword)){
				user.setPassword(req.body.newPassword);
				return user.save().then(function(){
					return res.json({user: user.toAuthJSON()});
				});
			}

			return res.sendStatus(403);
		}).catch(next);
	}

};