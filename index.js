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
      
      var snContract = web3.eth.contract([{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"writerActs","outputs":[{"name":"timestamp","type":"uint256"},{"name":"title","type":"string"},{"name":"content","type":"string"},{"name":"name","type":"string"},{"name":"writer","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"i","type":"uint256"}],"name":"getWriterActs","outputs":[{"name":"","type":"string"},{"name":"","type":"string"},{"name":"","type":"string"},{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"countPosts","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"title","type":"string"},{"name":"text","type":"string"},{"name":"name","type":"string"}],"name":"insertPost","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"}]);
      var socialNetwork = snContract.at('0x860c70fb78be41b3601d94ffc06ca717e60692ee');
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
      


      socialNetwork.countPosts((err,response) => {
      if(response){
            var z = parseInt(response.c);
            prevResponse = z;
          $('#countPosts').html('Total Posts: '+ response.c);         
          for(i=0 ; i<response.c;i++)
          {
            socialNetwork.getWriterActs(i, (err,res) => {
            $("#postsul").append('<li id="post"><center><h3 id="title">'+res[0]+'</h3><br /></center><span id="content">'+res[1]+'</span><br /><br /><span id="writerName">'+res[2]+'</span><span id="time">'+res[3]+'</span><br /></li>');             
            });
          }
       }
      });
      setInterval(() => { socialNetwork.countPosts((err,response) => {
        var y = parseInt(response.c);
        if(y == prevResponse ) {
            
        }else {
            prevResponse = response.c;
            $('#countPosts').html('Total Posts: '+ response.c);
               var x = response.c-1;
               socialNetwork.getWriterActs(x, (err,res) => {
                    $("#postsul").append('<li id="post"><center><h3 id="title">'+res[0]+'</h3><br /></center><span id="content">'+res[1]+'</span><br /><br /><span id="writerName">'+res[2]+'</span><span id="time">'+res[3]+'</span><br /></li>');             
             });
            }
        })
      },10000);

      

        $('#postButton').click(() =>{
        $('#loader').show();
        $('body > *:not("#loader")').addClass('blur');
        socialNetwork.insertPost($('#title').val(), $('#content').val(),$('#name').val(),{from: web3.eth.accounts[1], gas:3000000},(err, res) => {
            if(err)
            {
                $('#loader').hide();
                $('body > *:not("#loader")').removeClass('blur');
                console.log(err); 
            }
            else
            {
                $('#loader').hide();
                $('body > *:not("#loader")').removeClass('blur');
                Materialize.toast('Successfull!', 1000);
            }
        });
        $('#title').val('');
        $('#name').val('');
        $('#content').val('');
      });
   });