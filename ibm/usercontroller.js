var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;

userProvider = function(host, port) {
  this.db= new Db('node-mongo-user', new Server(host, port, {w: 1}));
  this.db.open(function(){});
};


userProvider.prototype.getCollection= function(callback) {
  this.db.collection('users', function(error, user_collection) {
    if( error ) callback(error);
    else callback(null, user_collection);
  });
};

userProvider.prototype.findAll = function(callback) {
    this.getCollection(function(error, user_collection) {
      if( error ) callback(error)
      else {
        user_collection.find().toArray(function(error, results) {
          if( error ) callback(error)
          else callback(null, results)
        });
      }
    });
};


userProvider.prototype.findById = function(id, callback) {
    this.getCollection(function(error, user_collection) {
      if( error ) callback(error)
      else {
        user_collection.findOne({uid: user_collection.db.bson_serializer.ObjectID.createFromHexString(id)}, function(error, result) {
          if( error ) callback(error)
          else callback(null, result)
        });
      }
    });
};



userProvider.prototype.save = function(users, callback) {
    this.getCollection(function(error, user_collection) {
      if( error ) callback(error)
      else {
        if( typeof(users.length)=="undefined")
          users = [users];

        for( var i =0;i< users.length;i++ ) {
          user = users[i];
          user.created_at = new Date();
        }

        user_collection.insert(users, function() {
          callback(null, users);
        });
      }
    });
};
//userProvider.prototype.authentic = function(username, callback) {
//  this.getCollection(function(error, user_collection) {
//    if(error) callback(error);
//    else {
//      user_collection.find(
//          {username: user_collection.ObjectID(username)},
//          function(error, user){
//            if(error) callback(error);
//            else callback(null, user)
//          });
//    }
//  });
//};


userProvider.prototype.update = function(userId, users, callback) {
    this.getCollection(function(error, user_collection) {
      if( error ) callback(error);
      else {
        user_collection.update(
					{uid: user_collection.db.bson_serializer.ObjectID.createFromHexString(userId)},
					users,
					function(error, users) {
						if(error) callback(error);
						else callback(null, users)
					});
      }
    });
};


userProvider.prototype.delete = function(userId, callback) {
	this.getCollection(function(error, user_collection) {
		if(error) callback(error);
		else {
			user_collection.remove(
				{id: user_collection.db.bson_serializer.ObjectID.createFromHexString(userId)},
				function(error, user){
					if(error) callback(error);
					else callback(null, user)
				});
			}
	});
};

exports.userProvider = userProvider;