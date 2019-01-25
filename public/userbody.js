function buildUserBody()
{
    
    var userBody=$(`<div class="col-md-3 w-100 h-100 m-0 p-0 ">             
    <nav class="navbar shadow-sm  p-0" >
        <ul class="navbar-nav message-toolbar w-100 navbar-expand-lg" style="display:flex;flex-flow:row;">
            <li class="nav-item my-auto d-flex px-0 w-100">
                <a class="back-arrow my-auto "><i class="material-icons">arrow_back</i></a>
                <a class="nav-link  my-auto mx-auto " ><span id="receiver-name">Contact Info</span></a>
            </li>
        </ul> 
    </nav>
    <div class=" p-0 w-100 my-2 h-100" id="user-body" >
        
    </div> 
</div>`);
    var userContainer=$(userBody.find('#user-body').first());

    var receiverDetailElement=$(`
    <div class="card text-center">
        <div class="card-body">              
            <img class="card-img user-image" src="" >
            <h6 class="card-title user-name mt-2" style="font-size:14pt"></h6>
            <p class="card-subtitle user-subdetail" style="font-size:12pt"></p>
            <p class="card-text description px-4 py-2" style="font-size:10pt;margin-top:1pt"></p>
        </div>
    </div> `);
    var receiver=null;
    userContainer.append(receiverDetailElement);    
     var photosCard=$(`
    <div class=" option-card  w-100 ">
    <a class="card-title sbg-white my-0 option p-2" data-toggle="collapse" href="#sharedPhotos">          
        <span class="option-title">Shared Photos</span>
        <i class="material-icons">
            keyboard_arrow_down
        </i>   
    </a>
    <div class="card-body  p-0 collapse"id="sharedPhotos">
        <iframe class="gallery w-100" src="" class="w-100" style="height:100pt;border:none"></iframe>
    </div> 
    </div>
    `);
    var optionsCard=$(`
    <div class="option-card w-100">
            <a class="card-title bg-white my-0 option p-2" data-toggle="collapse" href="#options">          
                <span class="option-title">Options</span>
                <i class="material-icons">
                    keyboard_arrow_down
                </i>
            </a>
            <div class="card-body p-0 collapse "id="options">
                <div class="card  p-2" id="block">
                <a class="card-title  bg-white my-0 options" data-toggle="collapse" href="#issuesOpened">          
                    <i class="fas fa-minus-circle"></i>   
                    <span class="options-title ml-2">Block User</span>            
                </a>
                </div>        
                <div class="card p-2" id="delete">
                    <a class="card-title  bg-white my-0 options" data-toggle="collapse" href="#issuesOpened">          
                        <i class="far fa-trash-alt"></i>   
                        <span class="options-title ml-2">Delete chat</span>            
                    </a>
                </div>
        </div> 
    </div>`);
    var blockCard=optionsCard.find("#block").first();      
    blockCard.click(()=>{
        main.alert("this feature is not available",true);
    })
    var deleteCard=optionsCard.find("#delete").first();
    deleteCard.click(()=>{
        socket.emit("deleteAll",{from:currentUser.username,to:activeUser.username});
       window.location.reload();
    })    
    userContainer.append(optionsCard);
    userContainer.append(photosCard);
    function changeReceiver(activeUser)
    {
        receiverDetailElement.find('.card-title').text(activeUser.name);
        receiverDetailElement.find('.card-subtitle').text('@'+activeUser.username);
        receiverDetailElement.find('.card-img').attr('src',activeUser.profilePic);     
        userContainer.find(".gallery").attr('src',`/shared_media?from=${currentUser.username}&&to=${activeUser.username}`);
        createDescription();
    }
    function createDescription()
    {
        if(!activeUser.description||!activeUser.description.toLowerCase().indexOf('gisthub')==-1)
        {
            if(activeUser.description==undefined)
            {
                activeUser.description="";
            }
           activeUser.description+="Follow their code on Github ";
        }
        userContainer.find('.description').empty();
        var description=activeUser.description;
        for(var i=0;i<description.length;i++)
        {
            if(description.substring(i).toLowerCase().startsWith("github"))
            {
                var link="https://github.com/"+activeUser.username;
                userContainer.find('.description').append($('<a>').attr('href',link).text("Github"));
                i=i+link.length-1;
                word=" ";            }
            
            else
            {
                word=description[i];
                userContainer.find('.description').append(word);
            }
        }
    }
    var close=$(userBody.find('.back-arrow').first());
    close.click(()=>{
        window.history.back();
    })
    var exports={};
    exports.changeReceiver=changeReceiver;
    exports.body=userBody;
    return exports;
}