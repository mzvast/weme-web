 var vex_msg = '<h2>联系我们</h2> \
                	<p><b>客服邮箱：</b><br><a href="mailto:wemespace@gmail.com"><u>wemespace@gmail.com</u></a></p>\
                	<p><b>唯觅团队，竭诚为按服务';
            vex.defaultOptions.className = 'vex-theme-flat-attack';
            var vex_confirm = function(msg) {
                vex.open({
                    content: msg,
                    //   afterClose: function() {
                    //               return vex.dialog.alert('Thany You');
                    //             }
                    //   input:'<h1>Fuck you</h1>',
                    //   callback:function(value){
                    //       var re = (value == true) ? 'Thank you' : 'Try make a better one';
                    //         return alert(re);
                    //   }
                });
            };

            $('#about').click(function() {
                vex_confirm(vex_msg);
            });
            
            $('#download').click(function(event) { 
              event.preventDefault(); 
              swiper.slideTo(4, 700, false); 
              }); 
            $('#goTop').click(function(event) { 
              event.preventDefault(); 
              swiper.slideTo(0, 700, false); 
              }); 
            $('#login').click(function(event) {
              event.preventDefault();
              window.location.href='/auth/login'; 
            });