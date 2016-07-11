var constructor = {
	headerBar: function(){
	var html =  '<div class="brandBar">'
					+'<div class="brandBarBox">'
						+'<div class="backBtn"></div>'
						+'<div class="h1Box"></div>'
						+'<div class="someBtn"></div>'
					+'</div>'
				+'</div>'
				+'<nav class="navBar">'
						+'<div class="navBarBox">'
							+'<a class="navBarIteam im" href="/'+user.getCookie('u_nik')+'" onclick="return nav.go(this)"><div class="ico"></div></a>'
							+'<a class="navBarIteam notice" href="/notice" onclick="return nav.go(this)"><div class="ico"></div></a>'
							+'<a class="navBarIteam aboutwhat" href="/mind/random" onclick="return nav.go(this)"><div class="ico"></div></a>'
							+'<a class="navBarIteam users" href="/people" onclick="return nav.go(this)"><div class="ico"></div></a>'
							+'<a class="navBarIteam addmind" href="/addmind" onclick="return nav.go(this)"><div class="ico"></div></a>'
						+'</div>'
			   +'</nav>'
			   +'<div class="headerMargin"></div>';
	return html;
	},
	indexPage: function(){
	var html = '<div class="indexPage">'
				+'<div class="indexPageBox">'
					+'<a class="logoBig"></a>'
					+'<h1>Выражай свое мнение,<br> каким бы оно ни было.</h1>'
					+'<div class="icoAll"></div>'
					+'<a href="/signup" class="indexBtn" onclick="return nav.go(this)" style="margin-top:20px;">Зарегистрироваться</a>'
					+'Уже есть аккаунт? <a href="/login" onclick="return nav.go(this)">Войти</a>'
				+'</div>'
			+'</div>';
	return html;
	},
	loginPage: function(){
	var html = '<div class="indexPage">'
				+'<div class="indexPageBox">'
					+'<a class="logoBig"></a>'
					+'<form action="authn" method="POST" enctype="multipart/form-data" onsubmit="return user.signUserIn(this)">'
						+'<input type="hidden" name="action" value="auth_login" style="display:none;"/>'
						+'<div class="inputBox"><input type="text" name="name" placeholder="E-mail/Логин" autocomplete="off"/></div>'
						+'<div class="inputBox"><input type="password" name="password" placeholder="Пароль" autocomplete="off"/></div>'
						+'<input type="submit" class="indexBtn" value="Войти" />'
						+'<a href="/signup" onclick="return nav.go(this)">Регистрация</a> / <a href="/restore" onclick="return nav.go(this)">Забыли пароль?</a>'
					+'</form>'
					+'<h2 class="line"><span>или через</span></h2>'
					+'<a href="/" value="Войти через ВКонтакте" onclick="return user.signUserInVkontakte()" class="social vk">ВКОНТАКТЕ</a>'
				+'</div>';
				+'</div>';
	return html;
	},
	restorePswrd: function(){
	var html = 	'<div class="indexPage">'
				+'<div class="indexPageBox">'
					+'<form action="authn" method="POST" enctype="multipart/form-data" onsubmit="return user.signUserRestore(this)">'
						+'<input type="hidden" name="action" value="auth_restore" style="display:none;"/>'
						+'<div class="inputBox"><input type="text" name="name" placeholder="Логин/E-mail"/>'
						+'Для восстановления пароля укажите ваш Логин или E-mail</div>'
						+'<input type="submit" class="indexBtn" value="Отправить" />'
					+'</form>'
				+'</div>'
				+'</div>';
	return html;
	},
	restorePswrdConfirm: function(code, name){
	var html = 	'<div class="indexPage">'
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
				+'<div class="indexPageBox">'
					+'<a class="logoBig"></a>'
					+'<div class="form sign">'
						+'<form method="POST" enctype="multipart/form-data" onsubmit="return user.signUserReg(this)">'
							+'<div class="inputBox"><input type="text" name="regname" placeholder="Имя" class="formName" autocomplete="off"/>'
							+'Ваше уникальное имя, может состоять только из латинских букв и цифр, при помощи которого Вы можете войти на свою страницу</div>'
							+'<div class="inputBox"><input type="text" name="regemail" placeholder="E-mail" class="formEmail" autocomplete="off"/>'
							+'Ваш E-mail. Используется для подтверждения регистрации</div>'
							+'<div class="inputBox"><input type="password" name="regpswrd" placeholder="Пароль" class="formPswrd" autocomplete="off"/>'
							+'Пароль должен состоять из латинских букв и цифр</div>'
							+'<input type="submit" class="indexBtn" value="Зарегистрироваться"/>'
							+'Уже есть аккаунт? <a href="/login" onclick="return nav.go(this)">Войти</a>'
						+'</form>'
					+'</div>'
				+'</div>'
			+'</div>';
	return html;
	},
	//Страница пользователя
	pageUser: function(content, action){
	//u_id, u_name, u_nickname, u_photo, u_about, u_country, u_city, u_im, u_imfollow, u_m_count, u_c_count, u_following_count, u_followers_count, u_last_time
	var minds = '';
	var more='';
	var location = '';
	var follow = '';
	var avatar = '';

	if(content['u_m']){
		$.each(content['u_m'], function(i, mind) {
			minds += constructor.listMinds(mind);
		});
	  	
		if(!content['u_m_this_minds_last']){
		    more = '<a onclick="return actions.loadMinds(\''+content['u_id']+'\', \''+content['u_m']['m_12']['m_id']+'\')" class="more">еще</a>';
		}
	}else if(content['f']){
			$.each(content['f'], function(i, user) {
				minds += constructor.listUsers(user);
			});
			if(!content['f_last']){
		   		more = '<a onclick="return actions.loadUsers(\''+content['u_id']+'\', '+content['f_last_part']+', '+content['f_last_position']+', \''+action+'\')" class="more">еще</a>';
			}
	}else{
		if(action=="minds" && content['u_im']){
			minds = "<div class='nothing'>У вас еще нет мнений, но Вы можете их <a href='/addmind' onclick='return nav.go(this)'>Добавить</a></div>";
		}else{
			minds = "<div class='nothing'>Ничего нет</div>";
		}
	}

	if(content['u_country'] && content['u_country']!="" && content['u_country']!="null" && content['u_city'] && content['u_city']!="" && content['u_city']!="null"){
		location = ", ";
	}
	if(!content['u_im']){
		if(content['u_imfollow']){
			follow = '<a class="unfollow" title="Отписаться" onclick="return user.unfollow(this, \''+content['u_id']+'\')"></a>';
		}else{
			follow = '<a class="follow" title="Подписаться" onclick="return user.follow(this, \''+content['u_id']+'\')"></a>';
		}
	}else{
		follow = '<a href="/profile" onclick="return nav.go(this)" class="settings" title="Выход"></a><a onclick="return user.logout(this)" class="logout" title="Выход"></a>';
	}

	if(content['u_photo']){
		avatar = '<a href="/'+content['u_photo']+'_o800.jpg" onclick="return nav.img(this, \'on\')"><img src="/'+content['u_photo']+'_r100x100.jpg" width="100" height="100" title="'+content['u_name']+'" alt="'+content['u_name']+'"/></a>';
	}else{
		avatar = '<img src="/public/img/ico-online.png" width="100" height="100" title="нет фото" alt="нет фото" class="avatar"/>';
	}

	var html='<div class="userPageInfo">'
			//+'<div class="userPageBg" style="background-image:url(\''+content['u_photo']+'_o800.jpg\');"></div>'
				+'<div class="userPageStatistic">'
					+'<a href="/'+content['u_nickname']+'" id="minds" onclick="return nav.go(this)"><span>'+content['u_m_count']+'</span> '+system.textNumbers(content['u_m_count'], ["мнение","мнения","мнений"])+'</a>'
					+'<a href="/followers/'+content['u_nickname']+'" id="followers" onclick="return nav.go(this)"><span>'+content['u_followers_c']+'</span> '+system.textNumbers(content['u_followers_c'], ["подписчик","подписчика","подписчиков"])+'</a>'
					+'<a href="/following/'+content['u_nickname']+'" id="following" onclick="return nav.go(this)"><span>'+content['u_following_c']+'</span> '+system.textNumbers(content['u_following_c'], ["подписка","подписки","подписок"])+'</a>'
				+'</div>'
				+'<div class="userPagePhoto">'
					+avatar
					+system.onlineIco(content['u_last_time'])
				+'</div>'
				//+'<div class="onlineText">'+system.onlineText(content['u_last_time'])+'</div>'
				+'<h2 class="userPageName">'+content['u_name']+'</h1>'
				+'<div class="userPageNickname">@'+content['u_nickname']+'</div>'
				+'<div class="userPageDescription">'+system.textFilter(content['u_about'], 0)+'</div>'
				+'<div class="userPageLocation">'+system.textFilter(content['u_country'], 0)+location+system.textFilter(content['u_city'], 0)+'</div>'
				+'<div class="userPageButtons">'+follow+'</div>'
			+'</div>'
			+'<div class="userMinds">'
				+'<div class="iteamsBlock">'+minds+'</div>'
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
   	if(content['u_country']==null || content['u_country'] == 'null'){
   		content['u_country'] = "";
   	}
   	if(content['u_city']==null || content['u_city'] == 'null'){
   		content['u_city'] = "";
   	}
	var html='<div class="userPageInfo">'
		+'<div class="inputHeader">Загрузить фото:</div>'
		+'<div class="userPagePhoto">'
    		+'<input type="file" class="userPageUpload" name="the-file1" onchange="return user.uploadUserAva(this)">'
			//+'<iframe name="upload_img" style="display: none"></iframe>'
			+'<img src="'+ava+'" width="100" title="'+content['u_name']+'" alt="'+content['u_name']+'" id="profphoto"/>'
		+'</div>'
		+'<div class="inputHeader">Основная информация:</div>'
		+'<div class="inputBox">Название странички:<input class="userPageName" id="namemy_ed" type="text" value="'+content['u_name']+'"></div>'
		+'<div class="inputBox">Описание:<textarea class="userPageDescription" id="aboutmy_ed" type="text">'+content['u_about']+'</textarea></div>'
		+'<div class="inputBox">Страна:<input id="countrymy_ed" type="text" value="'+content['u_country']+'"></div>'
		+'<div class="inputBox">Город:<input id="citymy_ed" type="text" value="'+content['u_city']+'"></div>'
		+'<input class="editBtn" type="submit" value="Cохранить" onclick="return user.saveprofile(this)">'
		+'<div class="inputHeader">Смена пароля:</div>'
		+'<div class="inputBox">Новый пароль:<input id="pswrd1" type="password" value=""></div>'
		+'<div class="inputBox">Повторите пароль:<input id="pswrd2" type="password" value=""></div>'
		+'<input class="editBtn" type="submit" value="Изменить" onclick="return user.editpswrd(this)">'
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
	+'</div>';
	return html;
	},
	pageUsers: function(content){
		var users = '';
		if(content['u_top_minder']){
			$.each(content['u_top_minder'], function(i, user) {
				users += constructor.listUsers(user);
			});
		}else{
			users = '<div class="nothing">Ничего нет</div>';
		}
		var html = '<div class="searchInput">'
					+'<input class="searchInputText" type="text" value="" placeholder="Поиск пользователей" autocomplete="off"/>'
					+'<input class="searchInputBtn" type="submit" onclick="return actions.searchUsers(this, false)" value="Поиск">'
				  +'</div>'
				  +'<div class="iteamsBlock">'
					+users
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

		var html = "<a class='iteamBox' id='id"+content['u_id']+"' href='/"+content['u_nickname']+"' onclick='return nav.go(this)'>"
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
	//Список пользователей
	listNotice: function(content){
	//u_id, u_name, u_nickname, u_photo, u_last_time, n_action, n_text, n_time
		if(content){
	        var n_text = "";
	        var n_time = "";
	        var n_action = "";
	        switch(content['action']){
	            case 'comment_add': 
	                n_text = 'Оставил комментарий к <a href="/mind/'+content['m_id']+'" onclick="return nav.go(this)">'+content['m_text']+'</a>: <span>'+content['c_text']+'</span>';
	                n_time = content['c_time'];
	                n_action = 'st04';
	              break;
	            case 'mind_add': 
	                n_text = 'Добавил мнение <a href="/mind/'+content['m_id']+'" onclick="return nav.go(this)">'+content['m_text']+'</a>';
	                n_action = 'st'+content['m_status'];
	                n_time = content['m_time'];
	              break;
	            case 'follow': 
	                n_text = 'Подписался';
	                n_time = content['f_time'];
	                 n_action = 'st05';
	              break;
	            case 'follow_remove': 
	                n_text = 'Отписался';
	                n_time = content['f_time'];
	                n_action = 'st06';
	              break;
	            case 'mind_plus':
	            	if(content['u_like'] == 0){
	            		n_text = 'Отменил согласие с <a href="/mind/'+content['m_id']+'" onclick="return nav.go(this)">'+content['m_text']+'</a>';
	            	}else{
	            		n_text = 'Согласен с <a href="/mind/'+content['m_id']+'" onclick="return nav.go(this)">'+content['m_text']+'</a>';
	            	}
	                n_time = content['n_time'];
	                n_action = 'st01';
	              break;
	            case 'mind_minus':
	            	if(content['u_like'] == 0){
	            		n_text = 'Отменил несогласие с <a href="/mind/'+content['m_id']+'" onclick="return nav.go(this)">'+content['m_text']+'</a>';
	            	}else{
	            		n_text = 'Не согласен с <a href="/mind/'+content['m_id']+'" onclick="return nav.go(this)">'+content['m_text']+'</a>';
	            	}
	                n_time = content['n_time'];
	                n_action = 'st02';
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

		var html = "<div class='iteamList'>"
						+"<div class='iteamListLeft'>"
							+"<div class='avatar'>"+ava+system.onlineIco(content['u_last_time'])+"</div>"
						+"</div>"
						+"<div class='iteamListCenter'>"
			 				+'<div class="iteamListText">'
			 					+"<div class='userInfo'>"
									+"<a href='/"+content['u_nickname']+"' onclick='return nav.go(this)' class='userName'>"+content['u_name']+"</a> "
									+'<a href="" class="userNickName" onclick="return user.answer(\''+content['u_nickname']+'\')">@'+content['u_nickname']+'</a>'
								+"</div>"
								+"<p>"
								+'<div class="iteamListMindStatus '+n_action+'"></div>'
			 					+n_text
			 					+"</p>"
			 				+'</div>'
			 			+'</div>'
			 			+"<div class='iteamListRight'>"
			 				+"<div class='time' time='"+n_time+"'>"+system.datetime(n_time)+"</div>"
						+"</div>"
			 		+"</div>";
		return html;
	
	},
	//Конструктор страницы вопроса
	pageMind: function(content){
	//m_id, u_name, u_nickname, u_photo, u_id, m_time, m_unixtime, u_last_time, m_tags, m_my_yes_no, m_text, m_yes_count, m_no_count, m_mymind, m_c_count, m_status
	var date = new Date(content['m_time']*1000);
 	var diff = new Date() - date; // разница в миллисекундах
   	var hour = Math.floor( diff / 1000 / 60 / 60); //округляем до часов
   	var update = "";

   	if(hour<1){ var update = " need_update";}

   	var ava ="";
   	if(content['m_user']['u_photo']){
   		ava = "<img src='/"+content['m_user']['u_photo']+"_r40x40.jpg' width='30' title='' alt=''/>";
   	}else{
   		ava = "<img src='/public/img/ico-online.png' width='30' title='' alt='' class='avatar'/>";
   	}
	
	var hashes = "";
	if(content['m_tags']){
		for(i=0; i<content['m_tags'].length; i++)
   		hashes += '<a onclick="return nav.go(this)" href="/mind/random/'+content['m_tags'][i].replace("#","")+'" class="tag">'+content['m_tags'][i]+'</a>'; 
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
    var online_count = 0;
    if(content['m_online']){
	    $.each(content['m_online'], function(i, online) {
	     	var ava ="";
		   	if(online['u_photo']){
		   		ava = "<img src='/"+online['u_photo']+"_r40x40.jpg' width='25' title='' alt=''/>";
		   	}else{
		   		ava = "<img src='/public/img/ico-online.png' width='25' title='' alt=''/>";
		   	}
	      html_online += '<a href="/'+online['u_nickname']+'" onclick="return nav.go(this)" class="mindOnlineIteam">'+ava+'<span>@'+online['u_nickname']+'</span></a>';
	      online_count++;
	    });
    }


	var mind = '<div class="mindLeftBox">'
					+"<div class='mindUser'>"
						+"<div class='userAvatar'>"
							+ava
							+system.onlineIco(content['m_user']['u_last_time'])
						+"</div>"
						+"<div class='userInfo'>"
							+"<a href='/"+content['m_user']['u_nickname']+"' onclick='return nav.go(this)' class='userName'>"+content['m_user']['u_name']+"</a> <span class='userNickname'>@"+content['m_user']['u_nickname']+"</span>"
							+"<div class='time"+update+"' time='"+content['m_time']+"'>"+system.datetime(content['m_time'])+"</div>"
						+"</div>"
					+"</div>"
					+'<div class="mindPhoto">'
						+'<img src="/public/img/upload/'+content['m_u_id']+'/mind/'+content['m_id']+'_0_r450x450.jpg"/>'
						+'<div class="mindText">'
							+'<span>'+content['m_text']+'</span>'
							+'<div class="mindTags">'+hashes+'</div>'
						+'</div>'
						+'<div class="mindAgree">'
				 			+"<div class='yes "+plus+"' onclick='return actions.agree(this, \"mind_plus\",\""+content['m_id']+"\")'><div class='ico'></div><span>"+content['m_yes_count']+"</span><small></small></div>"
				 			+"<div class='no "+minus+"' onclick='return actions.agree(this, \"mind_minus\",\""+content['m_id']+"\")'><div class='ico'></div><span>"+content['m_no_count']+"</span><small></small></div>"
				 		+'</div>'	
					+'</div>'
						+'<div class="mindOnline">'
							+'<div class="mindOnlineH" onclick="return system.show(this);">Просматривает <b>'+online_count+'</b> юз.:</div>'
							+'<div class="mindOnlineBox">'+html_online+'</div>'
						+'</div>'
						+'<div class="mindStatus st'+content['m_status']+'"></div>'	
					+'</div>'
					+'<div class="mindRightBox">'
					+'<div class="mindCommentInput">'
					+'<form action="" onsubmit="return actions.addComment(this, \''+content['m_id']+'\')">'
				  		+'<input type="text" class="mindCommentInputText" onfocus="" onblur="" value="" placeholder="Ваш комментарий?"/>'
				   		+'<input type="submit" id="commentsend" class="mindCommentInputBtn" value="Отправить" />'
				    +'</form>'
			 		+'</div>'
						+'<div class="mindComments">'
							+html_comments
							+more
						+'</div>'
				+'</div>';
		return mind;
	},
	//Конструктор страницы рандомных мнений
	pageMindsRandom: function(content, tag){
	var minds = "";
	if(tag){
		var value = "#"+tag;
	}else{
		var value = "";
	}

	if(content){
		if(content['u_m']){
			$.each(content['u_m'], function(i, mind) {
				minds += constructor.listMinds(mind);
			});
		  	
			if(!content['u_m_this_minds_last']){
			    more = '<a onclick="return actions.loadMinds(\''+content['u_m']['m_12']['m_id']+'\')" class="more">еще</a>';
			}
		}
	}else{
		minds = "Мнений с тегом '"+value+"' не найдено";
	}

		var html = '<div class="searchInput">'
					+'<input class="searchInputText" type="text" value="'+value+'" placeholder="Поиск по тегу" autocomplete="off"/>'
					+'<input class="searchInputBtn" type="submit" onclick="return actions.searchMinds(this)" value="Поиск">'
				  +'</div>'
				  +'<div class="iteamsBlock">'
						+minds
		    	  +'</div>';

		return html;
	},
	pageAddMind: function(){
	var html = '<form class="addMind" action="upload" target="upload_mind_img" method="POST" enctype="multipart/form-data" id="id_form_mind" onsubmit="return actions.addMind()">'
			+'<div class="addMindPhoto">'
				+'<div class="addMindPhotoText">Добавить фон</div>'
				+'<img alt="" id="image_preview" src=""/>'
   				+'<input type="file" class="addMindPhotoBtn" onchange="actions.addMindImgPreview(this)">'
			+'</div>'		
					+'<div class="addMindBox">'
					+'<div class="mindval">'
						+'<div class="f_ck" value="1" onclick="return system.checkit(this)"></div>'
						+'<div class="dislike" value="2" onclick="return system.checkit(this)"></div>'
						+'<div class="like" value="3" onclick="return system.checkit(this)"></div>'
						+'<div class="peace" value="4" onclick="return system.checkit(this)"></div>'
						+'<div class="rock" value="5" onclick="return system.checkit(this)"></div>'
					+'</div>'
			+'</div>'	
			+'<div class="addMindBox">'
					+'<textarea id="mindtext" name="text" type="text" placeholder="Текст мнения"></textarea>'
					+'<small>Вы можете указать от 1 до 5 тегов</small>'
			+'</div>'
			+'<input class="addMindBtn" id="questionbtn" type="submit" value="Добавить"/>'
	+'</form>'
	+'<div style="clear:both;"></div>'
	
	return html;

	},
	//Конструктор
	listMinds: function(content){
	//m_id, m_u_id, m_time, m_unixtime, m_tags, m_text, m_yes_coun, m_no_coun, m_status
	var date = new Date(content['m_unixtime']*1000);
 	var diff = new Date() - date; // разница в миллисекундах
   	var hour = Math.floor( diff / 1000 / 60 / 60); //округляем до часов
   	var update = "";
   	if(hour<10){ var update = " need_update"}

		//Конструктор мнения
		var html = "<a class='iteamBox mind' id='id"+content['m_id']+"' href='/mind/"+content['m_id']+"' onclick='return nav.go(this)'>"
					+'<div class="text"><span>'+system.textFilter(content['m_text'], 18)+'</span></div>'
					//+"<div class='"+mind+"'><div class='ico'></div></div>"
					+'<div class="photo">'
						+'<img src="/public/img/upload/'+content['m_u_id']+'/mind/'+content['m_id']+'_0_r200x200.jpg"/>'
					+'</div>'
					+'<div class="status st'+content['m_status']+'"></div>'
					+'<ul class="iteamBoxStatistic">'
						+'<li class="online"><div class="ico" title="Пользователей онлайн"></div>'+content['m_online_c']+'</li>'
						+'<li class="comments"><div class="ico" title="Комментариев"></div>'+content['m_c_count']+'</li>'
						+'<li class="raiting">'+(content['m_yes_count']+'/'+content['m_no_count'])+'</li>'
					+'</ul>'
			 	  +"</a>";
		return html;
	},
	listComments: function(m_id, content, canDel){
	//username, userid, userava, usernick, time, unixtime, endhop, text, myself
	var date = new Date(content['c_time']*1000);
 	var diff = new Date() - date; // разница в миллисекундах
   	var hour = Math.floor(diff / 1000 / 60 / 60); //округляем до часов
   	var update = "";
   	if(hour<10){ var update = " need_update"}

   	var mind = "";	
   	if(content['u_im']==1){
   		mind = "yes";
   	}else if(content['u_im']==2){
   		mind = "no";
   	}else{
   		mind = "none";
   	}

   	if(content['u_photo']){
   		ava = "<img src='/"+content['u_photo']+"_r40x40.jpg' width='40' title='' alt=''/>";
   	}else{
   		ava = "<img src='/public/img/ico-online.png' width='40' title='' alt=''/>";
   	}
   	var del = "";
   	if(canDel){
   		var del = '<div class="iteamListDel" onclick="return actions.delComment(this, \''+m_id+'\', \''+content['c_id']+'\')">x</div>';
   	}
	//Конструктор комментариев
	var html = "<div class='iteamList'>"
					+"<div class='iteamListLeft'>"
						+"<div class='avatar'>"
								+ava
								+system.onlineIco(content['u_last_time'])
						+"</div>"
					+"</div>"
					+"<div class='iteamListCenter'>"
		 				+'<div class="iteamListText">'
		 					+"<div class='userInfo'>"
								+"<a href='/"+content['u_nickname']+"' onclick='return nav.go(this)' class='userName'>"+content['u_name']+"</a> "
								+'<a href="" class="userNickName" onclick="return user.answer(\''+content['u_nickname']+'\')">@'+content['u_nickname']+'</a>'
							+"</div>"
							+'<div class="iteamListMindStatus st0'+content['m_like']+'"></div>'
		 					+content['c_text']
		 				+'</div>'
		 				+del
		 			+'</div>'
		 			+"<div class='iteamListRight'>"
		 				+"<div class='time"+update+"' time='"+content['c_time']+"'>"+system.datetime(content['c_time'])+"</div>"
					+"</div>"
				+"</div>";
	return html;
	}
}