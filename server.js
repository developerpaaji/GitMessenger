const express = require('express');
const request = require('request');
const sock = require('socket.io');
const io = sock(http);
const cheerio = require('cheerio');
const async = require('async');
const fs = require('fs');
const session = require('express-session');
const passport = require('passport');
const crypto = require('crypto-js');
const redis = require('redis');

const http = require('http').Server(app);
var redisStore = require('connect-redis')(session);

const app = express();
require('dotenv').config()
const firebase = require('./firebase/firebase.js');

const PORT = process.env.PORT || 5050;
const hostname = 'localhost';
const GitHubStrategy = require('passport-github').Strategy;

app.use(session({
    secret: 's3cr3t',
    saveUninitialized: true,
    resave: true,
  }));

  passport.serializeUser((user, done) => {
    done(null, user);
  });
  
  passport.deserializeUser((user, done) => {
    done(null, user);
  });
passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_SECRET_ID,
    callbackURL: "https://gitmessenger.herokuapp.com/auth/github/callback",
    passReqToCallback : true,
  },
  function(req, accessToken, refreshToken, profile, done) {
    var user = new User(
	    profile.displayName,
	    profile.username,
	    profile['_json'].avatar_url,
	    profile["_json"].html_url,
	    profile["_json"].bio
    );
    firebase.registerUser(user).catch(err => console.error); // If you don't need .then() you can just add an .catch
    return done(null,user) 
  }
));
app.use(passport.initialize());
app.use(passport.session());

app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ limit: '2mb', extended:true }));
app.use('/', express.static('public'));
app.set('view engine','hbs');

firebase.initializeApp();

const headers = { 
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36'
};
const base = 'https://github.com/';

class User
{
   constructor(name, username, profilePic, profileUrl, description='', lastSeen = 1548195506978)
   {
         this.name = name;
         this.username = username;
         this.profilePic = profilePic;
         this.profileUrl = profileUrl;
         this.description = description;
         this.lastSeen = lastSeen;
   }
}
class Message
{    
    constructor(to, type, content, from)
    {
          this.to = to;
          this.type = type;
          this.content = content;
          this.from = from;
    }    
}

const REGISTER = 'register', USERDATA = 'userdata', NULL = 'null'; // You really don't need a variable declared as NULL. Use primitive null type.
var activeUsers = {};
var userDetails = {}
var socketId = {};
var socket = null;
io.on('connection', socket => {
  
    const id = socket.id; // id isn't been changed, use const instead.
    socket.on('initial', data => {
        if(!data)
        {
            return;
        }  
        userDetails[data['username']] = data;
        activeUsers[data['username']] = id;
        socketId[id] = data['username'];
        socket.to(id).emit('key', JSON.stringify({ key: crypto.SHA256(data["username"]) }));
        socket.broadcast.emit('connected', JSON.stringify({ username: data["username"] }));
    }); 
    
    socket.on("chats",(data)=>{
        console.log('Loading Users');
        firebase.getChats(data)
                .then((chats)=>{
                    socket.emit("chats",chats);
                })
                .catch((err)=>{
                    console.log(err);
                })

    });
    socket.on("send",(message)=>{
        {
            var receiverId=message["to"];
            if(activeUsers[receiverId])
                {
                    console.log(`Receiver id-${receiverId}->id ${activeUsers[receiverId]}`);
                    message.key=null;
                    message.fromDetails=userDetails[message.from];           
                    socket.to(activeUsers[receiverId]).emit("receive",JSON.stringify(message));
                }
        }
    });
    socket.on("checkActive",(data)=>{
        var from=data["from"];
        var to=data["to"];
        //to not working
        socket.emit("isActive",JSON.stringify({result:activeUsers[to]!=null,username:to}));
    });
    socket.on("deleteMessage",(data)=>{
        firebase.deleteMessage(data);
    })
    socket.on("deleteAll",(data)=>{
        firebase.deleteAll(data);
    }) 
    socket.on("disconnect",()=>{
        if(socketId[id])
        firebase.storeLastSeen(socketId[id],Date.now());
        activeUsers[socketId[id]]=null;
        socket.broadcast.emit("disconnected",JSON.stringify({username:socketId[id]}));
    });
})
const nonce=1001;
//Github Login
app.get('/auth/github',passport.authenticate('github', { scope: [ 'user:email' ] }))
app.get("/auth/github/callback",passport.authenticate('github', { scope: [ 'user:email' ] }),(req,res,next)=>{
    req.session.user = req.user;
	// Redirect to budgeteer after the session has been set
	res.redirect("/chats");
})
//Get Messages
app.get('/messages/:to',(req,res)=>{
   var to=req.params.to;
   if(to&&req.user)
   {
        firebase.getPersonalChats(req.user.username,to)
        .then((chats)=>{
            res.status(200).send(chats);   
        })
   } 
   else{
        res.status(403).send([]);   
   }
})

//Post message
app.post('/send',(req,res)=>{
   var message=req.body;
   if(req.user&&req.user.username==message.from&&message.from!=message.to)
   {
        message.key=null;
        firebase.storeMessage(message);
        res.sendStatus(200);
   }
   else 
   {
        res.sendStatus(403);
   }
});
//Logout
app.get('/logout',(req,res)=>{
    req.session.destroy(function (err) {
        res.redirect('/'); //Inside a callback… bulletproof!
      });
})
//
app.get('/search/:query',(req,res)=>{
    var query=req.params.query;
    try {
        var url=`https://api.github.com/search/users?q=${query}`;
        request.get({uri:url,headers:headers},(err,response,body)=>{
            try {
               var json=JSON.parse(body);
               var items=json["items"];
               var users=items.map((item)=>{
                   var user=new User(item["login"],item["login"],item["avatar_url"],item["html_url"]);
                   return user;
               });    
               res.send(JSON.stringify(JSON.stringify(users)));
               return;
            } 
            catch (error) {
                res.send(JSON.stringify([]));
                return;
            }
        })
    } catch (error) {
        res.send(JSON.stringify([]));
    }
})
app.post('/register',(req,res)=>{
    var username=req.body.username;
    var url=base+username;
        request.get({uri:url,headers:headers},(err,resp,body)=>{
            try {
                var $=cheerio.load(body);
                var title=$('title').text();
                var name=title.substring(title.indexOf('(')+1,title.indexOf(')'));
                if(name=="")
                {
                    throw "No User Exists";
                }
                var profilePic=$('meta[property="og:image"]').attr('content');
                var description=$('meta[name="description"]').attr('content');
                var profileUrl=url;
                var user=new User(name,username,profilePic,profileUrl,description);
                user.key=crypto.SHA256(nonce,user.username);
                firebase.registerUser(user).then((data)=>{
                    res.send(JSON.stringify(JSON.stringify(user)));
                });

            } catch (error) {
              res.send(null);
            } 
        })
})
app.get('/',(req,res)=>{
    if(!req.user)
    res.render("index")
    else{
        res.redirect('/chats');
    }
})
app.get('/chats',(req,res)=>{
    var user=req.user;
    if(!user)
    {
      res.redirect('/')
      return;
    }
    user.key=crypto.SHA256(nonce,user.username);
    user.stringify=JSON.stringify(user);
    res.render('parrot',{user:user});
})
app.get('/chats/:user_id',(req,res)=>{
    var user=req.user;
    if(!user)
    {
      res.redirect('/')
      return;

    }
    user.stringify=JSON.stringify(user);
    user.key=crypto.SHA256(nonce,user.username);
    res.render('parrot',{key:req.params.user_id,user:user});
})
app.get('/info/:user_id',(req,res)=>{
    res.render('parrot',{key:req.params.user_id});
})
app.get('/shared_media',(req,res)=>{
   var from=req.query.from;
   var to=req.query.to;
   if(to==undefined||from==undefined)
   {
       res.render('media.hbs',{images: []});
       return;
   }
   firebase.getSharedMedia(firebase.toPath(from,to)).then((data)=>{
    res.render('media.hbs',{images: data});

   })
})
app.get("/metadata",(req,res)=>{
    var url=req.query.url;
    request.get({uri:url,headers:headers},(err,resp,body)=>{
        try {
            var $=cheerio.load(body);
            var title=$('meta[property="og:title"]').attr('content');        
            var image=$('meta[property="og:image"]').attr('content');
            var description=$('meta[property="og:description"]').attr('content');
            if(!title||!image||!description)
            {
                return;
            }
            var website={title:title,image:image,description:description,url:url};
            res.send(website)
        } catch (error) {
            res.send({});  
        } 
    })
})
app.get('/images/:imageId',(req,res)=>{

    firebase.getImage(req.params.imageId)
            .then((body)=>{
                var img = new Buffer(body.split(',')[1], 'base64');
                res.writeHead(200, {
                'Content-Type': 'image/png',
                'Content-Length': img.length 
                });
                res.end(img);})
})
function toArrayBuffer(buf) {
    var ab = new ArrayBuffer(buf.length);
    var view = new Uint8Array(ab);
    for (var i = 0; i < buf.length; ++i) {
        view[i] = buf[i];
    }
    return ab;
}



http.listen(PORT,()=>{
    console.log(`Listening on ${PORT}`);
})
