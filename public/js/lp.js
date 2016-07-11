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
			url: "http://o4em.ru/lp", 
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
								if(data['content']['m_id'] == mind && data['content']['action'] == 'comment_add'){
									var html_comment = constructor.listComments(data['content']['m_id'], data['content']); 
	         
									$(html_comment).css("opacity","0.1").prependTo(".new .mindComments").animate({
										opacity: 1
									});
								}else if(page == "notice"){
									var html_notice = constructor.listNotice(data['content']);
						            $(html_notice).css("opacity","0.1").prependTo(".page.new").animate({
										opacity: 1
									});
								}else{ // Если мы находимся на любой странице
									if($(".navBarIteam.notice .count").length) {
										var value = parseFloat($(".navBarIteam.notice .count").text())+1;
										$(".navBarIteam.notice .count").text(value);
									}else{
										$(".navBarIteam.notice").append('<div class="count">1</div>');
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