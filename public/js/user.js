var user = {
	//Сохранение профиля
	saveprofile: function(btn){
		var prof_data_tosrv = new Object();

		prof_data_tosrv['action'] = 'shareinfo_change';
		
		prof_data_tosrv['name']    = $('.active #namemy_ed').val();
		prof_data_tosrv['about']   = $('.active #aboutmy_ed').val();
		prof_data_tosrv['country'] = $('.active #countrymy_ed').val();
		prof_data_tosrv['city']    = $('.active #citymy_ed').val();
		prof_data_tosrv['male'] = $('.active #male_ed  option:selected').val();
		prof_data_tosrv['age']    = $('.active #age_ed').val();
		prof_data_tosrv['vk_social'] = $('.active #vk_social_ed').val();
		prof_data_tosrv['instagramm_social'] = $('.active #instagramm_social_ed').val();
		prof_data_tosrv['twitter_social'] = $('.active #twitter_social_ed').val();

		$.ajax({
			type: "POST",
			url: "/profile", 
			contentType: "application/json; charset=UTF-8",
			data: JSON.stringify(prof_data_tosrv),
			success: function(data){
				data = JSON.parse(data);
				system.loading(false);
				if(data['bool']){
					system.message("Ваши данные успешно сохранены", "ok", 1);
				} else {
					system.message('Ошибка '+data_r['code']+': '+system.errorType(data_r['code']), 'error', 1);
				}
			},
			beforeSend: function(){
				system.loading(true);
			},
			error: function(){
				system.loading(false);
				system.message('С нашим сервером что-то не так... попробуйте обновить страницу','error',1);
			}
		});
	},	
	//Изменение пароля
	editpswrd: function(btn){
		var prof_data_tosrv = new Object();

		prof_data_tosrv['action'] = 'password_change';
		
		if( $('.active #pswrd1').val() ==  $('.active #pswrd2').val()){
			prof_data_tosrv['password']   = $('.active #pswrd1').val();
		}else{
			system.message("Пароли не совпадают", "error", 1);
			return false;
		}

		$.ajax({
			type: "POST",
			url: "/profile", 
			contentType: "application/json; charset=UTF-8",
			data: JSON.stringify(prof_data_tosrv),
			success: function(data){
				data = JSON.parse(data);
				system.loading(false);
				if(data['bool']){
					system.message("Ваши данные успешно сохранены", "ok", 1);
				} else {
					system.message('Ошибка '+data_r['code']+': '+system.errorType(data_r['code']), 'error', 1);
				}
			},
			beforeSend: function(){
				system.loading(true)
			},
			error: function(){
				system.loading(false);
				system.message('С нашим сервером что-то не так... попробуйте обновить страницу','error',1);
			}
		});
	},
	signUserInVkontakte: function(it) {
		system.loading(true);
		window.open('http://api.vk.com/oauth/authorize?client_id=5163786&redirect_uri=http://'+window.location.hostname+'/vkauth/'+window.guid+'/&display=page');
		$('#pages').html('<section class="pageMain active"><div class="pageBox"></div></section>');
		return false;
	},
	signUserInModule: function(data){
		data_r = JSON.parse(data);
		if(data_r['bool']==true){
				system.loading(false);
				$('#pages').html('<section class="pageMain active"><div class="pageBox"></div></section>');

				var out = nav.page(data, "/"+data_r['content']['u_nickname'], true);

	            var html = out[0];
	            var title = out[1];
	            var active = out[2];
	            var subactive = out[3];
	            	link = out[4];

				$("title").text(title);

	            $('.active .pageBox').html(html);

				window.guid = lp.guid_();
				window.history.replaceState(title, title, link);
            	
		} else {
			system.loading(false);
			system.message('Ошибка авторизации. Неверный логин или пароль', 'error', 1);
		}
	},
	signUserIn: function(e){
		$.ajax( {
			url: '/auth',
			type: 'POST',
			data: new FormData( e ),
			processData: false,
			contentType: false,
			success: function(data){
				user.signUserInModule(data);
			},
			beforeSend: function(){
				system.loading(true);
			},
			error: function(data){
				system.loading(false);
            	system.message('С нашим сервером что-то не так... попробуйте обновить страницу','error', 1);
			}
		});
		return false;
	},
	signUserReg: function(e){
		var form = new FormData();
		form.append('action', 'auth_sign');
		form.append('username', $('.active .formName').val());
		form.append('email', $('.active .formEmail').val());
		form.append('password', $('.active .formPswrd').val());
	
		$.ajax( {
			url: '/auth',
			type: 'POST',
			data: form,
			processData: false,
			contentType: false,
			success: function(data){
				system.loading(false);
				data_r = JSON.parse(data);
				var errorText = 'Что-то пошло не так...';
				if(data_r['bool']==true){
					nav.page(data, "/"+data_r['content']['u_nickname'], true);
					var need_last = '<div id="overlay" onclick="return nav.img(this, \'off\')"><div class="warning"><h2>Добро пожаловать на O4EM.RU!</h2><p>На Ваш E-mail было выслано письмо с авторизационными данными.</p><p>Чтобы создать свое первое мнение, нажмите на кнопку "Добавить"</p><a href="/addpoll" class="submitBtn" onclick="return nav.go(this, \'page\')">Добавить</a><a href="">Напомнить позже</a></div></div>';
					$('body').append(need_last);
					//$('.indexPageBox').html('<h2>Регистрация прошла успешно! На Ваш E-mail было выслано письмо с ключем подтверждения.</h2><a href="/'+data['content']['u_nickname']+'" class="submitBtn" onclick="return nav.go(this)">Войти</a>');
				} else {
					system.message('Ошибка '+data_r['code']+': '+system.errorType(data_r['code']), 'error', 1);
				}
			},
			beforeSend: function(){
				system.loading(true);
			},
			error: function(){
				system.loading(false);
            	system.message('С нашим сервером что-то не так... попробуйте обновить страницу','error',1);
			}
		});
		return false;
	},
	signUserRestore: function(e){
		$.ajax( {
			url: '/auth',
			type: 'POST',
			data: new FormData( e ),
			processData: false,
			contentType: false,
			success: function(data){
				data = JSON.parse(data);
				console.log(data);
				system.loading(false);
				if(data['bool']==true){
					//system.message('На Ваш E-mail было выслано письмо с кодом подтверждения', 'ok', 1);
					$('.indexPageBox').html('<h2>На Ваш E-mail было выслано письмо с кодом подтверждения</h2><a href="/login" class="submitBtn" onclick="return nav.go(this, \'page\')">Войти</a>');
				} else {
					system.message('Ошибка '+data['code']+': '+system.errorType(data['code']), 'error', 1);
				}
			},
			beforeSend: function(){
				system.loading(true);
			},
			error: function(){
				system.loading(false);
           		system.message('С нашим сервером что-то не так... попробуйте обновить страницу','error',1);
			}
		});
		return false;
	},
	signUserRestoreConfirm: function(e){
		$.ajax( {
			url: '/auth',
			type: 'POST',
			data: new FormData( e ),
			processData: false,
			contentType: false,
			success: function(data){
				data = JSON.parse(data);
				console.log(data);
				system.loading(false);
				if(data['bool']==true){
					$('.indexPageBox').html('<h2>Вы успешно сменили пароль. Новый пароль был выслан на Вашу почту</h2><a href="/login" class="submitBtn" onclick="return nav.go(this, \'page\')">Войти</a>');
				} else {
					console.log(data);
					system.message('Ошибка '+data['code']+': '+system.errorType(data['code']), 'error', 1);
				}
			},
			beforeSend: function(){
				system.loading(true);
			},
			error: function(){
				system.loading(false);
           		system.message('С нашим сервером что-то не так... попробуйте обновить страницу','error',1);
			}
		});
		return false;
	},
	uploadUserAvaPreview: function(it){
		$('body').append(constructor.photoEditor());
		var reader = new FileReader();
        reader.onload = function(e) {
        	var options = {};
            options.imgSrc = e.target.result;
            options.previewBox = $('.userPhotoPreview');
            cropper = $('.photoEditor').imgEditor(options);
        }
        reader.readAsDataURL(it.files[0]);
    },
	uploadUserAva: function(it){
	   	// Добавляем наше обработанное изображение
		var img = false;
		if($('.userPhotoPreview').attr('src')){
			img = $('.userPhotoPreview').attr('src');
		}

	    var form = new FormData();
	    form.append('action', 'photo_change');
	    form.append('current_id', 'id_name_img');
		form.append('the-file1', img);

		$.ajax( {
			url: '/profile',
			type: 'POST',
			data: form,
			processData: false,
			contentType: false,
			success: function(data){
				system.loading(false);
				data = JSON.parse(data);
				console.log(data);
				if(data['bool']){
					system.message('Фото успешно загружено', 'ok', 1);
					var img = "/"+data['filename']+"_r100x100.jpg";
					$(".new #profphoto").attr({src: img});
				}else{
					system.message('Ошибка при загрузки фото', ' error', 1);
				}
			},
			beforeSend: function(){
				system.loading(true);
			},
			error: function(){
				system.loading(false);
	        	system.message('С нашим сервером что-то не так... попробуйте обновить страницу','error',1);
			}
		});
		return false;
	},
	follow: function(it, u_id){
		var mind_data_tosrv = new Object();

		mind_data_tosrv['action'] = 'follow';
		mind_data_tosrv['u_id'] = u_id;

		var btn = $(it).parent();

			$.ajax({
				type: "POST",
				url: "/follow",
				contentType: "application/json; charset=UTF-8",
				data: JSON.stringify(mind_data_tosrv),
				success: function(data){
					system.loading(false);
					data = JSON.parse(data);
					if(data['bool']){
						follow = '<a class="unfollow" onclick="return user.unfollow(this, \''+u_id+'\')">отписаться</a>';
						var objFollowers = $('.new #followers span');
						var count = parseFloat(objFollowers.text());
						objFollowers.text(count+1);
						btn.html(follow);
					}else{
						system.message('Вы уже подписаны!', 'error', 1);
					}

				},
				beforeSend: function(){
					system.loading(true);
				},
				error: function(){
					system.loading(false);
		            system.message('С нашим сервером что-то не так... попробуйте обновить страницу','error',1);
				}
			});
		return false;
	},
	unfollow: function(it, u_id){
		var mind_data_tosrv = new Object();

		mind_data_tosrv['action'] = 'follow_remove';
		mind_data_tosrv['u_id'] = u_id;

		var btn = $(it).parent();

			$.ajax({
				type: "POST",
				url: "/follow",
				contentType: "application/json; charset=UTF-8",
				data: JSON.stringify(mind_data_tosrv),
				success: function(data){
					system.loading(false);
					data = JSON.parse(data);
					if(data['bool']){
						follow = '<a class="follow" onclick="return user.follow(this, \''+u_id+'\')">подписаться</a>';
						var objFollowers = $('.new #followers span');
						var count = parseFloat(objFollowers.text());
						objFollowers.text(count-1);
						btn.html(follow);
					}else{
						system.message('Вы не подписаны!', 'error', 1);
					}
				},
				beforeSend: function(){
					system.loading(true);
				},
				error: function(){
					system.loading(false);
            		system.message('С нашим сервером что-то не так... попробуйте обновить страницу','error',1);
				}
			});
		return false;
	},	
	wink: function(it, u_id){
		var mind_data_tosrv = new Object();

		mind_data_tosrv['action'] = 'hi_man';
		mind_data_tosrv['u_id'] = u_id;
		//mind_data_tosrv['hi_text'] = '';

		var btn = $(it).parent();

			$.ajax({
				type: "POST",
				url: "/pool",
				contentType: "application/json; charset=UTF-8",
				data: JSON.stringify(mind_data_tosrv),
				success: function(data){
					system.loading(false);
					data = JSON.parse(data);
					if(data['bool']){
						system.message('Вы подмигнули ;)', 'ok', 1);
						console.log(data);
					}else{
						system.message('Ошибка!', 'error', 1);
					}

				},
				beforeSend: function(){
					system.loading(true);
				},
				error: function(){
					system.loading(false);
		            system.message('С нашим сервером что-то не так... попробуйте обновить страницу','error',1);
				}
			});
		return false;
	},
	logout: function(){
		var data_tosrv = new Object();
			data_tosrv['action'] = 'auth_logout';

		$.ajax({
				type: "POST",
				url: "/auth", 
				contentType: "application/json; charset=UTF-8",
				data: JSON.stringify(data_tosrv),
				success: function(data){
					data = JSON.parse(data);

					if(data['bool']){
						window.guid = lp.guid_();
						nav.goto('/', 'page');
					}else{
						system.message('Ошибка!', 'error', 1);
					}

				},	
				error: function(data){
					system.loading(false);
            		system.message('С нашим сервером что-то не так... попробуйте обновить страницу','error',1);
				}
		});
		return false;
	},
	getCookie: function(name) {
		var cookie = " " + document.cookie;
		var search = " " + name + "=";
		var setStr = null;
		var offset = 0;
		var end = 0;
		if (cookie.length > 0) {
			offset = cookie.indexOf(search);
			if (offset != -1) {
				offset += search.length;
				end = cookie.indexOf(";", offset)
				if (end == -1) {
					end = cookie.length;
				}
				setStr = unescape(cookie.substring(offset, end));
			}
		}
		return(setStr);
	}
}
