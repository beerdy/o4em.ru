# encoding: UTF-8

require 'net/smtp'
require './email.rb'

class AuthMail
	include SendMail
	def initialize(email,username,code)
		@email = email
		@username = username
		@code = code
	end

def reg
@msgstr = <<END_OF_MESSAGE
From: O4EM.RU <service@o4em.ru>
To: #{@email}
MIME-Version: 1.0
Content-type: text/html
Subject: Подтверждение регистрации
Date: #{Time.now}

Здравствуйте, <b>#{@username}!</b><br>
Вы зарегистрировались на сайте O4EM.RU!<br><br>

Ссылка для подтверждения регистрации:<br>
#{$root_o4em}/confirm/#{@code}
END_OF_MESSAGE
send
end

def edit
@msgstr = <<END_OF_MESSAGE
From: O4EM.RU <service@o4em.ru>
To: #{@email}
MIME-Version: 1.0
Content-type: text/html
Subject: Edit profile check code
Date: #{Time.now}

Confirm - #{$root_o4em}/confirm/#{@code} for #{@username}
END_OF_MESSAGE
send
end

def confirm
@msgstr = <<END_OF_MESSAGE
From: O4EM.RU <service@o4em.ru>
To: #{@email}
MIME-Version: 1.0
Content-type: text/html
Subject: Регистрация на сайте
Date: #{Time.now}

Здравствуйте, <b>#{@username}!</b><br>
Вы успешно зарегистрировались на сайте O4EM.RU!<br><br>

Ваши авторизационные данные:<br>
Логин: <b>#{@email}</b> или <b>#{@username}</b><br>
Пароль: <b>#{@code}</b>

END_OF_MESSAGE
send
end

def restore
@msgstr = <<END_OF_MESSAGE
From: O4EM.RU <service@o4em.ru>
To: #{@email}
MIME-Version: 1.0
Content-type: text/html
Subject: Восстановление пароля
Date: #{Time.now}

Здравствуйте, <b>#{@username}!</b><br>
Мы получили запрос на смену вашего пароля.<br><br>

Ссылка для смена пароля:<br>
#{$root_o4em}/restore/#{@code}/#{@username}<br><br>

Если вы отклоните это сообщение, ваш пароль не будет изменен.

END_OF_MESSAGE
send
end
end