
var currentUser=null;    

var activeUser=null;
var activeClass='active-user';
var activeUserElement=null;
    
var socket=io.connect();

function deleteActiveUser()
{
        activeUser=null;
        activeUserElement=null;
}
    
var main={};            
function onClickUser()
{

}
$(()=>{
    if(userJson)
    {
        currentUser=userJson;
        localStorage['currentUser']=JSON.stringify(currentUser);
    }
    else if(localStorage['currentUser']!=null)
        currentUser=JSON.parse(localStorage['currentUser']);
    else
    {
        window.location.href = "/";   
    }
    socket.emit("initial",currentUser);

    // $(window).resize(()=>{
    //  console.log(window.innerWidth); 
    //  console.log(window.outerWidth);   
    // })
    var mainBody=$('#main-body');
    
    var messageExports= buildMessages();
    var userBodyExports= buildUserBody();
    var currentIndex=0;
    var stack=[];
    const MAXWIDTH=720.0;
    var desktop=window.innerWidth<MAXWIDTH;
    //Stack class
    class Stack{
        constructor(mainBody){
            this.mainBody=mainBody;
            this.arr=[];
        }
        get last (){
          if(this.arr.length>0)
          {
              return this.arr[this.arr.length-1];
          }
          else
          {
              return $("<p/>");
          }
        }
        get length(){
            return this.arr.length;
        }
        pop()
        {
            var body=this.arr.pop();
            body.detach();
            this.last.appendTo(this.mainBody);
        }
        push(elm)
        {
            this.last.detach();
            this.arr.push(elm);

            elm.appendTo(this.mainBody);
        }
    }
    var stack=new Stack(mainBody);
    window.onpopstate=function () {

        {
            this.console.log(true)
            stack.pop();
            
        }
      }

    function changeReceiver(activeUser)
    {
    
        if(!desktop&&window.innerWidth<MAXWIDTH)
        {
        window.history.pushState({page: currentIndex}, 'Parrot', `/chats/`+activeUser.username);

            console.log(true)
            stack.push(messageExports.body);
            
        }
       messageExports.changeReceiver(activeUser);
       userBodyExports.changeReceiver(activeUser);
       $.post('/register',{username:activeUser.username});
       socket.emit("checkActive",{from:currentUser.username,to:activeUser.username});
       /**/
       messageExports.startLoadingMessages();
    }

    function getInfo()
    {
        if(!desktop&&window.innerWidth<MAXWIDTH)
        {
        window.history.pushState({page: currentIndex}, 'Parrot', `/info/`+activeUser.username);
        stack.push(userBodyExports.body);  
        }
    } 
    var messageAlert=$('#msg-alert').first();
    function alert(alertMessage,show)
    {
        if(show)
        {
            messageAlert.find('#alert-msg').text(alertMessage);
            messageAlert.css("display","block").fadeIn();
        }
        else{
           messageAlert.fadeOut("fast","swing",()=>{
               messageAlert.css("display","none");
           }) 
        }
        
    var alertClose=$("#alert-close");
    alertClose.click(()=>
        {
            alert("",false);
        }
    )
    }
    main.alert=alert;
    main.changeReceiver=changeReceiver;
    main.getInfo=getInfo;
    var userListExports=buildUsersList();  
    var activeUsers={};
    var inactiveUsers={};
    
      // Finds all elements with `emojiable_selector` and converts them to rich emoji input fields
      // You may want to delay this step if you have dynamically created input fields that appear later in the loading process
      // It can be called as many times as necessary; previously converted input fields will not be converted again
    function convertToDesktop()
    {
        
        userListExports.body.addClass('col-3');
        messageExports.body.addClass('col-6');
        userBodyExports.body.addClass('col-3');
        userListExports.body.appendTo(mainBody);
        messageExports.body.appendTo(mainBody);
        userBodyExports.body.appendTo(mainBody);
    }
    function convertToMobile()
    {
        userListExports.body.removeClass('col-3');
        messageExports.body.removeClass('col-6');
        userBodyExports.body.removeClass('col-3');
        
        userListExports.body.detach();
        userListExports.body.addClass('w-100');
        messageExports.body.detach();
        messageExports.body.addClass('w-100');
        userBodyExports.body.detach();
        userBodyExports.body.addClass('w-100');
        stack.push(userListExports.body);
    }

    if(desktop)
        {
            desktop=false;   
            convertToMobile();
        }
        else if(!desktop){
            desktop=true;   
            convertToDesktop();
        }
    $(window).resize(()=>{
        if(window.innerWidth<MAXWIDTH&&desktop)
        {
            desktop=false;   
            convertToMobile();
        }
        else if(window.innerWidth>MAXWIDTH&&!desktop){
            desktop=true;   
            convertToDesktop();
        }
    })
  //show Toast
  function showToast(message)
  {
      if(message.fromDetails==undefined||message.fromDetails.profilePic==undefined||message.type=="typing"||message.type=="notTyping")
      {
          return;
      }
      var content="";
      if(message.type=="text")
      {
          content=message.content;
      }
      else
      {
          content="Sent you "+message.type+" .";
      }
      var toast=$(`<div class="toast"  role="alert" aria-live="assertive" data-delay="1000" aria-atomic="true">
      <div class="toast-header">
        <img src=${message.fromDetails.profilePic} class="rounded mr-2" style="width:15pt;height:15pt" alt="...">
        <strong class="mr-auto">${message.fromDetails.name}</strong>
        <small class="text-muted">just now</small>
        <button type="button" class="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="toast-body">
      ${content}
      </div>
    </div>`);
    
    $('#toastBody').append(toast);
    toast.on('hidden.bs.toast', function () {
        toast.detach()
      })
    toast.toast('show');
  }
  
   // Socket Interface///////////////////////////////////////////////////////////////////////////////////////////////////////////////
   socket.on('connection', function(socket){
    console.log('a user connected');
    console.log(socket.id);
    });
   socket.on("isActive",(data)=>{
    var user=JSON.parse(data);
    var username=user["username"];
    var result=user["result"];
    activeUsers[username]=result==true;
    activeUser.isActive=activeUsers[username];
    if(result&&activeUser.username==username)
    {
      messageExports.changeReceiver(activeUser);       
     }
    });

    socket.on("connected",(data)=>{
        var user=JSON.parse(data);
        var username=user["username"];
        console.log(username)
        activeUsers[username]=true;
        if(activeUser&&activeUser.username==username)
        {
        activeUser.isActive=activeUsers[username];    

            messageExports.changeReceiver(activeUser);         
        }
    });
    socket.on("disconnected",(data)=>{
        var user=JSON.parse(data);
        activeUsers[user.username]=false;
       
        if(activeUser&&user.username==activeUser.username)
        {
            activeUser.isActive=activeUsers["username"];    
            messageExports.changeReceiver(activeUser);       
            
        }
    })
    socket.on("receive",(message)=>{
        console.log(message.type);
        message=JSON.parse(message);  
        userListExports.receiveMessage(message);  
        messageExports.receiveMessage(message);
        userListExports.addUser(message);
        showToast(message);
      });
   // Message Interface///////////////////////////////////////////////////////////////////////////////////
   var userToolbar=$('#user-toolbar');
   userToolbar.height(100.0);
   
    
})

class Message
{    
    constructor(to,type,content,from,fromDetails={})
    {
          this.to=to;
          this.type=type;
          this.content=content;
          this.from=from;
          this.fromDetails=fromDetails;
    }    
}
class User
{
   constructor(name,username,profilePic,profileUrl,description="")
   {
         this.name=name;
         this.username=username;
         this.profilePic=profilePic;
         this.profileUrl=profileUrl;
         this.description=description;
         this.isActive=false;
   }
}