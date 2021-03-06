$(document).ready(() => {       
     $('.modal').modal();
     if (typeof web3 !== 'undefined')
     {
           web3 = new Web3(web3.currentProvider);
     }
     else 
     {
         web3 = new Web3();
         web3.setProvider(new Web3.providers.HttpProvider("http://localhost:8545"));       
     }
      web3.eth.defaultAccount=web3.eth.accounts[0];
      
      var snContract = web3.eth.contract([{"constant":false,"inputs":[{"name":"i","type":"uint256"}],"name":"incrementLikes","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"writerActs","outputs":[{"name":"timestamp","type":"uint256"},{"name":"title","type":"string"},{"name":"content","type":"string"},{"name":"name","type":"string"},{"name":"writer","type":"address"},{"name":"likes","type":"uint256"},{"name":"dislikes","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"i","type":"uint256"}],"name":"getWriterActs","outputs":[{"name":"","type":"string"},{"name":"","type":"string"},{"name":"","type":"string"},{"name":"","type":"uint256"},{"name":"","type":"uint256"},{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"i","type":"uint256"}],"name":"incrementDislikes","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"i","type":"uint256"}],"name":"getdislikes","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"i","type":"uint256"}],"name":"getlikes","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"countPosts","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"title","type":"string"},{"name":"text","type":"string"},{"name":"name","type":"string"}],"name":"insertPost","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"}]);
      var socialNetwork = snContract.at('0xe2c4826abcf1f20ff94935d7472307a69b1cc89a');
      var prevResponse = 0;
      //var writeracts = socialNetwork.getWriterActs(i);
      //var writeractsLen = writeracts.length;
      //console.log(writeractsLen);

     /* for(i=0;i<writeractsLen;i++)
      {     var address = writeracts[i];
            socialNetwork.getWriterActsPosts(address, (err,res) => {
            $("#postsul").append('<li id="post"><center><h3 id="title"></h3><br /></center><span id="content">'+res[2]+'</span><br /><br /><span id="writerName">'+res[1]+'</span><span id="time">'+res[0]+'</span><br /></li>'); 
          });
      }*/
      var likes = [];
      var dislikes = [];

      socialNetwork.countPosts((err,response) => {
      if(response){
        $('#loader').show();
        let count = 0;
        var z = parseInt(response.c);
        prevResponse = z;
          $('#countPosts').html('Total Posts: '+ response.c);         
          for(i=0 ; i<response.c; i++)
          {
            socialNetwork.getWriterActs(i, (err,res) => {
                $("#postsul").prepend('<li id="post" class="'+ count +'"><center><h3 id="title">'
                +res[0]+'</h3><br /></center><span id="content">'
                +res[1]+'</span><br /><br /><span class="updiv"><span id= "upVotes">UpVotes:<span id="manLikes">'
                +res[4]+'</span></span><button class="waves-effect waves-light btn upBtn" id="hello"><i class="material-icons">thumb_up</i></button></span>'
                +'<span class="downdiv"><span id= "downVotes">DownVotes:<span id="manDislikes">'
                +res[5]+'</span></span>'
                +'<button class="waves-effect waves-light btn dvBtn"><i class="material-icons">thumb_down</i></button></span>'
                +'<br /><br /><span id="writerName">Post Curator:'
                +res[2]+'</span><span id="time">Post Time:'
                +(new Date(res[3]*1000)).toUTCString()+'</span><br /></li>');       
                likes[count] = parseInt(res[4]);
                dislikes[count] = parseInt(res[5]);
                count = count + 1;  
            });
            
          }
          $('#loader').hide();
       }
      });
    $('body').on('click', 'button.upBtn', function() {
        var index = $(this).parent().parent().attr('class');
        socialNetwork.incrementLikes(index);    
        likes[index] = likes[index] + 1;
        let cin = likes[index];
        $(this).siblings().children().html(cin);    
    });
    $('body').on('click', 'button.dvBtn', function() {
        var index = $(this).parent().parent().attr('class');
        socialNetwork.incrementDislikes(index);
        dislikes[index] = dislikes[index] + 1;
        let cin = dislikes[index];
        $(this).siblings().children().html(cin); 
        
    });
      setInterval(() => { socialNetwork.countPosts((err,response) => {
        var y = parseInt(response.c);
        if(y == prevResponse ) {
            
        }else {
            prevResponse = response.c;
            $('#countPosts').html('Total Posts: '+ response.c);
               var x = response.c-1;
               socialNetwork.getWriterActs(x, (err,res) => {
                $("#postsul").prepend('<li id="post" class="'+ x +'"><center><h3 id="title">'
                +res[0]+'</h3><br /></center><span id="content">'
                +res[1]+'</span><br /><br /><span class="updiv"><span id= "upVotes">UpVotes:'
                +res[4]+'</span><button class="waves-effect waves-light btn upBtn" id="hello"><i class="material-icons">thumb_up</i></button></span>'
                +'<span class="downdiv"><span id= "downVotes">DownVotes:'
                +res[5]+'</span>'
                +'<button class="waves-effect waves-light btn dvBtn"><i class="material-icons">thumb_down</i></button></span>'
                +'<br /><br /><span id="writerName">Post Curator:'
                +res[2]+'</span><span id="time">Post Time:'
                +(new Date(res[3]*1000)).toUTCString()+'</span><br /></li>');    
                likes[x] = parseInt(res[4]);
                dislikes[x] = parseInt(res[5]);  
             });
            }
        })
      },5000);
      

        $('#postButton').click(() =>{
        $('#loader').show();
        $('body > *:not("#loader")').addClass('blur');
        socialNetwork.insertPost($('#title').val(), $('#content').val(),$('#name').val(),{from: web3.eth.accounts[1], gas:3000000},(err, res) => {
            if(err)
            {
                $('#loader').hide();
                $('body > *:not("#loader")').removeClass('blur');
                console.log(err);
                Materialize.toast('Unsuccessfull!', 2000, 'blue'); 
            }
            else
            {
                $('#loader').hide();
                $('body > *:not("#loader")').removeClass('blur');
                Materialize.toast('Successfull!', 2000, 'green');
            }
        });
        $('#title').val('');
        $('#name').val('');
        $('#content').val('');
      });
   });