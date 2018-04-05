var constructor = {
	headerBar: function(){
	var html = '<nav class="navBar">'
					+'<div class="navBarBox">'
						+'<a class="navBarIteam im" href="/'+user.getCookie('u_nik')+'" onclick="return nav.go(this, \'page\')"><div class="ico"></div></a>'
						+'<a class="navBarIteam notice" href="/notice" onclick="return nav.go(this, \'page\')"><div class="ico"></div></a>'
						+'<a class="navBarIteam aboutwhat" href="/feed/all" onclick="return nav.go(this, \'page\')"><div class="ico"></div></a>'
						+'<a class="navBarIteam users" href="/people" onclick="return nav.go(this, \'page\')"><div class="ico"></div></a>'
						+'<a class="navBarIteam addmind" href="/addpoll" onclick="return nav.go(this, \'page\')"><div class="ico"></div></a>'
					+'</div>'
					+'<div class="navBarBorder"></div>'
			   +'</nav>'
	return html;
	},
	indexPage: function(content){
	var html = '<div class="indexPage">'
    /*+'<div class="background"></div>'
    +'<div class="table"></div>'
    +'<div class="indexHeader">'
        +'<div class="indexMenu">'
            +'<a href="/">О проекте</a><a href="/">Правила</a><a href="/">Помощь</a>'
        +'</div>'
        +'<a class="indexLogo" href="/" onclick="return nav.go(this, \'page\')"></a>'
    +'</div>'
    +'<div class="indexSlide1">'
        +'<div class="text">'
            +'<h1>Знакомьтесь, «O4EM»</h1>'
            +'<strong>Сервис, помогающий найти лучшие решения и ответы в любых вопросах. Создавай опросы, проводи исследования или делись собственным мнением.</strong>'
            +'<div class="indexAuthMenu">'
                +'<a href="/signup" onclick="return nav.go(this, \'page\')" class="reg submitBtn">Регистрируйся</a>'
                +'<a href="/login" onclick="return nav.go(this, \'page\')">Входи</a>'
            +'</div>' 
        +'</div>'
        +'<div class="info">'
            +'<div class="parallax_img">'
                +'<div class="table_left"></div>'
                +'<div class="table_right"></div>'
            +'</div>'
            +'<div class="statistik">'
            	+'<div class="s_col">'+system.textKilo(content['mind_count'],1)+'<small>'+system.textNumbers(content['mind_count'], ["опрос","опроса","опросов"])+'</small></div>'
            	+'<div class="s_col">'+system.textKilo(content['answer_count'],1)+'<small>'+system.textNumbers(content['answer_count'], ["ответ","ответа","ответов"])+'</small></div>'
            	+'<div class="s_col">'+system.textKilo(content['comment_count'],1)+'<small>'+system.textNumbers(content['comment_count'], ["комментарий","комментария","комментариев"])+'</small></div>'
            	+'<div class="s_col">'+system.textKilo(content['authn_count'],1)+'<small>'+system.textNumbers(content['authn_count'], ["пользователь","пользователя","пользователей"])+'</small></div>'
            +'</div>'
        +'</div>'
    +'</div>'
    +'<div class="indexSlide2">'
        +'<div class="text">'
            +'<h2>В любой непонятной ситуации создавай опрос :)</h2>'
            +'<em>это быстрый способ узнать мнения друзей</em>'
            +'<strong></strong>'
        +'</div>'
        +'<div class="iteamsPoll">';
                if(content['u_m']){
					$.each(content['u_m'], function(i, poll) {
						html += constructor.listPolls(poll);
					});
				  	
	            }

        html+='</div>'
    +'</div>'
    +'<div class="indexSlide3">'
         +'<h2>Не забывай про #хешьтеги</h2>'
         +'<div class="hashTags">'
             +'<a class="tag">#o4em</a> <a class="tag">#синий</a> <a class="tag">#любовь</a> <a class="tag">#россия</a> <a class="tag">#вечер</a> <a class="tag">#follow</a> <a class="tag">#amazing</a> <a class="tag">#оченьважно</a> <a class="tag">#дизайн</a> <a class="tag">#стиль</a> <a class="tag">#простовопрос</a> <a class="tag">#путешествие</a>'
         +'</div>'
    +'</div>'
    +'<div class="indexSlide4">'
        +'<a class="join submitBtn" href="/signup" onclick="return nav.go(this, \'page\')">Присоединяйся</a>'
    +'</div>'
    +'<div class="footer">'
        +'<div class="footerWrapper">'
            +'<a href="" class="logo"></a>'
            +'<div class="copy">2016 &copy; o4em.ru</div>'
        +'</div>'
    +'</div>' */
    +'</div>';
	return html;
	},
	loginPage: function(){
	var html = '<div class="indexPage">'
			    +'<div class="background"></div>'
			    +'<div class="indexHeader">'
			        +'<div class="indexMenu">'
			            +'<a href="/"></a><a href="/"></a><a href="/"></a>'
			        +'</div>'
			        +'<a class="indexLogo" href="/" onclick="return nav.go(this, \'page\')"></a>'
			    +'</div>'
				+'<div class="indexPageBox">'
					+'<a href="/" value="Войти через ВКонтакте" onclick="return user.signUserInVkontakte()" class="social vk">ВКОНТАКТЕ</a>'
					+'<h2 class="line"><span>- или -</span></h2>'
					+'<form action="loginPage" method="POST" enctype="multipart/form-data" onsubmit="return user.signUserIn(this)">'
						+'<input type="hidden" name="action" value="auth_login" style="display:none;"/>'
						+'<div class="inputBox"><input type="text" name="name" placeholder="E-mail/Логин" autocomplete="off"/></div>'
						+'<div class="inputBox"><input type="password" name="password" placeholder="Пароль" autocomplete="off"/></div>'
						+'<input type="submit" class="indexBtn" value="Войти" />'
					+'</form>'
					+'<div class="indexPageBoxBottom">'
						+'<a href="/restore" onclick="return nav.go(this, \'page\')">Забыли пароль?</a>'
					+'</div>'
				+'</div>';
				+'</div>';
	return html;
	},
	restorePswrd: function(){
	var html = 	'<div class="indexPage">'
			    +'<div class="background"></div>'
			    +'<div class="indexHeader">'
			        +'<div class="indexMenu">'
			            +'<a href="/"></a><a href="/"></a><a href="/"></a>'
			        +'</div>'
			        +'<a class="indexLogo" href="/" onclick="return nav.go(this, \'page\')"></a>'
			    +'</div>'
				+'<div class="indexPageBox">'
					+'<form action="authn" method="POST" enctype="multipart/form-data" onsubmit="return user.signUserRestore(this)">'
						+'<input type="hidden" name="action" value="auth_restore" style="display:none;"/>'
						+'<div class="inputBox"><input type="text" name="name" placeholder="Логин/E-mail"/>'
						+'Для восстановления пароля укажите ваш Логин или E-mail</div>'
						+'<input type="submit" class="indexBtn" value="Отправить" />'
					+'</form>'
					+'<div class="indexPageBoxBottom">'
						+'<a href="login" onclick="return nav.go(this, \'page\')">Вход</a> / <a href="/signup" onclick="return nav.go(this, \'page\')">Регистрация</a>'
					+'</div>'
				+'</div>'
				+'</div>';
	return html;
	},
	restorePswrdConfirm: function(code, name){
	var html = 	'<div class="indexPage">'
			    +'<div class="background"></div>'
			    +'<div class="indexHeader">'
			        +'<div class="indexMenu">'
			            +'<a href="/"></a><a href="/"></a><a href="/"></a>'
			        +'</div>'
			        +'<a class="indexLogo" href="/" onclick="return nav.go(this, \'page\')"></a>'
			    +'</div>'
				+'<div class="indexPageBox">'
					+'<form action="authn" method="POST" enctype="multipart/form-data" onsubmit="return user.signUserRestoreConfirm(this)">'
						+'<input type="hidden" name="action" value="restore_confirm" style="display:none;"/>'
						+'<input type="hidden" name="code" value="'+code+'" style="display:none;"/>'
						+'<input type="hidden" name="name" value="'+name+'" style="display:none;"/>'
						+'<div class="inputBox"><input type="text" name="password" placeholder="Новый пароль"/>'
						+'Введите новый пароль</div>'
						+'<input type="submit" class="indexBtn" value="Отправить" />'
					+'</form>'
				+'</div>'
				+'</div>';
	return html;
	},
	signupPage: function(){
	var html = '<div class="indexPage">'
			    +'<div class="background"></div>'
			    +'<div class="indexHeader">'
			        +'<div class="indexMenu">'
			            +'<a href="/"></a><a href="/"></a><a href="/"></a>'
			        +'</div>'
			        +'<a class="indexLogo" href="/" onclick="return nav.go(this, \'page\')"></a>'
			    +'</div>'
				+'<div class="indexPageBox">'
					+'<a href="/" value="Войти через ВКонтакте" onclick="return user.signUserInVkontakte()" class="social vk">ВКОНТАКТЕ</a>'
					+'<h2 class="line"><span>- или -</span></h2>'
					+'<a class="logoBig"></a>'
					+'<form action="sugnup" method="POST" enctype="multipart/form-data" onsubmit="return user.signUserReg(this)" autocomplete="off">'
						+'<div class="inputBox"><input type="text" name="regname" placeholder="Никнейм" class="formName" autocomplete="off"/>'
						+'Латинские буквы и цифры</div>'
						+'<div class="inputBox"><input type="text" name="regemail" placeholder="E-mail" class="formEmail" autocomplete="off"/>'
						+'Ваш E-mail</div>'
						+'<div class="inputBox"><input type="password" name="regpswrd" placeholder="Пароль" class="formPswrd" autocomplete="new-password"/>'
						+'Латинские буквы и цифры</div>'
						+'<input type="submit" class="indexBtn" value="Зарегистрироваться"/>'
						+'<div class="inputBox"><br>Регистрируясь, вы соглашаетесь с Условиями предоставления услуг и Политикой конфиденциальности, а также с Правилами использования файлов Cookie.</div>'
					+'</form>'
					+'<div class="indexPageBoxBottom">'
						+'Уже есть аккаунт? <a href="/login" onclick="return nav.go(this, \'page\')">Войти</a>'
					+'</div>'
				+'</div>'
			+'</div>';
	return html;
	},
	//Страница пользователя
	pageUser: function(content, action){
	//u_id, u_name, u_nickname, u_photo, u_about, u_country, u_city, u_im, u_imfollow, u_m_count, u_c_count, u_following_count, u_followers_count, u_last_time
	var sub_html = '';
	var more='';
	var location = '';
	var follow = '';
	var avatar = '';
	var need_last = '';
	var male = '';


	   switch(action){
            case 'polls':
            	if(content['u_m']){
					$.each(content['u_m'], function(i, poll) {
						sub_html += constructor.listPolls(poll);
					});
				  	
					if(!content['u_m_this_minds_last']){
					    more = '<a onclick="return poll.more(\''+content['u_id']+'\', \''+content['u_m']['m_12']['m_id']+'\')" class="more">еще</a>';
					}
	            }else{
	            	if(action=="polls" && content['u_im']){
						polls = "<div class='nothing'>У вас еще нет опросов, но Вы можете их <a href=\"/addpoll\" onclick=\"return nav.go(this, 'page')\">Добавить</a></div>";
					}else{
						polls = "<div class='nothing'>Ничего нет</div>";
					}
	            }
	            break;
			case 'minds':
				if(content['u_m']){
					$.each(content['u_m'], function(i, poll) {
						sub_html += constructor.listPolls(poll);
					});

					if(!content['u_m_this_minds_last']){
					    more = '<a onclick="return f_mind.more(\''+content['u_id']+'\', \''+content['f_last_part']+'\', \''+content['f_last_position']+'\')" class="more">еще</a>';
					}
				}else{
					
					sub_html = "<div class='nothing'>Ничего нет</div>";
				
	            }
				break;
			default:
				if(content['f']){

					$.each(content['f'], function(i, user) {
						sub_html += constructor.listUsers(user);
					});

					if(!content['f_last']){
				   		more = '<a onclick="return actions.loadUsers(\''+content['u_id']+'\', '+content['f_last_part']+', '+content['f_last_position']+', \''+action+'\')" class="more">еще</a>';
					}

				}else{
					
					sub_html = "<div class='nothing'>Ничего нет</div>";

				}
				break;
       }


	if(content['u_country'] && content['u_country']!="" && content['u_country']!="null" && content['u_city'] && content['u_city']!="" && content['u_city']!="null"){
		location = ", ";
	}
	if(!content['u_im']){
		if(content['u_imfollow']){
			follow = '<a class="unfollow" title="Отписаться" onclick="return user.unfollow(this, \''+content['u_id']+'\')">отписаться</a>';
		}else{
			follow = '<a class="follow" title="Подписаться" onclick="return user.follow(this, \''+content['u_id']+'\')">подписаться</a>';
		}
			follow += '<a class="wink" title="Подмигнуть" onclick="return user.wink(this, \''+content['u_id']+'\')">подмигнуть</a>';
	}else{
		follow = '<a href="/profile" onclick="return nav.go(this, \'none\')" class="settings" title="Настройки">настройки</a><a onclick="return user.logout(this)" class="logout" title="Выход">выход</a>';
	}

	if(content['u_photo']){
		avatar = '<a href="/'+content['u_photo']+'_o800.jpg" onclick="return nav.img(this, \'on\')"><img src="/'+content['u_photo']+'_r100x100.jpg" width="100" height="100" title="'+content['u_name']+'" alt="'+content['u_name']+'"/></a>';
	}else{
		avatar = '<img src="/public/img/ico-online.png" width="100" height="100" title="нет фото" alt="нет фото" class="avatar"/>';
	}

	if(content['u_male'] == 'null' || content['u_male'] == null){
		content['u_male'] = '';
	}

	var html='<div class="userPageInfo">'
			//+'<div class="userPageBg" style="background-image:url(\''+content['u_photo']+'_o800.jpg\');"></div>'
				+'<div class="userPagePhoto">'
					+avatar
					+system.onlineIco(content['u_last_time'])
				+'</div>'
				//+'<div class="onlineText">'+system.onlineText(content['u_last_time'])+'</div>'
				+'<h2 class="userPageName">'+content['u_name']+'</h1>'
				+'<div class="userPageNickname">@'+content['u_nickname']+'</div>'
				+'<div class="userPageAge '+content['u_male']+'" >';

				if(content['u_age']!=0 && content['u_age']!=null && content['u_age']!= 'null'){
					if (content['u_age'].match(/^[-\+]?\d+/) === null) {}else{

				html+=content['u_age']+' '+system.textNumbers(content['u_age'], ["год","года","лет"]);

					}
				}

		   html+='</div>';

		   		if(content['u_about'] && content['u_about']!=''){
		   html+='<div class="userPageDescription">'+system.textFilter(content['u_about'], 0)+'</div>';
				}

		   html+='<div class="userPageLocation">'+system.textFilter(content['u_country'], 0)+location+system.textFilter(content['u_city'], 0)+'</div>'
				+'<div class="userPageLastTime">'+system.onlineText(content['u_last_time'])+"</div>"
				+'<div class="userPageButtons">'+follow+'</div>'
				+'<div class="userPageStatistic">'
					+'<div class="userPageStatisticBox">'
						+'<a href="/'+content['u_nickname']+'" id="polls" class="active" onclick="return nav.go(this, \'none\')"><span>'+content['u_m_count']+'</span> '+system.textNumbers(content['u_m_count'], ["опрос","опроса","опросов"])+'</a>'
						+'<a href="/minds/'+content['u_nickname']+'" id="minds" onclick="return nav.go(this, \'none\')"><span>'+content['u_field_c']+'</span> '+system.textNumbers(content['u_m_count'], ["мнение","мнения","мнений"])+'</a>'
						+'<a href="/followers/'+content['u_nickname']+'" id="followers" onclick="return nav.go(this, \'none\')"><span>'+content['u_followers_c']+'</span> '+system.textNumbers(content['u_followers_c'], ["подписчик","подписчика","подписчиков"])+'</a>'
						+'<a href="/following/'+content['u_nickname']+'" id="following" onclick="return nav.go(this, \'none\')"><span>'+content['u_following_c']+'</span> '+system.textNumbers(content['u_following_c'], ["подписка","подписки","подписок"])+'</a>'
					+'</div>'
				+'</div>'
			+'</div>'
			+'<div class="userPolls">'
				+'<div class="iteamsPoll">'+sub_html+'</div>'
				+more
			+'</div>';
	return html;
	},
	//Страница редактирования
	userpageedit: function(content){
	//u_id, u_name, u_nickname, u_photo, u_about, u_country, u_city, u_im
	if(content['u_photo']){
   		ava = "/"+content['u_photo']+"_r100x100.jpg";
   	}else{
   		ava = "/public/img/ico-online.png";
   	}

   	if(content['u_about']==null || content['u_about'] == 'null'){
   		content['u_about'] = "";
   	}
   	if(content['u_city']==null || content['u_city'] == 'null'){
   		content['u_city'] = "";
   	}
   	if(content['u_male']==null || content['u_male'] == 'null'){
   		content['u_male'] = "";
   	}
   	if(content['u_age']==null || content['u_age'] == 'null'){
   		content['u_age'] = "";
   	}
   	if(content['u_social']['vk']==null || content['u_social']['vk'] == 'null'){
   		content['u_social']['vk'] = "";
   	}
   	if(content['u_social']['instagramm']==null || content['u_social']['instagramm'] == 'null'){
   		content['u_social']['instagramm'] = "";
   	}
   	if(content['u_social']['twitter']==null || content['u_social']['twitter'] == 'null'){
   		content['u_social']['twitter'] = "";
   	}

   	if(content['u_male']=='male'){var active1="selected";}else if(content['u_male']=='female'){var active2="selected";}

	var html='<div class="userPageSettings">'
		+'<div class="settingsBox">'
			+'<div class="userPagePhoto">'
	    		+'<input type="file" class="userPageUpload" name="the-file1" onchange="return user.uploadUserAvaPreview(this)">'
				//+'<iframe name="upload_img" style="display: none"></iframe>'
				+'<img src="'+ava+'" width="100" title="'+content['u_name']+'" alt="'+content['u_name']+'" class="userPhotoPreview"/>'
			+'</div>'
			+'<input class="editBtn" type="submit" value="Cохранить" onclick="return user.uploadUserAva(this)">'
		+'</div>'
		+'<div class="settingsBox">'
			+'<div class="inputHeader">Основная информация:</div>'
			+'<div class="inputBox"><label>Имя:</label><input class="userPageName" id="namemy_ed" type="text" value="'+content['u_name']+'"></div>'
			+'<div class="inputBox"><label>Возраст:</label><input id="age_ed" type="text" value="'+content['u_age']+'"></div>'
			+'<div class="inputBox"><label>Пол:</label>'
				+'<select name="male_ed" id="male_ed">'
				    +'<option value="male" '+active1+'>Мужской</option>'
				    +'<option value="female" '+active2+'>Женский</option>'
	   			+'</select>'
			+'</div>'
			+'<div class="inputBox"><label>Описание:</label><textarea id="aboutmy_ed" type="text">'+content['u_about']+'</textarea></div>'
			+'<div class="inputBox"><label>Страна:</label><input id="countrymy_ed" type="text" value="'+content['u_country']+'"></div>'
			+'<div class="inputBox"><label>Город:</label><input id="citymy_ed" type="text" value="'+content['u_city']+'"></div>'


			+'<div class="inputBox"><label>Вконтакте:</label><input id="vk_social_ed" type="text" value="'+content['u_social']['vk']+'"></div>'
			+'<div class="inputBox"><label>Инстаграмм:</label><input id="instagramm_social_ed" type="text" value="'+content['u_social']['instagramm']+'"></div>'
			+'<div class="inputBox"><label>Твиттер:</label><input id="twitter_social_ed" type="text" value="'+content['u_social']['twitter']+'"></div>'
			+'<input class="editBtn" type="submit" value="Cохранить" onclick="return user.saveprofile(this)">'
		+'</div>'
		+'<div class="settingsBox">'
			+'<div class="inputHeader">Смена пароля:</div>'
			+'<div class="inputBox"><label>Логин:</label><input  type="text" value="'+content['u_nickname']+'" readonly></div>'
			+'<div class="inputBox"><label>Новый пароль:</label><input id="pswrd1" type="password" value=""></div>'
			+'<div class="inputBox"><label>Повторите пароль:</label><input id="pswrd2" type="password" value=""></div>'
			+'<input class="editBtn" type="submit" value="Изменить" onclick="return user.editpswrd(this)">'
		+'</div>'
		+'<div class="settingsBox">'
			+'<div class="inputHeader">Если сбились счетчики:</div>'
			+'<div class="inputBox">Что нужно пересчитать?<select id="agregate">'
				+'<option value="agregate_follows">Количество подписчиков</option>'
				+'<option value="agregate_minds">Количество мнений</option>'
				+'<option value="agregate_comments">Количество комментариев мнения</option>'
				+'<option value="agregate_mind_liks_disliks">Количество согласен/несогласен с мнением</option>'
			+'</select></div>' 
			+'<div class="inputBox">Оставьте пустым, <input type="text" id="agregateId" placeholder="ID мнения"/></div>'
			+'<input type="button" value="Подсчитать" id="agregatebBtn" class="editBtn" onclick="return actions.agregate()"/>'
		+'</div>'
	+'</div>'
	+'</div>';
	return html;
	},
	pageSearch: function(content){
		var users = '';
		if(content){
			$.each(content['u_top_minder'], function(i, user) {
				users += constructor.listUsers(user);
			});
		}else{
			users = '<div class="nothing">Ничего нет</div>';
		}

		var html = '<div class="feedMenu">'
					+'<div class="searchInput">'
						+'<div class="searchInputBox">'
							+'<input class="searchInputText" type="text" value="" placeholder="Поиск пользователей" autocomplete="off"/>'
							+'<input class="searchInputBtn" type="submit" onclick="return actions.searchUsers(this, false)" value="Поиск">'
					  	+'</div>'
					+'</div>'
				  	+'<div class="feedMenuBox">'
					  	+'<a href="/people" id="all" class="active" onclick="return nav.go(this, \'none\')">Пользователи</a>'
				  	+'</div>'
				  +'</div>'
				  +'<div class="feedBox">'
					  +'<div class="feedIteams">'
							+users
			    	  +'</div>'
			       +'</div>';

		return html;
	},
	//Список пользователей
	listUsers: function(content){
	//u_id, u_name, u_nickname, u_photo, u_about, u_country, u_city, u_im, u_imfollow, u_m_count, u_c_count, u_following_count, u_followers_count, u_last_time
	var u_photo;
	if(content['u_photo']){
		u_photo = content['u_photo']+"_r100x100.jpg";
	}else{
		u_photo = "public/img/ico-online.png";
	}

		var html = '<a class="iteamUser" id="id'+content['u_id']+'" href="/'+content['u_nickname']+'" onclick="return nav.go(this, \'overlay\')">'
							+'<div class="avatar">'
					 			+'<img src="/'+u_photo+'"/>'
					 			+system.onlineIco(content['u_last_time'])
					 		+'</div>'
					 		+'<div class="name">'+system.textFilter(content['u_name'], 14)+'</div>'
					 		+'<div class="nick">@'+system.textFilter(content['u_nickname'], 14)+'</div>'
			 	  +"</a>";
		return html;
	},
	pageNotice: function(content){
		var more = '';
		var html = '';
		if(content['n_this_notices_last']!=true){
			more = '<a onclick="return actions.loadNotice('+content['n_last_part']+', '+content['n_last_position']+')" class="more">еще</a>';
		}
        $.each(content['n'], function(i, notice) {
          html += constructor.listNotice(notice);
        });

        html = html+more;
        return html;
	},
	//Список уведомлений
	listNotice: function(content){
	//u_id, u_name, u_nickname, u_photo, u_last_time, n_action, n_text, n_time
		if(content){
	        var n_text = "";
	        var n_time = "";
	        var n_action = "";
	        var n_background = "";
	        var n_link = "";
	        switch(content['action']){
	            case 'comment_add': 
	                n_text = 'Оставил комментарий к <a href="/poll/'+content['m_id']+'" onclick="return nav.go(this, \'overlay\')">'+content['m_text']+'</a>: <span>'+content['c_text']+'</span>';
	                n_time = content['c_time'];
	                n_action = 'st04';
	                n_background = '/public/img/upload/'+content['m_u_id']+'/mind/'+content['m_id']+'_0_r200x200.jpg';
	                n_link = '<a href="/poll/'+content['m_id']+'" onclick="return nav.go(this, \'overlay\')" class="noticeTypeBg"></a>';
	              break;
	            case 'follow': 
	                n_text = 'Подписался';
	                n_time = content['f_time'];
	                n_action = 'st05';
	               	n_background = '';
	                n_link = '<a href="/'+content['u_nickname']+'" onclick="return nav.go(this, \'overlay\')" class="noticeTypeBg"></a>';
	              break;
	            case 'follow_remove': 
	                n_text = 'Отписался';
	                n_time = content['f_time'];
	                n_action = 'st06';
	                n_background = '';
	                n_link = '<a href="/'+content['u_nickname']+'" onclick="return nav.go(this, \'overlay\')" class="noticeTypeBg"></a>';
	              break;
	            case 'hi_man':
	   	            n_text = 'Вам подмигнул <a href="/'+content['u_nickname']+'" onclick="return nav.go(this, \'overlay\')">'+content['u_name']+'</a>';
	                n_action = 'st07';
	                n_time = content['m_time'];
	                n_background = '';
	                n_link = '<a href="/'+content['u_nickname']+'" onclick="return nav.go(this, \'overlay\')" class="noticeTypeBg"></a>';
	              break;
	            case 'field_add':
	   	            n_text = 'Оставил мнение к <a href="/poll/'+content['m_id']+'" onclick="return nav.go(this, \'overlay\')">'+content['m_text']+'</a>: <span class="pollLine">'+content['f_text']+'</span>';
	                n_action = 'st08';
	                n_time = content['f_time'];
	                n_background = '/public/img/upload/'+content['m_u_id']+'/mind/'+content['m_id']+'_0_r200x200.jpg';
	                n_link = '<a href="/poll/'+content['m_id']+'" onclick="return nav.go(this, \'overlay\')" class="noticeTypeBg"></a>';
	              break;
	        }
	    }
	    var ava;
	   	if(content['u_photo']){
	   		ava = "<img src='/"+content['u_photo']+"_r40x40.jpg' width='40' title='' alt=''/>";
	   	}else{
	   		ava = "<img src='/public/img/ico-online.png' width='40' title='' alt=''/>";
	   	}

        var date = new Date(content['n_time']*1000);
 	 	var diff = new Date() - date; // разница в миллисекундах
   		var hour = Math.floor( diff / 1000 / 60 / 60); //округляем до часов
   		var update = "";
   		if(hour<1){ var update = " need_update"}

		var html = "<div class='noticeIteam "+n_action+"'>"
						+'<div class="noticeType" style="background-image:url(\''+n_background+'\');">'+n_link+'</div>'
						+"<div class='noticeContent'>"
		 					+"<div class='avatar'>"+ava+system.onlineIco(content['u_last_time'])+"</div>"
							+'<a href="/'+content['u_nickname']+'" onclick="return nav.go(this, \'overlay\')" class="userName">'+content['u_name']+'</a>'
							+"<div class='noticeText'>"
		 						+n_text
		 					+"</div>"
			 			+'</div>'
			 			+"<div class='noticeTime' time='"+n_time+"'>"+system.datetime(n_time)+"</div>"
			 		+"</div>";
		return html;
	
	},
	//Конструктор страницы вопроса
	pagePoll: function(content){
	//m_id, u_name, u_nickname, u_photo, u_id, m_time, m_unixtime, u_last_time, m_tags, m_my_yes_no, m_text, m_yes_count, m_no_count, m_mymind, m_c_count, m_status
	var date = new Date(content['m_time']*1000);
 	var diff = new Date() - date; // разница в миллисекундах
   	var hour = Math.floor( diff / 1000 / 60 / 60); //округляем до часов
   	var update = "";

   	if(hour<1){ var update = " need_update";}

   	var ava ="";
   	if(content['m_user']['u_photo']){
   		ava = "<img src='/"+content['m_user']['u_photo']+"_r40x40.jpg' width='40' title='' alt=''/>";
   	}else{
   		ava = "<img src='/public/img/ico-online.png' width='40' title='' alt='' class='avatar'/>";
   	}
	
	var hashes = "";
	if(content['m_tags']){
		for(i=0; i<content['m_tags'].length; i++)
   		hashes += '<a onclick="return nav.go(this, \'page\')" href="/feed/search/'+content['m_tags'][i].replace("#","")+'" class="tag">'+content['m_tags'][i]+'</a>'; 
    }

    var plus = "";
    var minus = "";
    if(content['m_my_yes_no'] == 1){
    	plus = "my";
    }else if(content['m_my_yes_no'] == 2){
    	minus = "my";
    }

	var  html_comments = '';
    var more = '';
    var del;
    if(content['m_comments']['c']){
	    $.each(content['m_comments']['c'], function(i, comment) {
	      if(content['m_user']['u_im'] || comment['u_im']){
	      	del = true;
    	  }else{
    	  	del = false;
    	  }
	      html_comments += constructor.listComments(content['m_id'], comment, del); 
	    });
		if(content['m_comments']['c_this_comments_last']!=true){
			more = '<a onclick="return actions.loadComments(\''+content['m_id']+'\', '+content['m_comments']['c_last_part']+', '+content['m_comments']['c_last_position']+', '+content['m_user']['u_im']+')" class="more">еще</a>';
		}
    }

    var html_online = '';
    var onlint_c = 0;
	$.each(content['m_online'], function(i, online) {
		var ava ="";
		if(online['u_photo']){
			ava = "<img src='/"+online['u_photo']+"_r40x40.jpg' width='40' title='' alt=''/>";
		}else{
			ava = "<img src='/public/img/ico-online.png' width='40' title='' alt=''/>";
		}
		if(online['u_im']){
			html_online += '<a href="/'+online['u_nickname']+'" onclick="return nav.go(this, \'page\')" class="pollCardOnlineIteam">'+ava+'<span></span></a>';
		}else{
			html_online += '<a href="/'+online['u_nickname']+'" onclick="return nav.go(this, \'overlay\')" class="pollCardOnlineIteam">'+ava+'<span></span></a>';
		}
      	onlint_c++;
    });

    var canDel="";
   	if(content['m_user']['u_im']){
   		canDel = "<div class='delMind' onclick='return actions.delPoll(\""+content['m_id']+"\", \""+content['m_user']['u_nickname']+"\")'></div>";
   	}

	var mind = '<div class="pollCard">'
					+'<div class="pollCardHeader">'
						+'<div class="pollCardHeaderUser">'
							+'<div class="userAvatar">'
								+ava
								+system.onlineIco(content['m_user']['u_last_time'])
							+'</div>';
							if(content['m_user']['u_im']){
								mind += '<a href="/'+content['m_user']['u_nickname']+'" onclick="return nav.go(this, \'page\')" class="userName">'+content['m_user']['u_name']+'</a>';
							}else{
								mind += '<a href="/'+content['m_user']['u_nickname']+'" onclick="return nav.go(this, \'overlay\')" class="userName">'+content['m_user']['u_name']+'</a>';
							}
					mind+='</div>'
						+'<div class="pollCardHeaderTime'+update+'" time="'+content['m_time']+'">'+system.datetime(content['m_time'])+'</div>'
					+'</div>'
					+'<div class="pollCardImg">'
						+'<img src="/public/img/upload/'+content['m_u_id']+'/mind/'+content['m_id']+'_0_r400x400.jpg"/>'
						+'<div class="pollCardText"><span>'+system.textLink(content['m_text'])+'</span></div>'
					+'</div>'
					+'<div class="pollCardContent">'
						+'<div class="pollCardBox lines">'
							+'<div class="boxHeader">'
								+'<div class="boxCount">'+content['m_fields_c']+'</div>'
								+'<div class="boxHide">скрыть</div>'
							+'</div>'
							+'<div class="boxContent">'
								+'<div class="pollCardLines">';

				                    $.each(content['m_fields'], function(i, poll) {
				                    	var p, percent, check;

				                    	if(content['m_my_field']==i){
				                    		check = ' checked';
				                    	}else{
				                    		check = '';
				                    	}

				                    	if(poll['count']!=null && poll['count']!=0){
	                    					percent = String(Math.round(poll['count']*100/content['m_fields_c']));
	                    				}else{
	                    					percent = '0';
	                    				}
					                    
										if(String(percent).length == 3){
					                    	p = '9';
					                    }else if(String(percent).length == 2){
					                    	p = percent[0];
					                    }else{
					                    	p = '0';
					                    }

								mind += '<div class="pollLine p'+p+check+'" id="'+i+'" onclick="return poll.vote(\''+content['m_id']+'\', \''+i+'\')">'
			                              +'<div class="linePercent" style="width:'+percent+'%;"></div>'
			                              +'<div class="lineText"><span>'+poll['title']+'</span></div>'
			                              +'<div class="lineTextP">'+percent+'%</div>'
			                           +'</div>';
		                    		});

		                   mind += '</div>'
							+'</div>'
						+'</div>'
						+'<div class="pollCardTags">'
							+hashes
						+'</div>'
						+'<div class="pollCardBox online">'
							+'<div class="boxHeader">'
								+'<div class="boxCount">'+onlint_c+'</div>'
								+'<div class="boxHide">скрыть</div>'
							+'</div>'
							+'<div class="boxContent">'
								+html_online
							+'</div>'
						+'</div>'
					+'</div>'
					+'<div class="pollCardComments iteam" id="comments">'
						+'<div class="commentInput">'
							+'<form action="" onsubmit="return comment.add(this, \''+content['m_id']+'\')">'
						  		+'<input type="text" class="commentInputText" onfocus="" onblur="" value="" placeholder="Ваш комментарий?"/>'
						   		+'<input type="submit" id="commentsend" class="commentInputBtn" value="Отправить" />'
						    +'</form>'
						+'</div>'
						+'<div class="mindComments">'
							+html_comments
							+more
						+'</div>'
			   		+'</div>';
		return mind;
	},
	pageFeed: function(content, subpage, subsubpage){
	var minds = "";
	if(subsubpage){
		var value = "#"+subsubpage;
	}else{
		var value = "";
	}

	var tags = "";
	if(content){
		if(content['top_tags']){
			$.each(content['top_tags'], function(i, tag) {
				  tags +='<a onclick="return nav.go(this, \'page\')" href="/feed/search/'+tag.replace('#','')+'" class="tag">'+tag+'</a>';
			});
		}

		if(content['u_m']){
			$.each(content['u_m'], function(i, mind) {

				if(i=='m_3' && subpage=='all'){
				  minds +='<div class="feedTagsBox">'
		    	   			+'<h3>Популярные теги:</h3>'
		    	   			+tags
	    	   			+'</div>'
				}

				minds += constructor.listPolls(mind);
			});
		  	
			if(!content['u_m_this_minds_last']){
			    more = '<a onclick="return actions.loadPolls(\''+content['u_m']['m_12']['m_id']+'\', \''+subpage+'\')" class="more">еще</a>';
			}
		}
		if(content['n']){
			$.each(content['n'], function(i, notice) {
				minds += constructor.listPolls(notice['n_mind']);
			});
		  	
			if(!content['n_this_notices_last']){
			    more = '<a onclick="return actions.loadPolls(\''+content['u_m']['m_12']['m_id']+'\', \''+subpage+'\')" class="more">еще</a>';
			}
		}
	}else{
		minds = "Мнений с тегом '"+value+"' не найдено";
	}

	if(subpage=='all'){var active1="active";}else if(subpage=='hot'){var active2="active";}else if(subpage=='my'){var active3="active";}

		var html = '<div class="feedMenu">'
					+'<div class="searchInput">'
						+'<div class="searchInputBox">'
							+'<input class="searchInputText" type="text" value="'+value+'" placeholder="Поиск по тегу" autocomplete="off"/>'
							+'<input class="searchInputBtn" type="submit" onclick="return actions.searchPolls(this)" value="Поиск"/>'
					  	+'</div>'
					+'</div>'
				  	+'<div class="feedMenuBox">'
					  	+'<a href="/feed/all" id="all" class="'+active1+'" onclick="return nav.go(this, \'none\')">Всё</a>'
					  	+'<a href="/feed/hot" id="hot" class="'+active2+'" onclick="return nav.go(this, \'none\')">Интересное</a>'
					  	+'<a href="/feed/my" id="me" class="'+active3+'" onclick="return nav.go(this, \'none\')">Моё</a>'
				  	+'</div>'
				  +'</div>'
				  +'<div class="feedBox">'
					  +'<div class="feedIteams">'
							+minds
			    	  +'</div>'
			       +'</div>';

		return html;
	},
	pageAddPoll: function(){
	var html = '<h1>Где Вы сегодня бухаете?</h1><form class="pollCard" action="upload" target="upload_mind_img" method="POST" enctype="multipart/form-data" id="id_form_mind" onsubmit="return poll.add()">'
					+'<div class="pollCardHeaderEmpty"></div>'
					+'<div class="pollCardImg">'
						+'<img class="addPhotoPreview"/>'
						+'<div class="pollCardTextCount">0</div>'
						+'<div class="pollCardText">'
							+'<div class="addTextBox">'
								+'<div class="addText_hidden"><div class="textarea_behavior" id="addText_hidden"></div></div>'
								+'<textarea id="addText" class="addText" name="text" type="text" placeholder="Ваш вопрос" onkeyup="system.resizeArea(\'addText\');"></textarea>'
							+'</div>'
						+'</div>'
						+'<div class="addPhoto">'
							+'<input type="file" onchange="poll.addImgPreview(this)">'
							+'Добавить фото'	
						+'</div>'
					+'</div>'
					+'<div class="pollCardContent">'
						+'<div class="pollCardBox lines">'
							+'<div class="boxHeader">'
								+'<div class="boxCount">Варианты</div>'
							+'</div>'
							+'<div class="boxContent">'
								+'<div class="pollCardLines">'
									+'<input class="pollRow" id="pollRow_1" name="text" type="text" />'
									+'<input class="pollRow" id="pollRow_2" name="text" type="text" />'
				       				+'<div class="addLine" onclick="return poll.addLine();">+ Добавить вариант</div>'
		                		+'</div>'
							+'</div>'
						+'</div>'
						+'<div class="pollCardBox addBtn">'
							+'<div class="boxContent">'
				       			+'<input class="addPollBtn" id="questionbtn" type="submit" value="Создать опрос"/>'
							+'</div>'
						+'</div>'
					+'</div>'
				+'</form>';
	return html;

	},
	//Конструктор
	listPolls: function(content){
	//m_id, m_u_id, m_time, m_unixtime, m_tags, m_text, m_yes_coun, m_no_coun, m_status
	var date = new Date(content['m_unixtime']*1000);
 	var diff = new Date() - date; // разница в миллисекундах
   	var hour = Math.floor( diff / 1000 / 60 / 60); //округляем до часов
   	var update = "";
   	if(hour<10){ var update = " need_update"}

   	var ava, username;
   	if(content['m_user']){
	   	if(content['m_user']['u_photo']){
	   		ava = "<img src='/"+content['m_user']['u_photo']+"_r40x40.jpg' width='16' title='' alt=''/>";
	   	}else{
	   		ava = "<img src='/public/img/ico-online.png' width='16' title='' alt=''/>";
	   	}
	   	username = content['m_user']['u_name'];
   	}

		var html = '<div class="iteamPoll" id="id'+content['m_id']+'">'
					+'<a class="iteamPollBox" href="/poll/'+content['m_id']+'" onclick="return nav.go(this, \'overlay\')">'
		                +'<div class="iteamPollImg">'
		                    +'<img src="/public/img/upload/'+content['m_u_id']+'/mind/'+content['m_id']+'_0_r200x200.jpg" width="275"/>'
		                    +'<div class="iteamPollText"><span>'+system.textFilter(content['m_text'], 60)+'</span></div>'
		                +'</div>'
	              
	                    +'<div class="iteamPollLines">';

		                    $.each(content['m_fields'], function(i, poll) {
		                    	var p, percent;

		                    	if(poll['count']!=null && poll['count']!=0){
	            					percent = String(Math.round(poll['count']*100/content['m_fields_c']));
	            				}else{
	            					percent = '0';
	            				}

								if(String(percent).length == 3){
			                    	p = '9';
			                    }else if(String(percent).length == 2){
			                    	p = percent[0];
			                    }else{
			                    	p = '0';
			                    }

						 html += '<div class="pollLine p'+p+'" onclick="return poll.vote(\''+content['m_id']+'\', \''+i+'\')">'
	                              +'<div class="linePercent" style="width:'+percent+'%;"></div>'
	                              +'<div class="lineText"><span>'+poll['title']+'</span></div>'
	                              +'<div class="lineTextP">'+percent+'%</div>'
	                           +'</div>';
	                		});
	            html += '</div>'
	            		                	+'<div class="iteamPollMenu">'
								+'<span class="poll">'+content['m_fields_c']+'<i></i></span>'
								+'<span class="online">'+content['m_view_c']+'<i></i></span>'
								+'<span class="comments">'+content['m_c_count']+'<i></i></span>'
							+'</div>'
            		+'</a>'
            		+'<div class="iteamPollHeader">';
						if(content['m_user']){
							html += '<div class="iteamPollHeaderUser"><div class="userAvatar">'+ava+'</div><a class="userName" href="/'+content['m_user']['u_nickname']+'" onclick="return nav.go(this, \'overlay\')">'+username+'</a></div>'
						}

							html +='<div class="iteamPollHeaderTime'+update+'" time="'+content['m_time']+'">'+system.datetime(content['m_time'])+'</div>'
					+'</div>'
             +'</div>';
		return html;
	},
	listComments: function(m_id, content, canDel){
	//username, userid, userava, usernick, time, unixtime, endhop, text, myself
	var date = new Date(content['c_time']*1000);
 	var diff = new Date() - date; // разница в миллисекундах
   	var hour = Math.floor(diff / 1000 / 60 / 60); //округляем до часов
   	var update = "";
   	if(hour<10){ var update = " need_update"}

   	var page = "";	
   	if(content['u_im']){
   		page = "page";
   	}else{
   		page = "overlay";
   	}

   	if(content['u_photo']){
   		ava = "<img src='/"+content['u_photo']+"_r40x40.jpg' width='40' title='' alt=''/>";
   	}else{
   		ava = "<img src='/public/img/ico-online.png' width='40' title='' alt=''/>";
   	}
   	var del = "";
   	if(canDel){
   		var del = '<div class="iteamListDel" onclick="return actions.delComment(this, \''+m_id+'\', \''+content['c_id']+'\')"></div>';
   	}

   	var exp = /@([a-zA-Zа-яА-Я0-9_]+)/g;

	//Конструктор комментариев
	var html = "<div class='iteamList'>"
					+"<div class='iteamListLeft'>"
						+'<a href="/'+content['u_nickname']+'" onclick="return nav.go(this, \''+page+'\')" class="avatar">'
								+ava
								+system.onlineIco(content['u_last_time'])
						+"</a>"
					+"</div>"
					+"<div class='iteamListCenter'>"
		 				+'<div class="iteamListText">'
		 					+"<div class='userInfo'>"
								+'<a href="/'+content['u_nickname']+'" onclick="return comment.reply(this, \''+content['u_nickname']+'\')" class="userName">'+content['u_name']+'</a>'
							+"</div>"
		 					+content['c_text'].replace(exp, '<a onclick="return nav.go(this, \'overlay\')" href="/$1">@$1</a>')
		 				+'</div>'
		 				+del
		 			+'</div>'
		 			+"<div class='iteamListRight'>"
		 				+"<div class='time"+update+"' time='"+content['c_time']+"'>"+system.datetime(content['c_time'])+"</div>"
					+"</div>"
				+"</div>";
	return html;
	},
	photoEditor: function(){
		html = '<div class="photoEditor">'
			+'<div class="photoEditorCropper">'
				+'<div class="close" onclick="return cropper.close();"></div>'
				+'<div class="add" onclick="return cropper.imgCrop();">ок</div>'
					+'<div class="photoEditorActions">'
	        		+'<div class="actionsButton zoomIn" onclick="return cropper.zoomIn();"></div>'
	        		+'<div class="actionsButton zoomOut" onclick="return cropper.zoomOut();"></div>'
	        		+'<div class="actionsButton left" onclick="return cropper.rotate(\'left\');"></div>'
	        		+'<div class="actionsButton right" onclick="return cropper.rotate(\'right\');"></div>'
	        	+'</div>'
			+'</div>'	
		+'</div>';
		return html;
	}
}