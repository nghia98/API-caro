var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');
const passport = require('passport');
var bcrypt = require('bcrypt');

const User = require('../models/user');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// POST register
router.post('/register',function (req, res) {
  var entity = req.body;

  User.findOneEmail(entity.email)
  .then(user => {
    if (user){
      return res.json({error: 'Email alreadly exists'});
    }

    bcrypt.hash(entity.password, 5, (err, passHash) => {
      if(err)
        return res.json({error: err});
      
      User.save(entity, passHash)
      .then(result => {

        const info = {
          id: result.id,
          email: result.email,
          fullName: result.fullName 
        }

        return res.json({
          message: 'Created a new account',
          user : info
        })
      })
      
      .catch(err => {
        return res.json({error: err});
      });
    });
  })

  .catch(err => {
    return res.json({error: err});
  });
});


/* POST login. */
router.post('/login', function (req, res, next) {

  passport.authenticate('local', {session: false}, (err, user, info) => {

      if (err || !user) {
          return res.status(400).json({
              message: info ? info.message : 'Đăng nhập thất bại !',
              user   : user
          });
      }

      req.login(user, {session: false}, (err) => {
        if (err) {
            res.send('err');
        }

        const info = {
            id: user.id,
            email: user.email,
            fullName: user.fullName 
        }

        const token = jwt.sign(info, 'dang-ngoc-nghia', /*{expiresIn: '5s'}*/);

        return res.json({message: info.message,user: info, token});
      });
  })
  (req, res);

});


module.exports = router;
