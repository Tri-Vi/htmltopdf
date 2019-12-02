'use strict'
var User = require('../data/User.js');

class UserController {
  getAllUser(){
    return User;
  }

  getUserById(userId){
    var found = User.find(function(user){
      return user["id"] == parseInt(userId);
    });
    if(found){
      return found;
    } else {
      let errMsg = "Unable to find User with user id " + userId;
      return errMsg
    }
  }

  updateUser(userId, newUserInfo){
    
  }

  addUser(userInfo){
  }

  deleteUser(userId){
    let msg;
    var found = User.findIndex(function(user){
      return user["id"] == parseInt(userId);
    });
    if(found > -1){
      User.splice(found, 1);
      msg = "Delete successfully";
      return msg;
    } else {
      msg = "User with user id " + userId + " does not exist";
      return errMsg;
    }
  }
}

module.exports = new UserController();