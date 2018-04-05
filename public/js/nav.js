//НАВИГАЦИЯ
var nav = {
  page: function(data, link){
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
                    html = constructor.indexPage(content);
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
              break;

            case 'feed': 
                if(subpage=="all"){
                  title = "Лента";
                  html = constructor.pageFeed(content, subpage, false);
                  active = 'aboutwhat';

                }else if(subpage=="hot"){
                  title = "Интересное";
                  html = constructor.pageFeed(content, subpage, false);
                  active = 'aboutwhat';

                }else if(subpage=="my"){
                  title = "Мое";
                  html = constructor.pageFeed(content, subpage, false);
                  active = 'aboutwhat';

                }else if(subpage=="search"){
                  title = "Поиск по тегу";
                  html = constructor.pageFeed(content, subpage, subsubpage);
                  active = 'aboutwhat';
                }
              break;

            case 'poll': 
                if(content){
                  title = content['u_m']['m_1']['m_text'];
                  html = constructor.pagePoll(content['u_m']['m_1'], true);
                }else{
                  title = "Мнение удалено";
                  html = '<div class="nothing">Мнение удалено</div>';
                }
              break;

            case 'minds': 
                if(content){
                  title = "Лента";
                  html = constructor.pageUser(content, 'minds');
                  subactive = 'minds';
                }
              break;

            case 'addpoll':
                title = "Добавить мнение";
                html = constructor.pageAddPoll();
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
                html = constructor.pageSearch(content);
                active = 'users';
              break;

            case 'followers': 
                title = "Подписки";
                html = constructor.pageUser(content, 'followers');
                subactive = 'followers';
              break;

            case 'following': 
                title = "Подписчики";
                html = constructor.pageUser(content, 'following');
                subactive = 'following';
              break;

            default:
              if(data['bool']){
                if(content['u_nickname']){
                  if(content['u_im']){
                    title = "Я";
                    active = 'im';
                  }else{
                    title = content['u_name']+"@"+content['u_nickname'];
                  }
                  link = '/'+content['u_nickname'];
                  html = constructor.pageUser(content, 'polls');
                  subactive = 'polls';
                }else{
                  html = "<div class='error404'>Вы свернули не туда... Страница не найдена!</div>";
                  title = "Ошибка";
                }
              }else{
                html = "<div class='error404'>Вы свернули не туда... Страница не найдена!</div>";
                title = "Ошибка";
              }
          }
    }
    return [html, title, active, subactive, link];
  },
  goto: function(link, back) {
        var pages = $('#pages');
        var navbar = $('.navBar');
        // back = refresh / back /none
        var ju = new Object();
        ju['j'] = 2;
        ju['guid'] = window.guid;
        if(back == 'refresh'){
          ju['refresh'] = true;
        }
        var jjj = JSON.stringify(ju);

        $.ajax({
          type: "POST",
          cache: false,
          data: jjj,
          url: link,
          success: function(data){
            system.loading(false);
            var out = nav.page(data, link, true);
            var html = out[0];
            var title = out[1];
            var active = out[2];
            var subactive = out[3];
                link = out[4];

            //скроллим наверх
            $(window).scrollTop(0);

            pages.addClass('animation');

            $("title").text(title);
            $('.active .pageBox').html(html);

            if(subactive){
              $('.active .userPageStatistic a').removeClass('active');
              $('.active .userPageStatistic a#'+subactive).addClass('active');
            }

            if(active){
              $('.navBarIteam').removeClass('active');
              $('.navBarIteam.'+active).addClass('active');
            }
            
            window.history.pushState(title, title, link); 
            window.history.replaceState(title, title, link);

            if(back == 'refresh'){
                //Генерируем айди вкладки
                window.guid = lp.guid_();

                //Запускаем ЛП
                lp.listen(true);
            }

            },
          beforeSend: function(){
              switch(back){
                    case 'overlay': 
                        pages.removeClass('animation');
                        navbar.prepend('<div class="navBarBoxBack">'
                              +'<a class="navBarIteam aboutwhat" href="/feed/all" onclick="return nav.go(this, \'page\')"><div class="ico"></div></a>'
                              +'<a class="navBarIteam close" onclick="return nav.back(\''+document.location.pathname+'\',\''+$("title").text()+'\',\''+$(window).scrollTop()+'\')"><div class="ico"></div></a>'
                            +'</div>');

                        $('.pageOver').removeClass('active').addClass('deactive');
                        $('.pageMain').removeClass('active').addClass('deactive');

                        pages.append('<section class="pageOver active"><div class="pageBox"></div></section>');
                        break;
                    case 'none': 

                        break;
                    default:
                        pages.removeClass('animation');
                        $('.navBarBoxBack').remove();
                        pages.html('<section class="pageMain active"><div class="pageBox"></div></section>');
                        break;
                }
              system.loading(true);
          },
          error: function(data){
              system.loading(false);
              system.message('С нашим сервером что-то не так... попробуйте обновить страницу','error',1);
          }
        });
  },
  go: function(it, back) {
      if ( sync.pop() ){
        var link = $(it).attr("href");
        nav.goto(link, back);
        sync.delay(500);
      }
    return false;
  },
  back: function(link, title, scroll){
    $("title").text(title);

    $('.pageOver.active').remove();
    $('.navBarBoxBack:first-child').remove();
    if($("section").is(".pageOver")){
      $('.pageOver:last-child').removeClass('deactive').addClass('active');
    }else{
      $('.pageMain').removeClass('deactive').addClass('active');
    }

    $(window).scrollTop(scroll);

    window.history.replaceState(title, title, link);

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
}