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

		if( page=='mind' ){
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
	         
									$(html_comment).css("opacity","0.1").prependTo(".new .mindComments").animate({
										opacity: 1
									});
								// Если мы находимся на cтранице уведомлений
								}else if(page == "notice"){
									var html_notice = constructor.listNotice(data['content']);
						            $(html_notice).css("opacity","0.1").prependTo(".page.new").animate({
										opacity: 1
									});
								// Если мы находимся на любой странице
								}else{
									if(data['content']['action'] != 'online'){ 
										if($(".navBarIteam.notice .count").length) {
											var value = parseFloat($(".navBarIteam.notice .count").text())+1;
											$(".navBarIteam.notice .count").text(value);
										}else{
											$(".navBarIteam.notice").append('<div class="count">1</div>');
										}
									}
								}

								//Отдельно считаем пользователей онлайн
								if(page = 'mind' && data['content']['m_online']){
									    var html_online = '';
									    var online_count = 0;
									    if(data['content']['m_online']){
										    $.each(data['content']['m_online'], function(i, online) {
										     	var ava ="";
											   	if(online['u_photo']){
											   		ava = "<img src='/"+online['u_photo']+"_r40x40.jpg' width='25' title='' alt=''/>";
											   	}else{
											   		ava = "<img src='/public/img/ico-online.png' width='25' title='' alt=''/>";
											   	}
										      html_online += '<a href="/'+online['u_nickname']+'" onclick="return nav.go(this)" class="mindOnlineIteam">'+ava+'<span>@'+online['u_nickname']+'</span></a>';
										      online_count++;
										    });
										    $(".mindOnlineBox").html(html_online);
										    $(".mindOnlineH b").html(online_count);
									    }
								}

								break;
						}
					}
					if(replay){
						lp.listen(true);
					}
				},
				error: function(){
           			system.message('С нашим сервером что-то не так... попробуйте обновить страницу','error',1);
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