function buildUsersList()
{
    var userBody=$(`
    <div class="col-3 card user-body d-flex m-0 p-0 h-100" id="chats" >
        <a class="btn btn-dark btn-rounded  floating shadow"  href="https://github.com/singhbhavneet/GitMessenger" target=”_blank” ><i class="fab fa-github mx-auto my-auto"></i></a>
        <nav  class="navbar navbar-expand shadow-sm">
            <ul class="navbar-nav w-100 px-0">
                <li class="nav-item mr-auto my-auto ">
                <a class="nav-link title" target="_blank" href=${"https://github.com/"+currentUser.username}><img class="toolbar-pic" src=${currentUser.profilePic}></a>
                </li>
            <li class="nav-item  my-auto">
                <a class="nav-link title">Chats</a>
            </li>
            <li class="nav-item my-auto ml-auto">
            <div class="dropdown">
                    <a class="nav-link " id="menu" data-toggle="dropdown"  data-placement="bottom"><i class="material-icons ">more_vert</i></a>
                        <div class="dropdown-menu dropdown-menu-right" aria-labelledby="menu">
                          <a class="dropdown-item" id="logOut" data-toggle="modal" data-target="#logoutModal" href="#">Log Out</a>
                          <a class="dropdown-item" href="https://github.com/singhbhavneet">Developer</a>
                        </div>
            </div>
            </li> 
            </ul>
        </nav>
        <div class="list  col-sm-0 h-100" >
            <ul class="p-0" id="users-list"></ul>
           </ul>
        </div>   
    </div>
    `);
    var notificationClass="notification-chat";
    var users={};
    var usersList=$(userBody.find('#users-list').first());    
    var list=$(userBody.find('.list').first());
    var searchBox=$(`<div class="search-box ml-auto mr-3 p-2 px-4 mb-3 mt-3">
    <i class="fas fa-search search-btn my-auto"></i>
    <input type="text" class="search-input mx-4  text-center" placeholder="Search Here">
    <i class="fas fa-times-circle search-btn  my-auto" id="search-close" style="visibility:hidden"></i>
    </div>`);
    searchBox.prependTo(list);
    var searching=false;
    var loader=$('<li/>').addClass('loader d-flex w-100 p-2').css('justify-content','center');
    loader.append($(
        `<div class="spinner-border text-primary" style="width: 3rem; height: 3rem;" role="status">
        <span class="sr-only">Loading...</span>
      </div>`
    ));
    var searchInput=null;
    var searchClose=null;
    searchInput=$(searchBox.find('.search-input').first());
    searchClose=$(searchBox.find('#search-close'));
    var settingsBtn=$("#settings");
    
    searchClose.click(()=>{
            closeSearch();
        })
    $(searchInput).on("focus",()=>{
            searchClose.css("visibility","visible");
        })
    $(searchInput).keydown((e)=>{
        if(e.which==13)
        {
              searching=true;
            searchUser();
        }
        else if(e.which==27)
        {
            closeSearch();
        }
        });
    addUsers();  
    function createUser(user)
    {

        var recentChat=user.recentChat;

        var userCard=$(`
        <div class="user-card w-100 ripple rounded">
            <img src="https://avatars1.githubusercontent.com/u/5645671?s=400&amp;v=4" class="user-image my-auto">
            <section class="user-section">
                <section class="user-body my-auto" style="display: inline-block;">
                    <h6 class="user-name">Amit Gupta</h6>
                    <p class="user-subdetail">billo</p>
                </section>
                <span class="time ml-auto">Sat</span>
            </section>
       </div>`);
        userCard.user=user;
        if(activeUserElement==null)
        {           
            activeUserElement=userCard;
            userCard.addClass(activeClass);
            activeUserElement.addClass(activeClass);
            activeUser=userCard.user;
            main.changeReceiver(activeUser);
        }
        userCard.find('.user-image').attr('src',user.profilePic);
        userCard.find('.user-name').text(user.name);
        var recentMessage="No chat available";
        if(recentChat)
        {
            if(recentChat.type=="text")
            {
                recentMessage=recentChat.content;
            }
            else if(recentChat.type=="image")
            {
                recentMessage="Image";
            }
            userCard.find('.time').text(new Date(Number.parseInt(recentChat.id)).toLocaleDateString());
        }
        userCard.find('.user-subdetail').text(recentMessage);
        userCard.addClass('ripple');
        userCard.click((e)=>{
            $(e.target).addClass(activeClass);
            activeUserElement.removeClass(activeClass);
            activeUserElement=$(e.target);
            activeUserElement.addClass(activeClass);
            activeUser=userCard.user;
            activeUserElement.removeClass(notificationClass);
            main.changeReceiver(activeUser);
        })
        return userCard;
    }
    function addUsers(index=0)
    {
        if(index==0)
        {
            users={};
            deleteActiveUser();
        }
        startLoading();
        socket.emit("chats",{username:currentUser.username,key:key});
        socket.on("chats",(data)=>{          
           stopLoading();                
           var list=JSON.parse(data);
           emptyList();
           list.forEach((user,index)=>{
              
              var userCard=createUser(user);
              users[user.username]=userCard;
              usersList.append(userCard);
           }) 
        })
    }
    function emptyList()
    {
        users={};
        usersList.empty();
    }
    function closeSearch()
    {
        searchInput.blur();

        if(searching)
        {
            emptyList();
            addUsers();
        }
        searching=false;
        searchInput.val('');
        searchClose.css("visibility","hidden");
    }
    function searchUser()
    {
         startLoading();
         var search=searchInput.val();
         $.get(`/search/${search}`, {username:search},
             function (userdata, textStatus, jqXHR) {
                emptyList();
                if(userdata!=null)
                {
                  var users=JSON.parse(userdata);
                  users.forEach((user)=>{
                    var userCard=createUser(user);
                    usersList.append(userCard);
                  })        
                }
                else{
                 
                }
             },
             "json"
         );
    }
    function startLoading()
    {
        emptyList();
        loader.appendTo(usersList);
    }
    function stopLoading() {
        loader.detach();
    }
    function receiveMessage(message)
    {
        if(users[message["from"]]&&message.type!='typing'&&message.type!="notTyping")
        {
            var from=message.from;
            var content=message.type==="text"?message.content:"Sent you an image";
             users[from].detach();
            users[from].find('.user-subdetail').text(content);
            users[message["from"]].addClass(notificationClass);
            users[from].prependTo(usersList);
        }
    }
    function addUser(message)
    {
        var user=message.fromDetails;
         if(!users[user.username])
         {
             var userCard=createUser(user);
             var content=message.type==="text"?message.content:"Sent you an image";
             userCard.find('.user-subdetail').text(content);
             userCard.addClass(notificationClass);
             usersList.prepend(userCard);
             users[user.username]=userCard;
         }
    }
    var exports={};
    exports.addUser=addUser;
    exports.receiveMessage=receiveMessage;
    exports.body=userBody;
    return exports;
}