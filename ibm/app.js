
var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , userProvider = require('./usercontroller').userProvider;

var app = express();


  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.set('view options', {layout: false});
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(require('stylus').middleware(__dirname + '/public'));
  app.use(express.static(path.join(__dirname, 'public')));


app.configure('development', function(){
  app.use(express.errorHandler());
});

var userProvider= new userProvider('localhost', 27017);





app.get('/', function(req, res){
  userProvider.findAll(function(error, emps){
      res.render('index', {
            title: 'users',
            users:emps
        });
  });
});

app.get('/user/new', function(req, res) {
    res.render('user_new', {
        title: 'New user'
    });
});


app.post('/user/new', function(req, res){
    userProvider.save({
        title: req.param('title'),
        name: req.param('name')
    }, function( error, docs) {
        res.redirect('/')
    });
});


app.get('/user/:id/edit', function(req, res) {
	userProvider.findById(req.param('id'), function(error, user) {
		res.render('user_edit',
		{ 
			title: user.title,
			user: user
		});
	});
});

app.post('/user/:id/edit', function(req, res) {
	userProvider.update(req.param('id'),{
		title: req.param('title'),
		name: req.param('name')
	}, function(error, docs) {
		res.redirect('/')
	});
});
//app.post('/user/login',function(req, res)){
//    userProvider.authentic(req.param('name'){
//       if(user)
//    }, function(error, docs) {
//        res.redirect('/')
//    });
//});

app.post('/user/:id/delete', function(req, res) {
	userProvider.delete(req.param('id'), function(error, docs) {
		res.redirect('/')
	});
});

app.listen(process.env.PORT || 3000);
