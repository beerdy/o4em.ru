# encoding: UTF-8

require './VD0.3.rb'

require './pool/router.rb'

require './engine/HopPage.rb'
require './engine/MindLike.rb'
require './engine/MindReading.rb'
require './engine/MindAdd.rb'
require './engine/MindRemove.rb'
require './engine/UploadSimpleB64.rb'
require './engine/BlockData.rb'
require './engine/HashBlock.rb'
require './engine/Comment.rb'
require './engine/Follow.rb'
require './engine/Notice.rb'
require './engine/Tags.rb'
require './engine/QuantumSearch.rb'
require './engine/Profile.rb'
require './engine/Agregator.rb'
require './engine/People.rb'

require './engine/MetaController.rb'

require 'securerandom'
require 'erb'

###########################################################################################################################################
module RenderPage
	STATUS_DEFAULT         = 200
	HEADERS_DEFAULT        = { 'Content-Type' => 'text/plain' }
	PAGE_HTM_DEFAULT       = './view/index.htm'
	HEADERS_DEFAULT_STATIC = {'Content-Type' => 'text/html', 'charset' => 'utf-8'}

	def render_page(options)
		#MetaController.new( options, @env ).make
		#MetaController.new( options, @env ).make
		status   = (options[:status].nil?)?(STATUS_DEFAULT):options[:status]
		headers	 = (options[:headers].nil?)?(HEADERS_DEFAULT):options[:headers]
		page_htm = (options[:page_htm].nil?)?(PAGE_HTM_DEFAULT):options[:page_htm]
		static   = (options[:static].nil?)?false:options[:static]
		headers  = HEADERS_DEFAULT_STATIC if options[:headers].nil? if static

		return [status, headers, [ ERB.new(IO.read( page_htm )).result(binding) ]] if static
		return [status, headers, [ VolodiyaDriver.convert( options[:data] ).to_json ]] if (options[:tojson].nil?)?true:options[:tojson]
		return [status, headers, [ '{"bool":"false","code":"0","info":"no render options"}' ]]
	end
	module_function :render_page
end

class MegaController

	attr_reader :env
	
	include RenderPage
	include Comment
	include MindRemove

	def initialize(env)
		@env  = Environment.new(env)
		@meta = MetaController.new( @env ) 
	end

	def agregator
		if @env.client_json_bool
			obj = Agregator.new({
				:userid => @env.client_cookie_id,
				:mindid => @env.client_data['id']
			}, @env.client_action )
			
			case @env.client_action
			when 'agregate_follows'
				data = obj.recount_follows_for_userid
			when 'agregate_minds'
				data = obj.recount_minds_for_userid
			when 'agregate_comments'
				data = obj.recount_comments_for_mindid
			when 'agregate_mind_liks_disliks'
				data = obj.recount_mind_liks_disliks
			when 'static'
				data = {}
			end
		end

		render_page({
			:data     => data,
			:page_htm => './view/agregator.htm',
			:static   => ((@env.client_json_bool)?false:true)
		})
	end

	def vkauth
		render_page({
			:page_htm => './view/vkauth.htm',
			:static   => true
		})
	end
	def auth( action=@env.client_action, code=nil )
		@env.client_action = action
		case action
		when 'auth_sign'
			@env.client_auth.username = @env.client_data['username']
			@env.client_auth.email    = @env.client_data['email']
			@env.client_auth.password = @env.client_data['password']
			return render_page({ :data => @env.client_auth.sign })
		when 'auth_login'
			@env.client_auth.name     = @env.client_data['name']
			@env.client_auth.password = @env.client_data['password']
			user_data, headers        = @env.client_auth.login

			return render_page({ :data => user_data }) if !user_data[:bool]

			mind_data = MindReading.new({ :usercookie_id => user_data[:user_data][:u_id] },@env.pool).read
			return render_page({ 
				:data => { 
					:bool   => true, 
					:code   => 0,
					:info   => 'Успешная авторизация "Вход"',
					:action => 'auth_login',
					:user   => user_data[:user_data],
					:minds  => mind_data[:minds]
				},
				:headers => headers
			})
		when 'auth_restore'
			@env.client_auth.name = @env.client_data['name']
			data = @env.client_auth.restore
			render_page({ :data => data })
		when 'restore_confirm'
			@env.client_auth.name = @env.client_data['name']
			@env.client_auth.code = @env.client_data['code']
			@env.client_auth.password = @env.client_data['password']
			render_page({ :data => @env.client_auth.restore_confirm })
		when 'auth_logout'
			user_data, headers = @env.client_auth.reset
			render_page({
				:data    => user_data,
				:headers => headers
			})	
		when 'auth_confirm'
			@env.client_auth.code = code
			data = @env.client_auth.confirm
			if data[:bool] then data else data = { :bool => true, :code => 0, :info => 'подтверждение' } end
			render_page({ :data => data, :static => !@env.client_data_bool })
		end
	end
	
	def lp
		puts "Client_data #{@env.client_data}" if $log_console

		case @env.client_action
		when 'lp_send'
		when 'vkauth'
			@env.pool.control.destination = @env.client_data['to']
			@env.pool.control.action = @env.client_action
			@env.pool.control.msg = @env.client_data
			@env.pool.send
		when 'listen'
			@env.pool.listen
		end

		# CallBack for LongPool
		puts "MC - data pool onlie #{@env.pool.success.received_message_online}" if $log_console
		case @env.pool.success.action_pool
		when 'vkauth'
			@env.pool.success.received_message['code'] = @env.pool.success.received_message['guid']
			@env.pool.success.received_message['guid'] = @env.pool.success.received_message['to']

			msg, headers = VkontakteAuth.sing_in_vkontakte( 
				@env.pool.success.received_message, 
				@env.client_ip,
				@env.client_agent
			)
			puts "Учетные данные после аторизации контакта msg:#{msg}, headers:#{headers}" if $log_console

			mind_data = MindReading.new({ :usercookie_id => msg[:user_data][:u_id] },@env.pool).read

			return render_page( { 
				:data => { 
					:bool   => true, 
					:code   => 0,
					:info   => 'Успешная авторизация "vkuth"',
					:action => 'vkauth',
					:user   => msg[:user_data],
					:minds  => mind_data[:minds]
				},
				:headers => headers
			})
		when 'lp_send', 'online'
			data = RouteLongPool.route(@env.pool)
		else
			data = { :bool => true, :code => 0, :action => 'lp_noaction' }
		end
		render_page({ :data => data })
	end

	def index
		render_page({:static => true})
	end
	
	def mind(action=nil, word=nil)
		@env.client_action = action if not action.nil?

		minds = MindReading.new({
			:usercookie_id_other => @env.client_data['u_id'],
			:usercookie_id       => @env.client_cookie_id,
			:current_profile     => @env.client_current_profile,
			:endtime             => @env.client_data['m_last_id'],
			:mindid              => @env.client_data['m_id']
		},@env.pool)

		case @env.client_action
		when 'minds_read'
			data = minds.read
		when 'mind_one'
			minds.mindid = word
			data = minds.one
			@meta.mind_one(data)
		when 'mind_random'
			data = minds.random(word)
			@meta.mind_one(data)
		when 'mind_liked'
			data = minds.liked(
				@env.client_data['amount'],
				@env.client_data['endpart'],
				@env.client_data['endcount'])
		when 'mind_add'
			mind_data = Mind.new( @env.client_cookie_id, @env.client_data ).add
			return render_page({ :data => mind_data }) unless mind_data[:bool]

			data = UploadMindBackground.new().upload( @env.client_data["the-file1"], @env.client_cookie_id, mind_data[:notice]['m_id']  )
=begin
			mind_upload = UploadMind.new( 
				@env.client_env,
				{ :usercookie_id => @env.client_cookie_id },
				mind_data[:notice]['m_id']
			).multi_upload
			if not mind_upload.nil? and mind_upload[:data].has_key?(0) then
				data = mind_data
			else
				# Удалим мнение если неудачная загрузка
				$mind.update({ :_id => BSON::ObjectId( mind_data[:notice]['m_id'] ) },{ :$set => {:m=>true}} )
				#$mind.remove({ :_id => BSON::ObjectId( mind[:idmind]) })
				data = { :bool => false, :code => 0, :info => "Мнение помечено на удаление т.к. не удалось загрузить изображение" }
			end
=end
			if data[:bool]
				@meta.mind_add(mind_data)
				data = mind_data
			else
				$mind.update({ :_id => BSON::ObjectId( mind_data[:notice]['m_id'] ) },{ :$set => {:m=>true}} )
			end
		when 'mind_minus'
			like = LikeUser.new( 'likeUser', # Счетчики изменяются внутри 258-273
			{ 
				:status        => 2,
				:idmind        => @env.client_data['idmind'],
				:usercookie_id => @env.client_cookie_id
			})
			like.comit
			data = like.send
			@meta.mind_minus(data) if data[:bool]
		when 'mind_plus'
			like = LikeUser.new( 'likeUser', # Счетчики изменяются внутри 258-273
			{
				:status        => 1,
				:idmind        => @env.client_data['idmind'],
				:usercookie_id => @env.client_cookie_id
			})
			like.comit
			data = like.send
			@meta.mind_plus(data) if data[:bool]
		when 'mind_remove'
			data = mind_remove
			@meta.mind_remove( data ) if data[:bool]
		when 'comment_add'
			data = comment_add
		when 'comments_read'
			data = comments_read
		when 'comment_remove'
			data = comment_remove
		end
		
		render_page({ :data => data	})
	end
	def tags
		case @env.client_action
		when 'add'
			data = Tags.new(@env.client_data).add
		else
			data = { :bool => true, :code => 0, :action =>'tags_default', :user => @env.client_current_profile }
		end
		render_page({ 
			:data => data,
			:static => !@env.client_data_bool # не обязательно
		})
	end

	def search(action=@env.client_action)
		@env.client_action = action unless action.nil?

		case @env.client_action
		when 'search_people'
			data = People.new(@env).search_people
		when 'tags'
			data = Tags.new(@env.client_data).search
		when 'topminder'
			data = People.new(@env).top_minder
			data[:user] = @env.client_current_profile if data[:bool]
		else
			data = { :bool => true, :code => 0, :info =>'static page search' }
		end
		render_page({ :data => data	})
	end

	def profile
		case @env.client_action
		when 'username_change'
			data = ProfileChange.new( @env).username
		when 'password_change'
			data, headers = ProfileChange.new( @env ).password
			return render_page( { :data => data, :headers => headers } ) if data[:bool]
		when 'shareinfo_change'
			data = ProfileChange.new( @env ).shareinfo 
		when 'photo_change'
			obj = UploadAva.new( @env.client_data["the-file1"], @env.client_cookie_id )
			data = obj.data
		else
			data = { :bool => true, :code => 0, :action =>'profile_default', :user => @env.client_current_profile }
		end
		render_page({ :data => data })
	end

	def follow(action=nil,user=false)
		if user then
			@env.client_action = action
			user_data = $authn.find({'я'=>user}).first
			key       = user_data['_id'].to_s
		else
			key=(@env.client_data['u_id'].nil?)?(@env.client_cookie_id):(@env.client_data['u_id'])
		end

		case @env.client_action
		when 'follow'
			begin
			data = Follow.new({
				:table    => 'imFollow',
				:key      => @env.client_cookie_id,
				:inserted => @env.client_data['u_id']
			}).add
			break if data[:bool] == false
			data = Follow.new({
				:table    => 'howFollow',
				:key      => @env.client_data['u_id'],
				:inserted => @env.client_cookie_id
			}).add
			break if data[:bool] == false
			@meta.follow(data)
			end while false
		when 'following'
			data = Follow.new({
				:usercookie_id => @env.client_cookie_id,
				:table    => 'imFollow',
				:key      => key,
				:part     => @env.client_data['f_last_part'],
				:position => @env.client_data['f_last_position']
			}).get
		when 'followers'
			data = Follow.new({
				:usercookie_id => @env.client_cookie_id,

				:table    => 'howFollow',
				:key      => key,
				:part     => @env.client_data['f_last_part'],
				:position => @env.client_data['f_last_position']
			}).get
		when 'follow_remove'
			begin
			data = Follow.new({
				:key      => @env.client_cookie_id,
				:removed  => @env.client_data['u_id']
			}).remove
			break if data[:bool] == false
			@meta.follow_remove(data)
			end while false
		end
		render_page({ :data => data	})
	end
	def notice
		@env.client_action = 'notices'
		data = Notice.new({
			:key           => @env.client_cookie_id,
			:last_part     => (@env.client_data['n_last_part'].to_i if @env.client_data['n_last_part']),
			:last_position => (@env.client_data['n_last_position'].to_i if @env.client_data['n_last_position']),
			:amount        => @env.client_data['amount']
		}).read
		render_page({ :data => data	})
	end
	def route_user(nickname)
		nickname[0] = ''
		user_data=nickname==(@env.client_cookie_nickname)?(@env.client_current_profile):NewUser.get_user( @env.client_cookie_id, nil, nil, nickname )
		mind_data = MindReading.new({
			:usercookie_id       => @env.client_cookie_id,
			:usercookie_id_other => user_data[:u_id]
		},@env.pool).read
		render_page({
			:data   => { 
				:bool   => true, 
				:code   => 0, 
				:action =>'route_user', 
				:user   => user_data,
				:minds  => mind_data[:minds] 
			},
			:static => !@env.client_data_bool
		})
	end
	def error(message)
		render_page({ 
			:data   => message,
			:static => !@env.client_data_bool	
		})
	end
end