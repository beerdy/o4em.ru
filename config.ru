# coding: utf-8

require 'rubygems'
require 'rack'
#require "rack/utf8_sanitizer"
require 'json'

#use Rack::UTF8Sanitizer
#use Rack::Reloader, 0
use Rack::Static, :urls => ['/public']

require './config.rb'
require './engine/MegaController.rb'

$log_console = false

class Router
	def call(env)
		$time_now    = Time.now.to_i
		$env         = env
		returned     = false
		request_path = env['REQUEST_PATH']
		
		puts "REQUEST_PATH: #{request_path}" if $log_console
		
		$lp = request_path.match(%r{^/lp$})
			
		start = MegaController.new(env)

		if $lp then return start.lp end
		if request_path.match(%r{^/confirm/([A-za-z0-9]{16,64})}) then return start.auth('auth_confirm',$1)    end
		if request_path.match(%r{^/vkauth})                       then return start.vkauth                     end
		if request_path.match(%r{^/online$})                      then return start.online                     end
		if request_path.match(%r{^/agregator$})                   then return start.agregator                  end		

		if not start.env.client_data_bool     then return start.index                              end
		if start.env.client_novalid_bool      then return start.error(start.env.client_data_valid) end
		if request_path.match(%r{^/auth$})    then return start.auth                               end
		if start.env.client_noauth_bool       then return start.error(start.env.client_noauth)     end
		if request_path.match(%r{^/logout$})  then return start.auth('auth_logout')                end

		if request_path.match(%r{^/people$})        then return start.search('topminder')          end
		if request_path.match(%r{^/search/people$}) then return start.search('search_people')      end

		if request_path.match(%r{^/$})then return start.route_user("/#{start.env.client_cookie_nickname}") end		
		if CGI.unescape(request_path).match(%r{^/mind/random/([А-Яа-яA-Za-z0-9]{2,32})$}) then return start.mind('mind_random', { :h => "##{$1}"}) end

		if request_path.match(%r{^/mind$})                       then return start.mind                   end
		if request_path.match(%r{^/mind/random$})                then return start.mind('mind_random')    end
		if request_path.match(%r{^/mind/([0-9a-fA-F]{24})})      then return start.mind('mind_one',$1)    end
		if request_path.match(%r{^/profile$})                    then return start.profile                end
		if request_path.match(%r{^/follow$})                     then return start.follow                 end

		if request_path.match(%r{^/following/([a-z0-9]{4,32})$}) then return start.follow('following',$1) end
		if request_path.match(%r{^/followers/([a-z0-9]{4,32})$}) then return start.follow('followers',$1) end
		if request_path =~ /^\/following\/(|(([a-z0-9]+_+)|([a-z0-9]+\-+)|([a-z0-9]+\.+)|([a-z0-9]+\++))*[a-z0-9]+@((\w+\-+)|(\w+\.))*\w{1,63}\.[a-z]{2,6})$/i then return start.follow('following',$1) end
		if request_path =~ /^\/followers\/(|(([a-z0-9]+_+)|([a-z0-9]+\-+)|([a-z0-9]+\.+)|([a-z0-9]+\++))*[a-z0-9]+@((\w+\-+)|(\w+\.))*\w{1,63}\.[a-z]{2,6})$/i then return start.follow('followers',$1) end

		if request_path.match(%r{^/notice$})                     then return start.notice                 end
		if request_path.match(%r{^/tags$})                       then return start.tags                   end


		return start.route_user(request_path) if request_path.match(%r{/([a-z0-9]{4,32})})
		return start.route_user(request_path) if request_path =~ /^(|(([a-z0-9]+_+)|([a-z0-9]+\-+)|([a-z0-9]+\.+)|([a-z0-9]+\++))*[a-z0-9]+@((\w+\-+)|(\w+\.))*\w{1,63}\.[a-z]{2,6})$/i
		if returned == false then return start.error( {:bool => false, :code => 0, :info => "Page not found - #{request_path}"} ) end
	end	
end
run Router.new()