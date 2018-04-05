var lp = {
	listen: function(replay){
		
	var data = new Object();
		data['guid']     = window.guid;
		data['action']   = 'listen';

		if(user.getCookie('u_id') == "" ){
			data['userid']   = window.guid;
			data['username'] = window.guid;
		} else {
			data['userid']   = user.getCookie('u_id');
			data['username'] = user.getCookie('u_nik');
		}
		var link = location.pathname;
		var page = link.split("/");
		mind = page[2];
		page = page[1];

		if( page=='poll' ){
			data['mind'] = mind;
		}

		$.ajax({
			type: "POST",
			url: "/lp",
			contentType: "application/json; charset=UTF-8",
			async: true,
			data: JSON.stringify(data),
				success: function(data_r){
						var link = location.pathname;
						var page = link.split("/");
						var iteams = "";
						mind = page[2];
				        page = page[1];

					window.block = true;
					data = JSON.parse(data_r);
					console.log(data);
					if(data['bool']){
						switch(data['content']['action']){
							case 'lp_noaction':				
								break;
							case 'vkauth':
								user.signUserInModule(data_r);
								break;
							default:
								// Если мы находимся на страничке мнения и ЛП относится к этому мнению
								if(data['content']['m_id'] == mind && data['content']['action'] == 'comment_add'){
									var canDel = false;

									var html_comment = constructor.listComments(data['content']['m_id'], data['content']); 
	         
									$(html_comment).css("opacity","0.1").prependTo(".active .mindComments").animate({
										opacity: 1
									});
								// Если мы находимся на cтранице уведомлений
								}else if(page == "notice"){
									if(data['content']['action'] != 'online'){ 
										var html_notice = constructor.listNotice(data['content']);
							            $(html_notice).css("opacity","0.1").prependTo(".active .pageBox").animate({
											opacity: 1
										});
						        	}
								// Если мы находимся на любой странице
								}else{
									if(data['content']['action'] != 'online' && data['content']['u_im']){ 
										if($(".navBarIteam.notice .count").length) {
											var value = parseFloat($(".navBarIteam.notice .count").text())+1;
											$(".navBarIteam.notice .count").text(value);
										}else{
											$(".navBarIteam.notice").append('<div class="count">1</div>');
										}
									}
								}

								//Отдельно считаем пользователей онлайн
								if(page = 'poll' && data['content']['m_online']){
									var html_online = '';
								    var onlint_c = 0;
									$.each(data['content']['m_online'], function(i, online) {
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
									$(".pollCardBox.online .boxContent").html(html_online);
									$(".pollCardBox.online .boxCount").html(onlint_c);
								}

								break;
						}
					}
					if(replay){
						lp.listen(true);
					}
				},
				error: function(){
					//lp.listen(true);
				}
			});
	},
	// Делаем guid для каждой вкладки. 
	// Может сразу сформироваться так как не зависит от данных пользователя
	guid_:function(){
		function s4() {
			return Math.floor((1 + Math.random()) * 0x10000)
				.toString(16)
				.substring(1);
			}
		return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
	}
}