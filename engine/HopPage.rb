# encoding: UTF-8

require './engine/validator.rb'
require './engine/AuthHyb.rb'
require './engine/LPCycler.rb'

class Environment
#	ACTIONS_FOR_INIT_LONGPOOL  = ['comment_add','follow','follow_remove','mind_add','mind_random','mind_one','mind_plus','mind_minus']
#	REQUESTS_FOR_INIT_LONGPOOL = ['/lp']

	attr_accessor :client_auth
	attr_accessor :client_action
	attr_accessor :pool

	attr_reader :client_env
	attr_reader :client_ip
	attr_reader :client_agent
	attr_reader :client_cookie_nickname
	attr_reader :client_cookie_id
	attr_reader :client_cookie_token
	attr_reader :client_current_profile

	#attr_reader :client_form_bool
	attr_reader :client_json_bool
	#attr_reader :client_data_json
	#attr_reader :client_data_form

	attr_reader :client_data
	attr_reader :client_data_bool
	attr_reader :client_data_valid
	attr_reader :client_novalid_bool
	attr_reader :client_noauth_bool
	attr_reader :client_noauth

	attr_reader :client_input
	def initialize(env) 
		@server_errors = Array.new

		@client_request =env['REQUEST_PATH']

		@client_env = env
		request = Rack::Request.new(env)

		@client_ip    = ip
		@client_agent = env['HTTP_USER_AGENT']
		@client_input = env["rack.input"].read

		@client_cookie_nickname = request.cookies['u_nik']
		@client_cookie_id       = request.cookies['u_id']
		@client_cookie_token    = request.cookies['token']


		@client_form_bool = form_bool
		@client_json_bool = json_bool
		@client_data_form = request.params
		@client_data_json = data_json
		@client_data      = data_client
		@client_data_bool = data_bool

		@client_novalid_bool = novalidate_bool

		@client_action = data_action

		@client_auth = AuthHybrid.new({
				:useragent => @client_agent,
				:ipaddress => @client_ip,
				:username  => @client_cookie_nickname,
				:userid    => @client_cookie_id,
				:token     => @client_cookie_token
		})
		@client_noauth_bool = check_auth

		init_longpool
		unless @client_request == '/lp'
			connected_user_info #if $log_console
			update_online_time
		end
	end
	
	private
	def ip
		if @client_env['HTTP_X_REAL_IP'].nil? then
			@client_env['HTTP_X_FORWARDED_FOR'] #apache
		else
			@client_env['HTTP_X_REAL_IP']       #nginx
		end
	end
	def form_bool
		return true if @client_input =~ /form-data/
		return false
	end
	def json_bool
		return true if not (@client_input === '' or @client_input.nil?) if !@client_form_bool
		return false
	end
=begin
	def data_form	
	end
=end
	def data_json
		begin
			JSON.parse(@client_input) if !@client_form_bool and @client_json_bool
		rescue => ex
			@client_json_bool = false
			{ :bool => false, :code => 0, :info => 'bad client json data' }
		end
	end
	def data_client
		return @client_data_json if @client_json_bool
		return @client_data_form if @client_form_bool
	end
	def data_bool
		return true if @client_json_bool or @client_form_bool
		return false
	end
	def novalidate_bool
		@client_data_valid = RouteValidator.validate_by_route(@client_data_json) if @client_json_bool
		@client_data_valid = RouteValidator.validate_by_route(@client_data_form) if @client_form_bool
		@client_data_valid = { :bool => false, :code => 0, :info => 'no data' }	 if not @client_data_bool
		return false if @client_data_valid[:bool] 
		return true
	end
	def data_action
		return @client_data_form['action'] if @client_form_bool
		return @client_data_json['action'] if @client_json_bool
	end
	def check_auth
		user_data = @client_auth.check
		if user_data[:bool] then
			@client_current_profile = user_data[:user_data]
			false
		else
			@client_noauth = user_data
			true
		end 
	end
	def init_longpool
			@pool = LPCycler.new( @client_cookie_id, @client_data, @client_noauth_bool )
	end
	def update_online_time
		return if @client_cookie_id.nil?
		$authn.update({ :_id => BSON::ObjectId(@client_cookie_id)}, { :$set =>{ 'х'=>Time.now.to_i }}) if @client_cookie_id.match(%r{^[0-9a-fA-F]{24}})
	end
	def connected_user_info
		puts "###################################"
		puts "###################################"
		puts "###################################"
		puts "HopPage Подключен пользователь:"
		puts " - Время активности -> #{Time.now}"
		puts " - IP               -> #{@client_ip}," 
		puts " - UserAgent        -> #{@client_agent},"
		puts " - UserCookie_ID    -> #{@client_cookie_id},"
		puts " - UserCookie_Name  -> #{@client_cookie_nickname},"
		puts " - Client data json -> #{@client_data_json},"
		puts " - Client data form -> #{@client_data_form},"
	end
end