# coding: utf-8

module RouteValidator
	def validate_by_route(data)
		actions = [
			'',
			'lp',
			'mind_read',
#			'mind_one',           # Не валидируем - валидируется в роуторе
			'mind_liked',
			'mind_add',
			'comment_add',
			'comment_get',
			'field_check',
			'auth_sign',
			'agregate_comments',
			'agregate_minds',
			'agregate_follows',
			'agregate_mind_liks_disliks',
			'auth_restore'
		]
		vl = Validator.new(data)
		return eval( "vl.#{data['action']}" ) if actions.include?(data['action'])
		{ :bool => true, :code => 0, :info => "Нет маршрута - #{data['action']}" }
	end
	extend self
end

class Validator
	# 451 - ошибка данных
	# 452 - ошибка авторизационных данных
	# 453 - неверный пароль
	# 454 - text length
	# 455 - email bad
	# 456 - ip bad
	# 457 - bad id
	# 458 - bad tag
	# 459 - имя error
	# 460 - чето с количеством тегов
	# 461 - ошибка числовых данных
	# 462 - id в комментарии
	# 463 - при добавление в комментарии
	# 464 - чтение коммнетарий
	# 465 - чтение мнения 
	# 466 - мнение

	# 467 - лайки
	# 468 - лайки
	# 469 - лайки
	# 471 - попытка использовать сервисные данные сервисны 
	# 470 - ошибка метаданных удаления комментария

#472 - никнейм занят
#473 - mail exist
#472 - nikname exist
#474 - пользователь неактивен новая ссылка для активации выслана на емаил


	# 551 - email валидный
	# 552 - username good
	# 553 - текстовое поле ок
	# 554 - password ok
	# 555 - ip ok
	# 556 - id ok
	# 557 - good tag
	# 558 - имя ок


	def initialize(data)
		@data = data
	end
	def lp
		{ :bool => true }
	end
	def profile
		return name(@data['name'],'Неверный формат имя пользователя') if @data['action'] == 'change_name'
		return email(@data['email'],'Неверный формат email') if @data['action'] == 'change_email'
		r = name(@data['name'],'Неверный формат имя пользователя')
		return r if not r[:bool]
		r = name(@data['city'],'Неверный формат названия города')
		return r if not r[:bool]
		r = name(@data['country'],'Неверный формат названия страны')
		return r if not r[:bool]
		r = string(@data['about'],64,'Неверный формат описания')
	end
##
	def auth_restore
		email(@data['email'],'Неверный формат email')
	end
	def agregate_mind_liks_disliks
		r = { :bool => true }
		r = id(@data['id']) if !@data['id'].nil?
		r
	end
	def agregate_comments
		r = { :bool => true }
		r = id(@data['id']) if !@data['id'].nil?
		r
	end
	def agregate_minds
		r = { :bool => true }
		r = id(@data['id']) unless @data['id'] == '' unless @data['id'].nil?
		r
	end
	def agregate_follows
		r = { :bool => true }
		r = id(@data['id']) if !@data['id'].nil?
		r
	end

	def mind_read
		r = { :bool => true }
		r = id(@data['u_id']) if !@data['u_id'].nil?
		return r if not r[:bool]
		return id(@data['m_last_id']) if !@data['m_last_id'].nil?
		r
	end
	def mind_liked
		r = id(@data[:usercookie_id],'Ошибка id при попытке вывода мнений')
		return r if not r[:bool]
		return { :bool => false, :code => 469, :info => "Ошибка cчетчика лайков" }          if !@data['endcount'].is_a? Integer if !@data['endcount'].nil?
		return { :bool => false, :code => 468, :info => "Ошибка cчетчика частей лайков" }   if !@data['endpart'].is_a?  Integer if !@data['endpart'].nil?
		return { :bool => false, :code => 467, :info => "Ошибка количества вывода лайков" } if !@data['amount'].is_a?   Integer if !@data['amount'].nil?
		{ :bool => true }
	end
	def mind_add
		return { :bool => false, :code => 4601, :info => "Ошибка добавления счетчик вариантов" } if @data['f_count'].nil?
		f_count = @data['f_count'].to_i
		return { :bool => false, :code => 4602, :info => "Ошибка данных оснований для спора должно быть не меньше 2 и не больше #{$limit_filed}" } if f_count > $limit_filed or f_count < 2

		1.upto(f_count) do |i|
			r = string( @data["f_text#{i}"], 512, 'Неверный формат основания спора',1 )
			return r if not r[:bool]
		end

		return error if @data['t1'].nil?
		return error if @data['kt'].nil?
		kt = @data['kt'].to_i
		return error if kt < 1 or kt > 5
#		st = @data['status'].to_i
#		return error if st < 1 or st > 5
		1.upto(kt) do |i|
			r = tag(@data["t#{i}"],'Неверный формат tags')
			return r if not r[:bool]
		end

		string(@data['text'],512,'Неверный формат text')
		#return r if not r[:bool]

		#string(@data['them'],128,'Неверный формат them')
	end
	def field_check
		r = id(@data["mindid"],'Ошибка id при попытке проголосовать')
		return r if not r[:bool]
		{ :bool => true }
	end
##
	def comment_get
		r = id(@data['m_id'])
		return r if not r[:bool]
		return { :bool => false, :code => 465, :info => "Ошибка cчетчика комментария" }        if !@data['m_c_amount'].is_a? Integer        if !@data['m_c_amount'].nil?
		return { :bool => false, :code => 464, :info => "Ошибка cчетчика частей комментария" } if !@data['m_c_last_part'].is_a? Integer     if !@data['m_c_last_part'].nil?
		return { :bool => false, :code => 464, :info => "Ошибка cчетчика частей комментария" } if !@data['m_c_last_position'].is_a? Integer if !@data['m_c_last_position'].nil?
		{ :bool => true }
	end
	def comment_add
		return  { :bool => false, :code => 463, :info => "Длина комментария не может превышать 140 символов и не меньше 2" } if @data['c_text'].nil?
		return  { :bool => false, :code => 463, :info => "Длина комментария не может превышать 140 символов и не меньше 2" } if @data['c_text'].length > 140 and @data['c_text'].length < 2
		id(@data['m_id'], 'Ошибка id при попытке при попытке добавления комментария')
	end

	def delcomment
		return { :bool => false, :code => 470, :info => "Ошибка метаданных удаления комментария" } if @data['position'] < 1 or @data['position'] > 100000 or @data['part'] < 0 or @data['part'] > 100000
		id(@data['idmind'],'Ошибка id удаления комментария')
	end
	def auth_sign
		return { :bool => false, :code => 451, :info => "Ошибка данных" }                          if @data.nil? or @data == ''
		return { :bool => false, :code => 471, :info => "Ошибка данных - сервисный пользователь" } if @data['username'] == 'server1'
		return { :bool => false, :code => 471, :info => "Ошибка данных - сервисный префикс" }      if @data['username'].match(%r{vkuser})
		r = username(@data['username'],'Неверный формат имя пользователя')
		return r if not r[:bool]
		return { :bool => false, :code => 455, :info => "Ошибка данных - некорректный email" }     if @data['email'] == ''
		r = email( @data['email'], 'Неверный формат email')
		return r if not r[:bool]
		return { :bool => false, :code => 453, :info => "Ошибка данных - некорректный пароль" }    if @data['password'] == ''
		password(@data['password'],'Неверный формат пароля')
	end
	def auth_login
		return { :bool => false, :code => 451, :info => "Ошибка данных" } if @data.nil? or @data == ''		

		r = password(@data['password'],'Неверный формат пароля')
		return r if not r[:bool]

		r = email(@data['name'],'Неверный формат email')
		if r[:bool] then
			return { :bool => false, :code => 455, :info => "Невозможно использовать сервисный e-mail" } if @data['name'] == $service_email
			r
		else
			username(@data['name'],'Неверный формат имя пользователя или email')
		end
	end
	def auth_restore
		r = email(@data['name'],'Неверный формат email')
		r = username(@data['name'],'Неверный формат имя пользователя или email') unless r[:bool]
		return r
	end
	def check_token
		r = string(@data[:token],64,'error token')
		return r if not r[:bool]
		
		r = id(@data[:usercookie_id])
		return r if not r[:bool]

		username(@data[:usercookie],'Неверный формат имя пользователя')
	end

	#==========================
	def tag(t,data=nil)
		if t =~ /^#[А-Яа-яA-Za-z0-9]{2,32}$/ then
			{ :bool => true, :code => 558, :info => "ok tag", :data => data }
		else
			{ :bool => false, :code => 457, :info => "null tag error", :data => data }
		end		
	end
	def email(e,data=nil)
		if e =~ /^(|(([A-Za-z0-9]+_+)|([A-Za-z0-9]+\-+)|([A-Za-z0-9]+\.+)|([A-Za-z0-9]+\++))*[A-Za-z0-9]+@((\w+\-+)|(\w+\.))*\w{1,63}\.[a-zA-Z]{2,6})$/i then
			{ :bool => true, :code => 551, :info => "email ok" }
		else
			{ :bool => false, :code => 455, :info => "email error", :data => data}
		end
	end
	def username(u,data=nil)
		if u =~ /^[A-Za-z0-9]{4,32}$/ then
			{ :bool => true, :code => 552, :info => "username ok" }
		else
			{ :bool => false, :code => 452, :info => "username error", :data => data}
		end
	end
	def password(p,data=nil)
		if p =~ /^[a-zA-Z0-9_-]{6,18}$/ then
			{ :bool => true, :code => 554, :info => "password ok", :data => data}	
		else
			{ :bool => false, :code => 453, :info => "password error", :data => data}
		end
	end
	def name(n,data=nil)
		if n =~ /^[А-Яа-яA-Za-z0-9-]{2,32}$/ then
			{ :bool => true, :code => 558, :info => "Строка, тип - валидный", :data => data}	
		else
			{ :bool => false, :code => 459, :info => "Строка, тип - не валидный", :data => data}
		end		
	end
	def string(str,n,data=nil,min=2)
		if str.nil? or not (str.length < n and str.length >= min and (str.match(%r{^\s+$})).nil? ) then
			{ :bool => false, :code => 454, :info => "text error #{n} symbols", :data => data}
		else
			{ :bool => true, :code => 553, :info => "text ok"}
		end
	end
	def ip(i)
		if i =~ /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/ then
			{ :bool => true, :code => 555, :info => "ip ok"}
		else
			{ :bool => false, :code => 456, :info => "ip bad"}
		end
	end
	def id(i,data=nil)
		if i =~ /^[0-9a-fA-F]{24}$/ then
			{ :bool => true, :code => 556, :info => "id ok",:data=>data}
		else
			{ :bool => false, :code => 457, :info => "id bad",:data=>data}
		end
	end		
end