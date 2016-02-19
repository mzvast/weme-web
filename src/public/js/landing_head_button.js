 var vex_msg = '<h2>联系我们</h2> \
                	<p><b>客服邮箱：</b><br><a href="mailto:service@weme.com"><u>service@weme.com</u></a></p>\
                	<p><b>账号申诉：</b><br><a href="mailto:shensu@weme.com?subject=账号申诉&body=1、喂米号<br>2、昵称<br>3、绑定手机号<br>4、账号补充描述：（包括描述头像图片、填写年龄、星座、常驻地选择）<br>5、申诉理由（陈述并尽量举证自己并无违规行为，以方便工作人员核实）"><u>shensu@weme.com</u></a>,提交信息包括喂米号、昵称、绑定手机号以及申诉理由。</p>\
                	<p><b>官方微博：</b><br>@喂米APP</p>';
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
              swiper.slideTo(3, 700, false); 
              }); 
            $('#goTop').click(function(event) { 
              event.preventDefault(); 
              swiper.slideTo(0, 700, false); 
              }); 
            $('#login').click(function(event) {
              event.preventDefault();
              window.location.href='/auth/login'; 
            });