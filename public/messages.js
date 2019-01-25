

function buildMessages()
{
 
    var messageBody=$(`<div class="col-6 h-100 message-body m-0 p-0 d-flex" style="flex-direction: column;">             
    <nav class="navbar  shadow-sm p-0 navbar-expand">
        <ul class="navbar-nav message-toolbar w-100 navbar-expand-lg" style="display:flex;flex-flow:row;">
            <li class="nav-item my-auto d-flex px-0">
            <a class="back-arrow my-auto "><i class="material-icons">arrow_back</i></a>
            <img src="${currentUser.profilePic}" class="toolbar-pic my-auto mx-2" id="receiver-pic" />
            <section class="toolbar-heading px-2">
             <span id="receiver-name"></span><br>             
             <span id="receiver-active"></span>
            </section>                                
            </li>

            <li class="nav-item my-auto " style="margin-left:auto">
            <div class="dropdown">
                <a class="nav-link"  id="attachBtn" data-toggle="dropdown" ><i class="material-icons attach">attach_file</i></a>
                <div class="dropdown-menu dropdown-menu-right" aria-labelledby="attachBtn">
                <a class="dropdown-item" id="code-btn">Code File</a>
                <a class="dropdown-item" id="img-btn">Image</a>
                <a class="dropdown-item" id="issue-btn">Report Issue</a>
                </div>
            </div>
            </li>
            <li class="nav-item my-auto menu" style="">
                <div class="dropdown" >
                <a class="nav-link" data-toggle="dropdown" ><i class="material-icons">  more_vert</i></a>
                    <span class="caret"></span></button>
                    <div class="dropdown-menu dropdown-menu-right">
                        <a class="dropdown-item" id="info">Contact Info</a>
                        <a class="dropdown-item" id="delete-all-btn">Delete chat</a>
                        <a class="dropdown-item" id="block">Block user</a>
                    </div>
                </div>
            </li>  
        </ul> 
        
    </nav>
    <div class="row p-0 w-100 m-0 body " style="flex-grow: 1" >
    </div> 
</div>`);
    var messageContainer=$(`
    <div class="message-container w-100 p-0 m-0">             
        <ul class="messages  m-0 p-0">
        </ul>

        <div class="message-input  mt-auto ">
            <input type="file" id="img-input" style="flex-grow: 0;visibility: hidden;width:0pt;display:inline-block" accept="image/*" multiple="false" style="visibility: hidden">
            <input type="file" id="code-input" style="flex-grow: 0;visibility: hidden;width:0pt;display:inline-block" multiple="false" style="visibility: hidden">         
            <input type="text" class="message-input-text " data-emojiable="true"  placeholder="Type Something Here"/>
            <div class="attachments my-auto">
                <a class="input-button  my-auto"  data-toggle="dropdown" ><i class="far fa-smile input-icon"></i></a>
                <div class="dropdown-menu like-buttons">
                    <div class="add-reactions-options mx-1 mb-1">
                    <input type="hidden" name="input[subjectId]" value="MDU6SXNzdWUzOTYxODY5NDY=">
                        <button type="submit"  class="btn btn-link add-reactions-options-item js-reaction-option-item like " data-reaction-label="+1" name="input[content]" aria-label="React with thumbs up emoji" value="THUMBS_UP react">
                        <g-emoji alias="+1" fallback-src="https://github.githubassets.com/images/icons/emoji/unicode/1f44d.png" class="emoji">👍</g-emoji>
                        </button>
                        <button type="submit" class="dislike btn btn-link add-reactions-options-item js-reaction-option-item" data-reaction-label="-1" name="input[content]" aria-label="React with thumbs down emoji" value="THUMBS_DOWN react">
                        <g-emoji alias="-1" fallback-src="https://github.githubassets.com/images/icons/emoji/unicode/1f44e.png" class="emoji">👎</g-emoji>
                        </button>
                        <button type="submit" class="happy btn btn-link add-reactions-options-item js-reaction-option-item" data-reaction-label="Laugh" name="input[content]" aria-label="React with laugh emoji" value="LAUGH react">
                        <g-emoji alias="smile" fallback-src="https://github.githubassets.com/images/icons/emoji/unicode/1f604.png" class="emoji">😄</g-emoji>
                        </button>
                        <button type="submit" class="hooray btn btn-link add-reactions-options-item js-reaction-option-item" data-reaction-label="Hooray" name="input[content]" aria-label="React with hooray emoji" value="HOORAY react">
                        <g-emoji alias="tada" fallback-src="https://github.githubassets.com/images/icons/emoji/unicode/1f389.png" class="emoji">🎉</g-emoji>
                        </button>
                        <button type="submit" class="confused btn btn-link add-reactions-options-item js-reaction-option-item" data-reaction-label="Confused" name="input[content]" aria-label="React with confused emoji" value="CONFUSED react">
                        <g-emoji alias="thinking_face" fallback-src="https://github.githubassets.com/images/icons/emoji/unicode/1f615.png" class="emoji">😕</g-emoji>
                        </button>
                        <button type="submit" class="heart btn btn-link add-reactions-options-item js-reaction-option-item" data-reaction-label="Heart" name="input[content]" aria-label="React with heart emoji" value="HEART react">
                        <g-emoji alias="heart" fallback-src="https://github.githubassets.com/images/icons/emoji/unicode/2764.png" class="emoji">❤️</g-emoji>
                        </button>
                </div>
                    </div>
                <a id="send-btn" class="input-button my-auto"><i class="material-icons input-icon">send</i></a>
            </div>
            </div>
            </div> 
    </div>`);
 

    messageBody.find('.body').append(messageContainer);
    var smilies=["happy","like","dislike","hooray","confused","heart"];
    var codes=["😄","👍","👎","🎉","😕","❤️"];
    smilies.forEach((val,index)=>{
        $(messageContainer.find('.'+val).first()).click(()=>{
            console.log(codes[index]);
            sendMessage(codes[index],"text");
        })
    })
   var messages=$(messageContainer.find('.messages').first());
   var messageInput=$(messageContainer.find('.message-input-text').first());
   var typingIndicator=$(`<p class="message typing-indicator ">
       <span></span>
       <span></span>
       <span></span>
   </p>`);


   var sendBtn=$(messageContainer.find('#send-btn').first());
   var imgInput=$(messageContainer.find('#img-input').first());
   var codeInput=$(messageContainer.find('#code-input').first());
   var imgBtn=$(messageBody.find('#img-btn').first());
   var codeBtn=$(messageBody.find('#code-btn').first());
   var issueBtn=$(messageBody.find('#issue-btn').first());
   var msgLoader=$('<li/>').addClass('loader d-flex w-100 p-2 mt-auto mb-auto').css('justify-content','center');
   msgLoader.append($(`
   <div class="spinner-border text-warning" style="width: 3rem; height: 3rem;" role="status">
     <span class="sr-only">Loading...</span>
   </div>`));
   var receiverName=$(messageBody.find('#receiver-name').first());
   var receiverActive=$(messageBody.find('#receiver-active').first());
   var receiverPic=$(messageBody.find('#receiver-pic').first());
   var backBtn=$(messageBody.find('.back-arrow').first());
   var infoBtn=$(messageBody.find('#info').first());
   var deleteAllBtn=$(messageBody.find('#delete-all-btn').first());
   var blockBtn=$(messageBody.find('#block').first());
   backBtn.click(()=>{
    window.history.back();
   });
   infoBtn.click(()=>{
     main.getInfo();  
   }) 
   deleteAllBtn.click(()=>{
       socket.emit("deleteAll",{from:currentUser.username,to:activeUser.username});
       window.location.reload();
   })   
   blockBtn.click(()=>{
       main.alert("This feature is not available yet",true);
   })
    function startLoadingMessages()
    {
        messages.empty();

        socket.emit("personalchats",JSON.stringify({from:currentUser["username"],to:activeUser["username"]}));
        /* Loader*/
        msgLoader.appendTo(messages);
        
        $.get("/messages/"+activeUser.username,{},
            function (chats, textStatus, jqXHR) {
            msgLoader.detach();
            messages.empty();
            chats.forEach((message,i)=>{
                var elm=createMessageElement(message);
                messages.append(elm);
            })
            Prism.highlightAll();        

            },
            "json"
        );


    }        
    var typing=false;
    messageInput.keydown((e)=>{
        if(messageInput.val().length==1)
        {
            if(!typing)
            {
                sendMessage("","typing");
                typing=true
            }
            sendBtn.css("display","inline")
            
        }
        else if(messageInput.val().length==0){
            
            if(typing)
            {
                sendMessage("","notTyping");
                typing=false
            }
        }
        if(e.which==13)
        {
            var messageText=messageInput.val();
            sendMessage(messageText,"text");
            if(typing)
            {
                sendMessage("","notTyping");
                typing=false
            }
        }
    })
    
    //Message menu
    var menu=$('#message-menu');
    var textInput=$('<input/>');
    var copyBtn=$('#message-copy');
    var deleteBtn=$('#message-delete');
    copyBtn.click(()=>{
        if(selectedMessage!=null)
        {
            $('#main-body').append(textInput);
            textInput.val(selectedMessage.content);
            textInput.select();
            document.execCommand("copy")        
            textInput.detach();
        }
    })
   deleteBtn.click(()=>{
       if(selectedElement!=null&&selectedMessage!=null)
       {
           selectedElement.text('You deleted this message');
           socket.emit("deleteMessage",selectedMessage)
       }
   })
    function addMenu(e)
    {
        if(!e.messageElement.hasClass('received'))
        {
            deleteBtn.appendTo(menu);
        }
        else
        {
            deleteBtn.detach();
        }
        e.preventDefault();
        menu.css("left",e.pageX);
        menu.css("top",e.pageY);
        menu.show();        
    }
    
    menu.click(function() {
        $('.msg').css('background-color','#ffffff00');
        menu.hide();
    });
    $(document).click(function() {
        console.log(4)
        $('.msg').css('background-color','#ffffff00')
        menu.hide();

    });
    ///Send Message
    function sendMessage(content,type)
    {
         
        if(!activeUser)
        {
            return;
        }
        if((currentUser==null||activeUser==null)||!JSON.parse(localStorage["currentUser"])||(JSON.parse(localStorage["currentUser"]).username!=currentUser.username))
        {
            window.location.href='/'
        }
        if(type=="text"&&content.length==0)
        {
          main.alert("Message can not be empty",true)
          return;
        }
        if(currentUser.username==activeUser.username)
        {          
            return;
        }
       var message=new Message(activeUser.username,type,content,currentUser.username);
       message.key=JSON.parse(localStorage["currentUser"]).key;
       message.id= Date.now();
       socket.emit("send",message)
        $.post("/send", message,
           function (data, textStatus, jqXHR) {
               var status=jqXHR.status;
               console.log(status)
               if(status==403)
               {
                   window.location.replace('/')
               }
           },
           "json"
       );
       if(message.type=="typing"||message.type=="notTyping")
       {
           return;
       }
       var messageElement=createMessageElement(message);     
       messages.prepend(messageElement);
       Prism.highlightAll();
    }    
    sendBtn.click(()=>{
        sendMessage(messageInput.val(),"text");
    })
    //Handle issue
    issueBtn.click(()=>{
        main.alert("Issue feature is not available now.",true);
    })
    //Handle code button
    codeBtn.click(()=>{
        codeInput.click()
    })
    var formats="markup+css+clike+javascript+c+csharp+cpp+ruby+css-extras+dart+django+markup-templating+git+java+javastacktrace+kotlin+objectivec+php+php-extras+sql+python+r+jsx+typescript+plsql+tsx".split("+")
    function readCode(input) {
        if (input.files && input.files[0]) {
            var file=input.files[0];
            var sizeMB = file.size / 1024/1024;
            if(sizeMB>1)
            {
               main.alert("Size of file can not exceed  2mb",true);
               return;
            }
            var reader = new FileReader();    
            var file=input.files[0];
            var type=file.type.split('/').pop();
            if(formats.indexOf(type)==-1)
            {
                main.alert(`Extensions of file can be only ${formats.join(",")}`,true);
                return ;
            }
            reader.onload = function (e) {                
              sendMessage(e.target.result,`language-${type}`);
            }
            reader.readAsText(input.files[0], "UTF-8");
        }
    }
    $(codeInput).change(function(){
        readCode(this);
    });
    //Handle image button
    imgBtn.click(()=>{
        imgInput.click(()=>{
            
        });
    })
    function readImage(input) {
        if (input.files && input.files[0]) {
            var file=input.files[0];
            var sizeMB = file.size / 1024/1024;
            if(sizeMB>2)
            {
               main.alert("Size of file can not exceed  2mb",true);
               return;
            }
            var reader = new FileReader();    
            reader.onload = function (e) {                
                sendMessage(e.target.result,"image");
                
                // const uint = new Uint8Array(e.target.result)
                // let bytes = []
                // uint.forEach((byte) => {
                //     bytes.push(byte.toString(16))
                // })
                // console.log(uint);
                // const hex = bytes.join('').toUpperCase();
                // console.log(hex);
                // switch(hex)
                // {
                //     case 'FFD8FFDB':
                //     case 'FFD8FFE0':
                //     case 'FFD8FFE1':
                //     case '89504E47':
                //     case '47494638':
                //     default:
                //         alert("image uploading failed (Allowed Formats-[jpeg,png,gif]) ",true);               
                // }
            }
            reader.readAsDataURL(input.files[0]);

        }
    }
    $(imgInput).change(function(){
        readImage(this);
    });
    
    var typingElement=null;
    function createMessageElement(message)
    {
    if(message["from"]!=activeUser["username"]&&message["from"]!=currentUser["username"])
    {
        return null;
    }
    var messageElement= $(`<li>
     <img src="${currentUser.profilePic}" class="user-image">
      </li>`);
      
      if(message["type"]=="typing")
      {
        if(typingElement!=null)  
            typingElement.detach();
        messageElement.find('.user-image').attr('src',activeUser['profilePic']);
        typingIndicator.appendTo(messageElement);
        typingElement=messageElement;  
      }
      else if(typingElement!=null)
      {
          typingElement.remove();
      }
      if(message["type"]=="notTyping")
      {
          return null;
      }
      if(message["type"]=="text")
        {
         messageElement.append($('<p/>').addClass('message')); 
         createTextMessage(message,messageElement);   
        }  
      else if(message["type"]=="image"){
          createImageMessage(message,messageElement);
      }
      else if(message["type"].startsWith("language")){
          createCodeMessage(message,messageElement);
      }
      if(message["from"]==activeUser["username"])
      {
          messageElement.addClass('received');
          messageElement.find('.user-image').attr('src',activeUser['profilePic']);
      }
      else if(message["from"]==currentUser["username"]){
        messageElement.addClass('sent');
        messageElement.find('.user-image').attr('src',currentUser['profilePic']);
      }
      else{
          return null;
      }
      if(messageElement.hasClass("sent"))
      {
        var flexElement=$("<div/>").addClass("msg").attr('style','width: 100%;display: flex;flex-direction: column;min-height: min-content;text-align: right;margin-bottom:10pt');  
        flexElement.append(messageElement);
        flexElement.append($(`<i class="material-icons">${message.seen?"done_all":"done"}</i>`).addClass("last-seen"));
        messageElement=flexElement;
      }
      messageElement.addClass('msg');
      if(!(message.type=="type"||message.type=="notTyping"))
      {
        $(messageElement).bind("contextmenu",(e)=>{

            selectedMessage=message;
            selectedElement=messageElement;
            $(messageElement).css('background-color','#eee')
            e.messageElement=messageElement;
            addMenu(e);
            return false;
        })  
      } 
      return messageElement;
    }
    var selectedMessage=null;
    var selectedElement=null;
    function createTextMessage(message,messageElement)
    {
        var messageParagraph=messageElement.find('.message');
        var word="";
        var content=message.content; 
        for(var i=0;i<content.length;i++)
        {
            if(content[i]==='h'&&content.substring(i).startsWith("http"))
            {
                var end=content.substring(i).indexOf(" ");
                var link=content.substring(i,end!=-1?i+end:content.length);
                if(checkLink(link))
                {
                    messageParagraph.append($('<a>').attr('href',link).attr("target","_blank").text(link));
                    i=i+link.length-1;
                    word=" ";
                }
                
            }
            else if(content[i]==='w'&&content.substring(i).startsWith("www"))
            {
                var end=content.substring(i).indexOf(" ");
                var link=content.substring(i,end!=-1?end:content.length);
                if(checkLink('https://'+link))
                {
                    messageParagraph.append($('<a>').attr('href',link).text(link));
                    i=i+link.length-1;
                    word=" ";
                }
            }
            else
            {
                word=content[i];
                messageParagraph.append(word);
            }
        }      
    }
    function checkLink(link)
    {
       try {
        var url=new URL(link);
        return true;
       } catch (error) {
        console.log(error);   
           return false;
       }
    }

    function createImageMessage(message,messageElement)
    {
        messageElement.append($('<a/>').attr('href',message.content).attr('target',"_blank").append($('<img/>').addClass("message-image shadow").attr("src",message.content))); 
        messageElement.find('li').css('padding','0pt');    
    }   
    
    function createCodeMessage(message,messageElement)
    {
        messageElement.append($('<p/>').addClass('message-code ').append($('<pre/>').addClass('line-numbers').append($('<code/>').addClass(`${message.type}`).text(message.content)))); 
    }
    imgBtn.click(()=>{
        imgInput.click();
    })
    function receiveMessage(message) 
    {
        var messageElement=createMessageElement(message);
        // $('.messages').animate({scrollTop:10000},"fast");
        messages.prepend(messageElement);
        Prism.highlightAll();        
       
    }
    function changeReceiver(activeUser) 
    {
        
        receiverName.text(activeUser.name);
        receiverPic.attr('src',activeUser.profilePic);
       if(activeUser.isActive)
        receiverActive.text('Online');
       else
       {
        receiverActive.text('Offline');
       }
    }

    var exports={};
    exports.startLoadingMessages=startLoadingMessages;
    exports.changeReceiver=changeReceiver;
    exports.receiveMessage=receiveMessage;
    exports.body=messageBody;
    return exports;
}