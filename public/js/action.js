var actions = {
	back: function(link, title, top){
		$("title").text(title);
		$('.new').remove();
		$('#pages .page:last-child').removeClass('old').addClass('new');
		$('h1:first-child').removeClass('old').addClass('new');
		$('.back:first-child').removeClass('old').addClass('new');
		$(window).scrollTop(top);
		window.history.replaceState(title, title, link);
	},	
	//Добавление вопроса
	addMind: function(){
	        // Отправляем уменьшенное изображение на сервер
			var form = new FormData();

			var point = $(".new .mindval div.active").attr("value");
			
			var link = /#([a-zA-Zа-яА-Я0-9_]+)/g;
			var input = $(".new #mindtext").val();
			
			//ДОБАВЛЯЕМ ТЕГИ!
			var i=0;
			var replacedText = (input || '').replace(link,
		      function () { 
		        var matches = Array.prototype.slice.apply(arguments),
		            full = matches[0];
		            i = i+1;
		            form.append('t'+i, full);	       
		        }
		    );
			if(i==0){
				 form.append('t1', '#безтега');
				 form.append('kt', '1');
			}else{
				form.append('kt', i);
			}
		    var pattern = /\r\n|\r|\n/g;
			var input = input.replace(pattern, "");

		    form.append('status', point);
		    form.append('text', input.replace(link, ""));
		    form.append('action', 'mind_add');

       		// Добавляем наше обработанное изображение
       		var img = false;
       		if($('.addMindPhotoPreview').attr('src')){
       			img = $('.addMindPhotoPreview').attr('src');
       		}
       		form.append('the-file1',  img);
			// перехват submit
			$.ajax( {
				url: '/mind',
				type: 'POST',
				data: form,
				processData: false,
				contentType: false,
				success: function(data){
					data = JSON.parse(data);
					console.log(data);
					system.loading(false);
							if(data['bool'] === false){
								system.message(data['info'], 'error', 1);	
								return false;
							}else{
								nav.goto('/mind/'+data['content']['m_id']);
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
	//Удаление мнения
	delMind: function(m_id, u_nickname){
	        // Отправляем уменьшенное изображение на сервер
			var form = new FormData();

		    form.append('m_id', m_id);
		    form.append('action', 'mind_remove');

			// перехват submit
			$.ajax( {
				url: '/mind',
				type: 'POST',
				data: form,
				processData: false,
				contentType: false,
				success: function(data){
					data = JSON.parse(data);
					console.log(data);
					system.loading(false);
					if(data['bool']){
						system.message('Мнение успешно удалено','ok',1);
						nav.goto('/'+u_nickname);
					}else{
						system.message('Это мнение невозможно удалить','error',1);
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
	addMindImgPreview: function(it){
	var reader = new FileReader();
        reader.onload = function(e) {
        	var options = {};
            options.imgSrc = e.target.result;
            cropper = $('.photoEditor').imgEditor(options);
        }
        reader.readAsDataURL(it.files[0]);
	},
	addMindImagePreview: function(data_this){
	var input = $(it)[0];
		if (input.files && input.files[0]) {
			$.each(it.files, function(i, file) {
	        if (file.type.match('image.*') ) {
        		var reader = new FileReader();
	            reader.onload = function(e) {
					var tempImg = new Image();
				    tempImg.src = reader.result;
				    tempImg.onload = function() {
				    	// Расчитываем новые размеры изображения
				    	maxWidth = 800;
				        var tempW = tempImg.width;
				        var tempH = tempImg.height;
				        if (tempW > tempH) {
				            tempW *= maxWidth / tempH;
				            tempH = maxWidth;
				        }else{
				            tempH *= maxWidth / tempW;
				            tempW = maxWidth;
				        }
					    tempW = Math.round(tempW);
					    tempH = Math.round(tempH);

		            	// Создаем холст
				        canvas = document.createElement('canvas');
				        canvas.width = 800;
				        canvas.height = 800;
				        var ctx = canvas.getContext("2d");
				        ctx.drawImage(this, 0, 0, tempW, tempH);
				        dataURL = canvas.toDataURL('image/jpeg', 0.8);
				        $('#image_preview').attr('src', dataURL);
				    }
	            }
	            reader.readAsDataURL(file);
		    }
			});
		}
	},
	//Добавление комментария
	addComment: function(it, m_id){	
		var mind_data_tosrv = new Object();

			mind_data_tosrv['action'] = 'comment_add';
			mind_data_tosrv['m_id'] = m_id;
			mind_data_tosrv['c_text'] = $(".new .mindCommentInputText").val();

			if(mind_data_tosrv['c_text']==""){
				system.message('Вы не ввели текст комментария', 'error', 1);	
				return false;
			}

			$.ajax({
				type: "POST",
				url: "/mind",
				contentType: "application/json; charset=UTF-8",
				data: JSON.stringify(mind_data_tosrv),
				success: function(data){
					data = JSON.parse(data);
					system.loading(false);
					console.log(data);
					if(data['bool'] === false){
							system.message(data['info'], 'error', 1);	
							return false;
					}else{
							var html_comment = constructor.listComments(data['content']['m_id'], data['content'], true);

							$(html_comment).css("opacity","0.1").prependTo(".new .mindComments").animate({
								opacity: 1
							});
	
							$(".new .mindCommentInputText").val("");
					}

				},
				beforeSend: function(){
					system.loading(true);
					$(it).closest("mindbox").children("textarea").val("");
				},
				error: function(data){
					system.loading(false);
            		system.message('С нашим сервером что-то не так... попробуйте обновить страницу','error',1);
				}
			});

		return false;
	},
	//Удаление комментария
	delComment: function(it, m_id, c_id){	
		var mind_data_tosrv = new Object();

			mind_data_tosrv['action'] = 'comment_remove';
			mind_data_tosrv['m_id'] = m_id;
			mind_data_tosrv['c_id'] = c_id;

			$.ajax({
				type: "POST",
				url: "/mind",
				contentType: "application/json; charset=UTF-8",
				data: JSON.stringify(mind_data_tosrv),
				success: function(data){
					data = JSON.parse(data);
					system.loading(false);
					console.log(data);
					if(data['bool'] === false){
							system.message(data['info'], 'error', 1);	
					}else{
							$(it).closest(".new .iteamList").html('<div class="iteamDeleted">комментарий удален</div>');
					}

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
	//Загрузка ведомлений
	loadNotice: function(n_last_part, n_last_position){
		var mind_data_tosrv = new Object();
		if(n_last_part != null){
			mind_data_tosrv['n_last_part'] = n_last_part;
		}
		if(n_last_position != null){
			mind_data_tosrv['n_last_position'] = n_last_position;
		}

		$.ajax({
			type: "POST",
			url: "/notice",
			contentType: "application/json; charset=UTF-8",
			data: JSON.stringify(mind_data_tosrv),
			success: function(data){
				system.loading(false);
				data = JSON.parse(data);
				console.log(data);
				var html_minds = "";
				var count = 0;
				if(data['bool']){
					var iteams = "";
 					$.each(data['content']['n'], function(i, notice) {
                   		iteams += constructor.listNotice(notice);
                  	});
            
	 				$(".new .more").remove();
	                $(".new.page").append(iteams);

	                if(data['content']['n_this_notices_last']!=true){
	                  var more = '<a onclick="return actions.loadNotice('+data['content']['n_last_part']+', '+data['content']['n_last_position']+')" class="more">еще</a>';
	                  $(".new.page").append(more);
	                }
                  
				}
			
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
	//Загрузка списка мнений
	loadMinds: function(u_id, m_id){
		var mind_data_tosrv = new Object();
			mind_data_tosrv['action']   = 'minds_read';

		//Отсылаем айди последнего мнения
		if(m_id!=""){ mind_data_tosrv['m_last_id']  = m_id;}

		if(u_id!=""){ mind_data_tosrv['u_id']  = u_id;}

		$.ajax({
			type: "POST",
			url: "/mind",
			contentType: "application/json; charset=UTF-8",
			data: JSON.stringify(mind_data_tosrv),
			success: function(data){
				system.loading(false);
				data = JSON.parse(data);
				console.log(data);
				var html_minds = "";
				var count = 0;
				if(data['bool']){
					$.each(data['content']['u_m'], function(i, mind) {
					  count = count+1;
                      html_minds += constructor.listMinds(mind);
                      });

					$(html_minds).appendTo('.new .iteamsBlock');

					$(".new .more").remove();

					if(!data['content']['u_m_this_minds_last']){
					    $(".new .userMinds").append('<a onclick="return actions.loadMinds(\''+u_id+'\', \''+data['content']['u_m']['m_12']['m_id']+'\')" class="more">еще</a>');
					}
				}
			
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
	loadComments: function(m_id, c_last_part, c_last_position, m_u_im){
		var comment_data_tosrv = new Object();

		comment_data_tosrv['action'] = 'comments_read';
		comment_data_tosrv['m_id'] = m_id;

		if(c_last_part != null){
			comment_data_tosrv['c_last_part'] = c_last_part;
		}
		if(c_last_position != null){
			comment_data_tosrv['c_last_position'] = c_last_position;
		}

		var htmlcomments = "";

		$.ajax({
			type: "POST",
			url: "/mind",
			contentType: "application/json; charset=UTF-8",
			data: JSON.stringify(comment_data_tosrv),
			success: function(data){
				system.loading(false);
				data = JSON.parse(data);
				console.log(data);
				var html_comments = "";
				$.each(data['content']['c'], function(i, comment) {
					if(m_u_im || comment['u_im']){
				    	del = true;
			    	}else{
			    		del = false;
			    	}
                      html_comments += constructor.listComments(m_id, comment, del);
                });
                
                $(".new .more").remove();
                $(".new .mindComments").append(html_comments);

                  if(data['content']['c_this_comments_last']!=true){
                      $(".new .mindComments").append('<a onclick="return actions.loadComments(\''+m_id+'\', '+data['content']['c_last_part']+', '+data['content']['c_last_position']+', '+m_u_im+')" class="more">еще</a>');
                  }

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
	agree: function(it, action, mindid){

		var like_data_tosrv = new Object();

		like_data_tosrv['action'] = action;
		like_data_tosrv['idmind']  = mindid;

		$.ajax({
			type: "POST",
			url: "/mind",
			contentType: "application/json; charset=UTF-8",
			data: JSON.stringify(like_data_tosrv),
			success: function(data){
				system.loading(false);
				data = JSON.parse(data);
				console.log(data);
				$('.new .yes span').text(data['content']['m_like']);
				$('.new .no span').text(data['content']['m_dislike']);
			},
			beforeSend: function(){
				$('.new .yes').removeClass("my");
				$('.new .no').removeClass("my");
				$(it).addClass("my");
				system.loading(true);
			},
			error: function(data){
				system.loading(false);
            	system.message('С нашим сервером что-то не так... попробуйте обновить страницу','error',1);
			}		
		});
		return false;
	},
	searchMinds: function(){
		var search = $('.new input.searchInputText').val();
		if(search.charAt(0) == "#"){
			search = search.replace("#", "");
		}
		nav.goto('/mind/random/'+search);
	},
	searchUsers: function(it, last_u_id){
		//$('#search_tag').html("");
		//Берем данные из инпута, и если в начале нет # то добавляем ее
		var str = $('.new input.searchInputText').val();

		//Данные для отправки на сервер
		var tag_data_tosrv = new Object();
		tag_data_tosrv['user_name'] = str;
		if(last_u_id){
			tag_data_tosrv['last_user_id'] = last_u_id;
		}else{
			$('.new .iteamsBlock').html('');
		}

		$.ajax({
			type: "POST",
			url: "/search/people",
			contentType: "application/json; charset=UTF-8",
			data: JSON.stringify(tag_data_tosrv),
			success: function(data){
				system.loading(false);
				data = JSON.parse(data);
				console.log(data); 
				var users = '';
				if(data['bool']){
					$.each(data['content']['u_finded'], function(i, user) {
						users += constructor.listUsers(user);
					});
				}else{
					users = "Пользователей по запросу '"+str+"' не найдено";
				}

				$('.new .more').remove();

				$('.new .iteamsBlock').append(users);

				if(data['content']['u_last']!=true){
                	$(".new .iteamsBlock").append('<a onclick="return actions.searchUsers(this, \''+data['content']['u_finded']['12']['u_id']+'\')" class="more">еще</a>');
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
	loadUsers: function(u_id, f_last_part, f_last_position, action){
		var comment_data_tosrv = new Object();

		comment_data_tosrv['u_id'] = u_id;
		comment_data_tosrv['action'] = action;

		if(f_last_part != null){
			comment_data_tosrv['f_last_part'] = f_last_part;
		}
		if(f_last_position != null){
			comment_data_tosrv['f_last_position'] = f_last_position;
		}

		var users = "";

		$.ajax({
			type: "POST",
			url: "/follow",
			contentType: "application/json; charset=UTF-8",
			data: JSON.stringify(comment_data_tosrv),
			success: function(data){
				system.loading(false);
				data = JSON.parse(data);
				console.log(data);

				$.each(data['content']['f'], function(i, user) {
                      users += constructor.listUsers(user);
                });
                
				$('.new .more').remove();

				$('.new .iteamsBlock').append(users);

				if(data['content']['f_last']!=true){
                	$(".new .iteamsBlock").append('<a onclick="return actions.loadUsers(\''+u_id+'\', '+data['content']['f_last_part']+', '+data['content']['f_last_position']+', \''+action+'\')" class="more">еще</a>');
                }

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
	agregate: function(){
        var obj = new Object();
        obj['action'] = $( "#agregate option:selected" ).val();
        obj['id'] = $('#agregateId').val();
        
        $.ajax({
          type: "POST",
          url: "/agregator",
          contentType: "application/json; charset=UTF-8",
          data: JSON.stringify(obj),
          success: function(data){
          	system.loading(false);
          	data = JSON.parse(data);
			console.log(data); 
			if(data['bool']){
				 system.message('Данные усешно пересчитаны','ok',1);
			}else{
				 system.message('Не удалось пересчитать данные','error',1);
			}
            system.message('Данные усешно пересчитаны','ok',1);
          },
          beforeSend: function(){
				system.loading(true);
			},
			error: function(data){
				system.loading(false);
            	system.message('С нашим сервером что-то не так... попробуйте обновить страницу','error',1);
			}
        });
    
	}
}