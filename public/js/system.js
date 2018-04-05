//Запрещаем меногократный вызов страницы
sync = {
   id: 0,
   active: false,
   action: function(){
      clearTimeout( this.id );
      sync.push();
   },
   delay: function(delay){
      this.id = setTimeout( this.action, delay );
   },
   push: function (){
      clearTimeout( this.id );
      this.active = false;
   },
   pop: function (){
      if ( this.active == false ){
         this.active = true;
         return true;
      }
      return false;
   }
}


/*$(document).on("touchstart touchmove touchend", ".refreshed", function(event) {
            var touch;
            switch (event.type) {
                case "touchstart": 
                  pull = 0;
                  touch = event.originalEvent.touches[0] || event.originalEvent.changedTouches[0];
                  startTouchY = touch.clientY;
                  break;
                case "touchmove":
                  touch = event.originalEvent.touches[0] || event.originalEvent.changedTouches[0];
                  moveTouchY = touch.clientY;
                  pull = Math.round(moveTouchY - startTouchY);
                  $('#header .h1').text(pull);
                  if($('body').scrollTop()==0){
                    if(pull<=100 && pull>=0){
                      event.preventDefault();
                      $('.refresh').text('Потяните, чтобы обновить...').css({'height':pull+'px'});
                    }else if(pull>=100){
                      $('.refresh').text('Отпустите, чтобы обновить...');
                    }
                  } 
                  break;
                case "touchend":
                if($('body').scrollTop()==0){
                  if(pull>=100){
                    //Подготавливаем данные для сервера
                    var ju = new Object();
                        ju['j'] = 2;
                    var jjj = JSON.stringify(ju);
                    $.ajax({
                      type: "POST",
                      cache: false,
                      data: jjj,
                      url: location.pathname,
                      success: function(data){
                        system.loading(false);
                        nav.page(data, location.pathname, true);
                              $('.refresh').animate({
                                'height':0
                              });       
                      },
                      beforeSend: function(){
                        system.loading(true);
                        $('.refresh').text('Идет обновление...');
                      },
                      error: function(data){
                        alert(data+'aaa');
                      }
                    });
                    
                  }else{ 
                    $('.refresh').animate({
                      'height':0
                    });       
                }
              }
                  break;
            }
    //event.preventDefault();
});
*/
$(document).ready(function(){

        nav.goto(location.pathname, 'refresh');

  			setInterval(function() {
  				$(".active .need_update").each(function(i){
  					var time = $(this).attr("time");
  					$(this).text(system.datetime(time));
  				});
  			}, 30000);

        window.onpopstate = function(event) {
          if($("section").is(".pageOver")){
            nav.back(document.location.pathname, event.state, 0);
          }
        };
});

$(window).on('scroll',function(e){
    var scrolled = $(window).scrollTop();
    $('.table').css('transform','translateY('+(scrolled*.2)+'px)');
    $('.table_left').css('transform','translateX('+(-scrolled*.13)+'px)');
    $('.table_right').css('transform','translateX('+(scrolled*.13)+'px)');
    $('.pollSlider').css('transform','translateY('+(scrolled*.08)+'px)');
    $('.indexHeader').css('transform','translateY('+(scrolled*.2)+'px)');
    $('.statistik').css('transform','translateY('+(-scrolled*.09)+'px)');
    $('.arrows').css('transform','translateY('+(-scrolled*0.09)+'px)');
    $('.background').css('transform','translateY('+(scrolled*.50)+'px)');
});

var system = {
	//Сообщение
	message: function(textarea, type, delay){
		//alert(textarea);
    var out = '<div class="smsg '+type+'" onmouseover="return system.messageOut(this)">'+textarea+'</div>';
    $('.smsg').remove();

    if(delay==1){
		  $(out).css({'marginTop':'-10px','opacity':'0'}).prependTo('#systemMessage').animate({
   			marginTop: "0px",
        opacity:1
  	  }, 200).delay(4000).fadeOut(200, function(){
        $(this).remove();
      });
    }else{
      $(out).css({'marginTop':'-10px','opacity':'0'}).prependTo('#systemMessage').animate({
        marginTop: "0px",
        opacity:1
      }, 200);
    }
	},
  messageOut: function(it){
    $(it).stop().fadeOut(200, function(){
      $(this).remove();
    });
    return true;
  },
  errorType: function(code){
    var errorText = 'Что-то пошло не так...'; 
    switch(code){
    case 451:
      errorText = 'Ошибка данных';
              break;
        case 455:
      errorText = 'Некорректный e-mail';
              break;
            case 453:
      errorText = 'Некорректный пароль';
              break
            case 471:
      errorText = 'Никнейм занят';
              break
            case 472:
      errorText = 'Введенный логин уже существует';
              break
            case 473:
      errorText = 'Введенный e-mail уже существует';
              break
            case 452:
      errorText = 'Некорректный Логин!';
              break
    }
    return errorText;
  },
	datetime: function(date){
    var now = new Date();
		var date = new Date(date*1000);
 	 	var diff = new Date() - date; // разница в миллисекундах

 	 	var sec = Math.floor( diff / 1000 ); //округляем до секунд
   		var min = Math.floor( diff / 1000 / 60); //округляем до мину
   		var hour = Math.floor( diff / 1000 / 60 / 60); //округляем до часов
   		var days = diff / 1000 / 60 / 60 /24; //округляем до дней

   		var months = ['янв','фев','мрт','апр','май','июн','июл','авг','сен','окт','нбр','дек'];

		  if (sec < 60) {
    		return 'только что';
  		}else if (min < 60) {
    		return min + ' мин.';		
  		}else if (hour <= 10){
  			return hour + ' час.';
  		}else if(hour>10 && hour<=24 && now.getDate() == date.getDate()){
   			return "Сегодня"; //+ system.addZero(date.getHours())+":"+system.addZero(date.getMinutes());
   		}else if(now.getDate() - date.getDate() == 1){
   			return "Вчера"; //+ system.addZero(date.getHours())+":"+system.addZero(date.getMinutes());
   		}else{
   			//Обычный вид старой даты
  			return date.getDate()+" "+months[date.getMonth()]; //+date.getFullYear()+" в "+system.addZero(date.getHours())+":"+system.addZero(date.getMinutes());
		    //return sec+"-"+min+"-"+hour+"-"+days;
      }  	
  },
  onlineIco: function(date){
    var now = new Date();
    var date = new Date(date*1000);
    var diff = new Date() - date; // разница в миллисекундах

    var sec = Math.floor( diff / 1000 ); //округляем до секунд
    var min = Math.floor( diff / 1000 / 60); //округляем до мину

      if (min < 10) {
        return '<div class="onlineIco"></div>';
      }else {
        //Обычный вид старой даты
        return '';
        //return sec+"-"+min+"-"+hour+"-"+days;
      }   
  },
  onlineText: function(date){
    var now = new Date();
    var date = new Date(date*1000);
    var diff = new Date() - date; // разница в миллисекундах

    var sec = Math.floor( diff / 1000 ); //округляем до секунд
      var min = Math.floor( diff / 1000 / 60); //округляем до мину
      var hour = Math.floor( diff / 1000 / 60 / 60); //округляем до часов
      var days = diff / 1000 / 60 / 60 /24; //округляем до дней

      var months = ['янв','фев','мрт','апр','май','июн','июл','авг','сен','окт','нбр','дек'];

      if (min < 10) {
        return '';
      }else if (min < 60) {
        return 'Видели ' + min + ' мин. назад';   
      }else if (hour <= 10){
        return 'Видели ' + hour + ' час. назад';
      }else if(hour>10 && hour<=24 && now.getDate() == date.getDate()){
        return "Видели сегодня в "+ system.addZero(date.getHours())+":"+system.addZero(date.getMinutes());
      }else if(now.getDate() - date.getDate() == 1){
        return "Видели вчера в "+ system.addZero(date.getHours())+":"+system.addZero(date.getMinutes());
      }else{
        //Обычный вид старой даты
        return date.getDate()+" "+months[date.getMonth()]+" "+date.getFullYear()+" в "+system.addZero(date.getHours())+":"+system.addZero(date.getMinutes());
        //return sec+"-"+min+"-"+hour+"-"+days;
      }   
  },
  addZero: function(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
  },
  onlytime: function(date){
    var date = new Date(date);
    //Обычный вид старой даты
    return date.getHours()+":"+date.getMinutes();
    //return sec+"-"+min+"-"+hour+"-"+days;
  },
  texthash: function(inputText){
   var replacedText, reg;
    
   link = /#([a-zA-Zа-яА-Я0-9_]+)/g;
   var replacedText = (inputText || '').replace(link,
      function () { 
        var matches = Array.prototype.slice.apply(arguments),
            full = matches[0];
            return replacedText = "<a href='/'>"+full+"</a>";
        }
    );
    return replacedText;
  },
  textLink: function(text){
  var re = /([^\"=]{2}|^)((https?|ftp):\/\/\S+[^\s.,> )\];'\"!?])/; 
  var subst = '$1<a href="$2" target="_blank">$2</a>'; 
  var withlink = text.replace(re, subst);
  return withlink;
  },
  textFilter: function(inputText, num){
   var replacedText, reg;
   if(inputText == null || inputText == '' || inputText == "null"){
      replacedText = "";
   }else{
      if(num!=0){
        if(inputText.length>=num){
          replacedText = inputText.substr(0, num)+"...";
        }else{
          replacedText = inputText;
        }
      }else{
        replacedText = inputText;
      }
   }
   return replacedText;
  },
  loading: function(evt){
    if(evt){
        $('.aboutwhat .ico').addClass('sleep');
        $('#progressBar').show().stop().animate({'width':'50%'},2000,function(){
            $(this).stop().animate({'width':'98%'},15000);
        });
    }else{
        $('.aboutwhat .ico').removeClass('sleep');
        $('#progressBar').stop().animate({'width':'100%'},200,function(){
            $(this).hide().css({'width':'0%'});
        });
    }
  },
  textNumbers: function(number, titles){  
    cases = [2, 0, 1, 1, 1, 2];  
    return titles[ (number%100>4 && number%100<20)? 2 : cases[(number%10<5)?number%10:5] ];  
  },
  resizeArea: function(text_id){
     var area = document.getElementById(text_id);
     var nowt = area.value.split('\n');
     var area_hidden = document.getElementById(text_id + "_hidden");
     var text = '';

      $.each(nowt, function(s, opa) {
                console.log(opa);
        text = text + '<div>' + opa + '</div>'+"\n";
      })

     area_hidden.innerHTML = text;
     var height = area_hidden.offsetHeight;

     if(height>180){
      area.style.height = '200px';
     }else if(height<20){
      area.style.height = '20px';
     }else{
      area.style.height = height + 'px';
     }


     $('.pollCardTextCount').text(area.value.length);
     if(area.value.length>160){
        $('#'+text_id).val(area.value.substr(0, 160));
     }
  },
  textKilo: function(n,d){
    x=(''+n).length,p=Math.pow,d=p(10,d)
    x-=x%3
    return Math.round(n*d/p(10,x))/d+" тмGTPE"[x/3]
  }
}