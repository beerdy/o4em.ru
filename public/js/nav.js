﻿//НАВИГАЦИЯ
var nav = {
  page: function(data, link, action){
      //Разбиваем УРЛ на части, чтобы произвести навигацию
      var page_l = link.split("/");
      var subsubpage = decodeURI(page_l[3]);
      var subpage = page_l[2];
      var page_l = page_l[1];

      //Парсим джисон данные
      data = JSON.parse(data);

      console.log(data);

      //Основные переменные
      var content = data['content'];
      var title = "";
      var html = "";
      var back = ""; 
      var active = false;
      var subactive = false;

      //Объекты
      var objHeader  =  $('#header');

      if(data['action'] == 'auth_false'){
          objHeader.html("");
            switch(page_l){
              case 'login':
                    title = "Вход";
                    html = constructor.loginPage();
                 break;
              case 'signup':
                    title = "Регистрация";
                    html = constructor.signupPage();
                 break;
              case 'restore':
                    title = "Востановление пароля"; 
                    if(subpage){
                      html = constructor.restorePswrdConfirm(subpage, subsubpage);
                    }else{
                      html = constructor.restorePswrd();
                    }
                 break;
              default:
                    link = '/';
                    title = "o4em Вы?"; 
                    html = constructor.indexPage();
                 break;
          }
      }else{
          //Активируем основную панель (!лишь в случае, елси ее еще нет)
          if(objHeader.html() == ''){
            objHeader.html(constructor.headerBar());
          }
          switch(page_l){
            case 'profile':
                  title = "Редактировать";
                  html = constructor.userpageedit(content);
                  back = false;
              break;

            case 'mind': 
              if(subsubpage && subsubpage!='undefined'){
                title = "#"+subsubpage;
                html = constructor.pageMindsRandom(content, subsubpage);
                back = false;
              }else{
                if(subpage=="random"){
                  title = "Случайные мнения";
                  html = constructor.pageMindsRandom(content, false);
                  back = false;
                  active = 'aboutwhat';
                }else{
                  if(content){
                    title = content['u_m']['m_1']['m_text'];
                    html = constructor.pageMind(content['u_m']['m_1'], true);
                    back = true;
                  }else{
                    title = "Мнение удалено";
                    html = '<div class="nothing">Мнение удалено</div>';
                    back = true;
                  }
                }
              }
              break;

            case 'addmind':
                title = "Добавить мнение";
                html = constructor.pageAddMind();
                active = 'addmind';
                break;

            case 'notice': 
                title = "Уведомления";
                if(data['bool']){
                  html = constructor.pageNotice(content);
                }else{
                  html = '<div class="nothing">У Вас нет уведомлений</div>';
                }
                active = 'notice';
                $('.notice .count').remove();
              break;

            case 'people':
                title = "Пользователи";
                html = constructor.pageUsers(content);
                active = 'users';
              break;

            case 'followers': 
                if(content['u_im']){
                  back = false;
                }else{
                  back = true;
                }
                title = "Подписки";
                html = constructor.pageUser(content, 'followers');
                subactive = 'followers';
              break;

            case 'following': 
                if(content['u_im']){
                  back = false;
                }else{
                  back = true;
                }
                title = "Подписчики";
                html = constructor.pageUser(content, 'following');
                subactive = 'following';
              break;

            default:
              if(data['bool']){
                if(content['u_nickname']){
                  if(content['u_im']){
                    title = "Я";
                    back = false;
                    active = 'im';
                  }else{
                    title = content['u_name']+"@"+content['u_nickname'];
                    back = true;
                  }
                  link = '/'+content['u_nickname'];
                  html = constructor.pageUser(content, 'minds');
                  subactive = 'minds';
                }else{
                  html = "<div class='error404'>Вы свернули не туда... Страница не найдена!</div>";
                  title = "Ошибка";
                  back = false;
                }
              }else{
                html = "<div class='error404'>Вы свернули не туда... Страница не найдена!</div>";
                title = "Ошибка";
                back = false;
              }
          }
    }
    if(back && $('#pages').html() != ''){
        var top = $(window).scrollTop();
        $('.page').removeClass('new').addClass('old');

        $('.navBarBack').removeClass('new').addClass('old');
        $('.navBar').prepend('<div class="navBarBack new">'
                              +'<a class="navBarIteam back" onclick="actions.back(\''+location.pathname+'\', \''+$("title").text()+'\', '+top+');"><div class="ico"></div></a>'
                              +'<a class="navBarIteam aboutwhat" href="/mind/random" onclick="return nav.go(this)"><div class="ico"></div></a>'
                           +'</div>');

        $('#pages').append('<section class="page new">'+html+'</section>');
    }else{
        $('#pages').html('<section class="page new">'+html+'</section>');
        $('.navBarBack').remove();
        if(back){     
           $('.navBar').prepend('<div class="navBarBack new">'
                              +'<a class="navBarIteam back" onclick="nav.goto(\'/\');"><div class="ico"></div></a>'
                              +'<a class="navBarIteam aboutwhat" href="/mind/random" onclick="return nav.go(this)"><div class="ico"></div></a>'
                           +'</div>');
        }
    }

    $("title").text(title);

    if(subactive){
      $('.new .userPageStatistic a').removeClass('active');
      $('.new .userPageStatistic a#'+subactive).addClass('active');
    }
    if(active){
      $('.navBarIteam').removeClass('active');
      $('.navBarIteam.'+active).addClass('active');
    }

    if(action){
      $(window).scrollTop(0);
      window.history.pushState(title, title, link); 
      window.history.replaceState(title, title, link);
    }
  },
  goto: function(link) {
        var ju = new Object();
        ju['j'] = 2;
        ju['guid'] = window.guid;
        var jjj = JSON.stringify(ju);

        $.ajax({
          type: "POST",
          cache: false,
          data: jjj,
          url: link,
          success: function(data){
            system.loading(false);
            nav.page(data, link, true);
          },
          beforeSend: function(){
            system.loading(true);
          },
          error: function(data){
            system.loading(false);
            system.message('С нашим сервером что-то не так... попробуйте обновить страницу','error',1);
          }
        });
  },
  goback: function(link) {
       var ju = new Object();
        ju['j'] = 2;
        ju['guid'] = window.guid;
        var jjj = JSON.stringify(ju);

        $.ajax({
          type: "POST",
          cache: false,
          data: jjj,
          url: link,
          success: function(data){
            system.loading(false);
            nav.page(data, link, false);
          },
          beforeSend: function(){
            system.loading(true);
          },
          error: function(data){
            system.loading(false);
            system.message('С нашим сервером что-то не так... попробуйте обновить страницу','error',1);
          }
        });
    return false;
  },
  go: function(it) {
    var link = $(it).attr("href");
    nav.goto(link);
    return false;
  },
  img: function(it,action) {
     var link = $(it).attr("href");
     switch(action){
          case 'on': //Страница профиля
                $('body').append('<div id="overlay" onclick="return nav.img(this, \'off\')"><img src='+link+' class="photo"></div>');
                $('body').css({"overflow-y":"hidden"})
              break;
          case 'off': //Вопрос
                $('#overlay').remove();
                $('body').css({"overflow-y":"auto"})
              break;
      }
  
    return false;
  },
  checkUrl: function(){
    var hash = window.location.pathname;  //if no parameter is provided, use the hash value from the current address

    if(hash != o4em.lasturl) // if the hash value has changed
    {
        o4em.lasturl=hash; //update the current hash
        nav.goto(hash); // and load the new page
    }
  }
}