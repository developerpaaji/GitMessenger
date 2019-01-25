const admin = require("firebase-admin");
const async=require('async');
const fs=require('fs');
const crypto = require('crypto-js')
const parrotPrivateKey={
    your_keys
  } 
const parrotAdmin={
      credential: admin.credential.cert(parrotPrivateKey),
      databaseURL: "your_firebase_url",
    };  

var parrotDatabaseAdmin=null;
var database=null;
function initializeApp()
{
    parrotDatabaseAdmin=admin.initializeApp(parrotAdmin,"parrotAdmin")
    database=parrotDatabaseAdmin.database().ref();
}  
module.exports.initializeApp=initializeApp;
const USERS="users";

function toPath(u1,u2)
{
    if(u1.localeCompare(u2)<=0)
    {
       return u1+"_"+u2;
    }
    else{
       return u2+"_"+u1;

    }
}
module.exports.toPath=toPath;
function getToday()
{
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!
    var yyyy = today.getFullYear();

    if(dd<10) {
        dd = '0'+dd
    } 

    if(mm<10) {
        mm = '0'+mm
    } 

    today = dd + '-' + mm + '-' + yyyy;
    return today;
}
function storeLastSeen(username,time)
{
    console.log(username);
  database.child("users").child(username).child("lastSeen").set(time);
}
module.exports.storeLastSeen=storeLastSeen;
function storeMessage(message)
{
    //TODO
    if(message["type"]=="text")
    {
       return storeTextMessage(message);
    }
    else if(message["type"]=="image")
    {
       return storeImage(message);
    }
    else if(message["type"].startsWith("language"))
    {
       return storeTextMessage(message);
    }
}
module.exports.storeMessage=storeMessage;
function storeRecentChat(message) 
{
    database.child('chats').child(message.from).child(message.to).set({recentChat:message});
    database.child('chats').child(message.to).child(message.from).set({recentChat:message});
}
function storeTextMessage(message)
{
    return new Promise((resolve,reject)=>{
        var path=toPath(message.to,message.from)
        var today=getToday();
        var priority=Date.now();
        storeRecentChat(message);
        database.child("messages").child(path).child(message.id).setWithPriority(message,-priority,(err)=>{
            if(err)
            {
                reject(err);
            }
            else
            {
              resolve(200);
            }
        })
    });
}
module.exports.storeTextMessage=storeTextMessage;
function storeImage(message)
{
  return new Promise((resolve,reject)=>{
    var id=crypto.SHA256(message.content).toString();
    try {
     database.child('images').child(id).set(message.content,(err)=>{
         if(!err)
         {
             message.content='/images/'+id;        
             database.child("imagemessages").child(toPath(message.from,message.to)).child(id).setWithPriority(message.content,-Date.now(),(err)=>{
                if(err)
                {
                }
                else
                {
                }
            })  
             return storeTextMessage(message);
         }
         else{
             reject(err);
             console.log(err);
         }
     });
    } catch (error) {
        reject(error);
        console.log(error);
      }
  });
}
module.exports.storeImage=storeImage;
function getImage(imageId)
{
    return new Promise((resolve,reject)=>{
        database.child('images').child(imageId).once("value",(snapshot)=>{
            if(snapshot==null)
            {
                reject(new Error("err 198"));
            }
            var imageURL = snapshot.val();   
            resolve(imageURL);   
        })
    })
}
module.exports.getImage=getImage;

function getChats(data)
{
   var username=data.username;
   return new Promise((resolve,reject)=>{
    database.child('chats').child(username).limitToFirst(25).once("value",(snapshot)=>{
        var friends=[];   
        if(!snapshot)
        {
            reject(new Error("Data not loaded error at 107"));
        }

        snapshot.forEach((child)=>{
               var friendname=child.key;
               var recentChat=child.val();
               var friend={friendname:friendname,recentChat:recentChat.recentChat};
               if(data["key"]&&data["key"]==friendname)
               friends.splice(0,0,friend);
               else
               {
                   friends.push(friend);
               }
           });   

        var count=0;
        var details=[];
        async.map(friends,(friend)=>{
           
          database.child('users').child(friend.friendname).once("value",(snap)=>{
            count++; 
            var user=snap.val();
            if(user==null)
            {
                return;
            }
            user.recentChat=friend.recentChat;
            details.push(user);
            if(count>=friends.length)
            {
                resolve(JSON.stringify(details));
            }
          })
        },(err,result)=>{
        });   
       })
   })

}
module.exports.getChats=getChats;
function getPersonalChats(from,to)
{
    return new Promise((resolve,reject)=>{
        var path=toPath(to,from)
        database.child('messages').child(path).once("value",(snapshot)=>{
            if(snapshot==null)
            {
                reject(new Error("Data not loaded"));
            }
            var chats=[]; 
            database.child("users").child(to).child("lastSeen").once("value",(timeSnapshot)=>{
                var lastSeen=0;
                if(timeSnapshot!=null)
                {
                   lastSeen=timeSnapshot.val();
                }
                snapshot.forEach((child)=>{
                    var chat=child.val();
                    chat.seen=false;

                    if(chat.id<=lastSeen)
                    {
                        chat.seen=true;
                    }
                 chats.push(chat);
                 })
                 resolve(JSON.stringify(chats));

            })
        });
    })
}
module.exports.getPersonalChats=getPersonalChats;
function registerUser(user)
{
    return new Promise((resolve,reject)=>{
        database.child(USERS).child(user.username).once("value",(snapshot)=>{
            if(!snapshot||snapshot.numChildren()==0)
            {
                var text=`Welcome aboard ${user.name}. GitMessenger is chat app for developers where you can text,share images,code😊 and much more!. Fork this app at https://github.com/singhbhavneet/GitMessenger/. Hope you will have an good experience.`
                var message=new Message(user.username,"text",text,"singhbhavneet");
                message.id=Date.now();
                var imageMessage=new Message(user.username,"image","/images/823666f7df43f277ae1a4e1f4f6012ec1b5833dd208070b009255c5348e21f3f","singhbhavneet")
                imageMessage.id=Date.now()+21;    
                storeTextMessage(message);   
                storeTextMessage(imageMessage);
                database.child(USERS).child(user.username).set(user,(e)=>{
                    if(e)
                    reject(e);
                    else
                    resolve(user.username);  
                });
             
            }
            else{
                resolve(user.username);  
            }

        })
        
    });
}
function getSharedMedia(path){
   var cleanPath=path.replace('.',','); 
   return new Promise((resolve,reject)=>{
       database.child('imagemessages').child(cleanPath).once("value",(snapshot)=>{
        var links=[];
        if(snapshot&&!snapshot.numChildren()==0)
        {
           snapshot.forEach((child)=>{
               var link=child.val();
               links.push(link);
           })
        }
        resolve(links);
       })
   });
}
module.exports.getSharedMedia=getSharedMedia;
function deleteMessage(message)
{
    if(message.id!=undefined)
   database.child('messages').child(toPath(message.from,message.to)).child(message.id).set(null);
}
module.exports.deleteMessage=deleteMessage;
function deleteAll(message)
{
    database.child('chats').child(message.from).child(message.to).set(null);
 }
module.exports.deleteAll=deleteAll;
class Message
{    
    constructor(to,type,content,from,id)
    {
          this.to=to;
          this.type=type;
          this.content=content;
          this.from=from;
          this.id=id;
    }    
}
class User
{
   constructor(name,username,profilePic,profileUrl)
   {
         this.name=name;
         this.username=username;
         this.profilePic=profilePic;
         this.profileUrl=profileUrl;
         this.isActive=false;
   }
}
module.exports.registerUser=registerUser;