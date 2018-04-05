var poll = {
	//Добавление Опроса
	add: function(){
        // Создаем форму для отправки на сервер
		var form = new FormData();

		var input = $(".active #addText").val();
		var btn = $(".active .addPollBtn");
		
		// Теги
		var t=0;
		var link = /#([a-zA-Zа-яА-Я0-9_]+)/g;
		var replacedText = (input || '').replace(link,
	      function () { 
	        var matches = Array.prototype.slice.apply(arguments),
	            full = matches[0];
	            t = t+1;
	            form.append('t'+t, full);	       
	        }
	    );
		if(t==0){ form.append('t1', '#безтега'); 
				  form.append('kt', '1');}
		else{ 
				  form.append('kt', t);}

		// Текст
		var input = input.replace(link, "");
	    form.append('text', input);

		//Варианты ответа
		var i = 0;
		$(".pollRow").each(function(){
			if($(this).val()!=""){
				i++;
    			form.append('f_text'+i, $(this).val());
    		}else{
    			return false;
    		}
  		});
		form.append('f_count', i);

		// Событие
	    form.append('action', 'mind_add');

   		// Изображение
   		var img = false;
   		if($('.addPhotoPreview').attr('src')){
   			img = $('.addPhotoPreview').attr('src');
   		}
   		form.append('the-file1',  img);

		// Отправка
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
							btn.removeAttr('disabled').val('Создать');
							return false;
						}else{
							nav.goto('/'+data['content']['u_id']);
						}
			},
			beforeSend: function(){
				btn.attr('disabled','disabled').val('Загрузка...');
				system.loading(true);
			},
			error: function(){
				system.loading(false);
            	system.message('С нашим сервером что-то не так... попробуйте обновить страницу','error',1);
			}
		});	
		return false;
	},
	//Голосовать
	vote: function(pollid, pollline){

		var data_to_srv = new Object();

		data_to_srv['action'] = 'field_check';
		data_to_srv['mindid'] = pollid;
		data_to_srv['field'] = pollline;

		// перехват submit
		$.ajax( {
			url: '/mind',
			type: 'POST',
			data: JSON.stringify(data_to_srv),
			processData: false,
			contentType: false,
			success: function(data){
				if ( sync.pop() ){
					data = JSON.parse(data);

					$.each(data['content']['m_fields'], function(i, poll) {
	                	var p, percent, check;

	                	if(poll['count']!=null && poll['count']!=0){
	    					percent = String(Math.round(poll['count']*100/data['content']['m_fields_c']));
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

	                    $('#'+i).removeAttr('class').addClass('pollLine').addClass('p'+p);
	                    if(data['content']['m_my_field']==i){
					        $('#'+i).addClass('checked');
	                    }
	                    $('#'+i+' .linePercent').css({'width': percent+'%'});
	                    $('#'+i+' .linePercent').css({'width': percent+'%'});
	                    $('#'+i+' .lineTextP').text(percent+'%');
	        		});
					console.log(data);
					$('.lines .boxCount').text(data['content']['m_fields_c']);
				
					sync.delay(300);
      			}
				system.loading(false);
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
	addImgPreview: function(it){
	$('body').append(constructor.photoEditor());
	var reader = new FileReader();
        reader.onload = function(e) {
        	var options = {};
            options.imgSrc = e.target.result;
            options.previewBox = $('.addPhotoPreview');
            cropper = $('.photoEditor').imgEditor(options);
        }
        reader.readAsDataURL(it.files[0]);
	},
	addLine: function(){
		var i = $(".pollRow").length;
		 $('<input class="pollRow" id="pollRow_'+(i+1)+'" name="text" type="text">').insertAfter($("#pollRow_"+i)).focus();
     	return false;
	},
	//Загрузка списка мнений
	more: function(u_id, m_id){
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
                      html_minds += constructor.listPolls(mind);
                      });

					$(html_minds).appendTo('.active .iteamsPoll');

					$(".active .more").remove();

					if(!data['content']['u_m_this_minds_last']){
					    $(".active .userPolls").append('<a onclick="return poll.more(\''+u_id+'\', \''+data['content']['u_m']['m_12']['m_id']+'\')" class="more">еще</a>');
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
	}
}

var f_mind = {
	//Загрузка списка мнений
	more: function(u_id, f_last_part, f_last_position){
		var mind_data_tosrv = new Object();
			mind_data_tosrv['action']   = 'field_users';

		//Отсылаем айди последнего мнения
		if(u_id!="" && u_id!="undefined"){ mind_data_tosrv['u_id']  = u_id;}

		if(f_last_position!="" && f_last_position!="undefined"){ mind_data_tosrv['f_last_position']  = f_last_position;}

		if(f_last_part!="" && f_last_part!="undefined"){ mind_data_tosrv['f_last_part']  = f_last_part;}

		$.ajax({
			type: "POST",
			url: "/minds",
			contentType: "application/json; charset=UTF-8",
			data: JSON.stringify(mind_data_tosrv),
			success: function(data){
				system.loading(false);
				data = JSON.parse(data);
				console.log(data);
				var html_minds = "";
				var count = 0;
				if(data['bool']){
					$.each(data['content']['u_m'], function(i, content) {
					  count = count+1;
                      html_minds += constructor.listPolls(content);
                      });

					$(html_minds).appendTo('.active .iteamsPoll');

					$(".active .more").remove();

					if(!data['content']['u_m_this_minds_last']){
					    $(".active .userPolls").append('<a onclick="return poll.more(\''+u_id+'\', \''+data['content']['u_m']['m_12']['m_id']+'\')" class="more">еще</a>');
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
		return false;
	}
}

var comment = {
	//Ответ
	reply: function(it, u_nickname){
		$('.commentInputText').focus().val('@'+u_nickname+', ').focus();
		return false;
	},
	//Добавление комментария
	add: function(it, m_id){	
		var mind_data_tosrv = new Object();

			mind_data_tosrv['action'] = 'comment_add';
			mind_data_tosrv['m_id'] = m_id;
			mind_data_tosrv['c_text'] = $(".active .commentInputText").val();

			if(mind_data_tosrv['c_text']==""){
				system.message('Вы не ввели текст комментария', 'error', 1);	
				return false;
			}

			mind_data_tosrv['u_ids'] = [];
			// Пользователи
			var t=0;
			var input = $(".active .commentInputText").val();
			var link = /@([a-zA-Zа-яА-Я0-9_]+)/g;
			var replacedText = (input || '').replace(link,
		      function () { 
		        var matches = Array.prototype.slice.apply(arguments),
		            full = matches[1];
		            t = t+1;
		            mind_data_tosrv['u_ids'].push(full);	       
		        }
		    );

			console.log(mind_data_tosrv['u_ids']);

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

							$(html_comment).css("opacity","0.1").prependTo(".active .mindComments").animate({
								opacity: 1
							});
	
							$(".active .commentInputText").val("");
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
}

var actions = {
	//Удаление мнения
	delPoll: function(m_id, u_nickname){
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
	addPollImagePreview: function(data_this){
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
							$(it).closest(".active .iteamList").html('<div class="iteamDeleted">комментарий удален</div>');
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
            
	 				$(".active .more").remove();
	                $(".active.pageMain").append(iteams);

	                if(data['content']['n_this_notices_last']!=true){
	                  var more = '<a onclick="return actions.loadNotice('+data['content']['n_last_part']+', '+data['content']['n_last_position']+')" class="more">еще</a>';
	                  $(".active.pageMain").append(more);
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
                
                $(".active .more").remove();
                $(".active .mindComments").append(html_comments);

                  if(data['content']['c_this_comments_last']!=true){
                      $(".active .mindComments").append('<a onclick="return actions.loadComments(\''+m_id+'\', '+data['content']['c_last_part']+', '+data['content']['c_last_position']+', '+m_u_im+')" class="more">еще</a>');
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
	searchPolls: function(){
		var search = $('.active input.searchInputText').val();
		if(search.charAt(0) == "#"){
			search = search.replace("#", "");
		}
		nav.goto('/feed/search/'+search);
	},
	searchUsers: function(it, last_u_id){
		//$('#search_tag').html("");
		//Берем данные из инпута, и если в начале нет # то добавляем ее
		var str = $('.active input.searchInputText').val();

		//Данные для отправки на сервер
		var tag_data_tosrv = new Object();
		tag_data_tosrv['user_name'] = str;
		if(last_u_id){
			tag_data_tosrv['last_user_id'] = last_u_id;
		}else{
			$('.active .feedIteams').html('');
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

				$('.active .more').remove();

				$('.active .feedIteams').append(users);

				if(data['content']['u_last']!=true){
                	$(".active .iteamsBlock").append('<a onclick="return actions.searchUsers(this, \''+data['content']['u_finded']['12']['u_id']+'\')" class="more">еще</a>');
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