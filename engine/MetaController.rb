# encoding: UTF-8

class MetaController
	def initialize(env)
		@env = env

		@limit_notice = 12
	end

	def mind_one(data)
		if data[:bool] and @env.client_data['refresh'].nil?
			@env.pool.control.mindid = data[:minds]['m1']['_id'].to_s
			@env.pool.control.action = 'whois'
			@env.pool.send
		end
	end

	def comment_add(data)
		data[:action] = 'comment_add'
		
		HashWrite.new({
			:table       => 'notices',
			:key         => data['m_u_id'],
			:inserted    => data,
			:write_limit => @limit_notice
		}).add unless data['m_u_id'] == @env.client_cookie_id

		@env.pool.control.destination = data['m_u_id']
		@env.pool.control.mindid = data['m_id']
		@env.pool.control.msg = data
		@env.pool.send
	end
	
	def comment_remove(data)
		$mind.update( { :_id => BSON::ObjectId(@env.client_data['m_id']) }, { :$inc => { :c => -1} })
	end

	def mind_add(data)
		#counter
		$authn.update({ :_id => BSON::ObjectId(@env.client_cookie_id) },{ '$inc' => { 'м' => 1} })
		$authn.update({ :_id => BSON::ObjectId(@env.client_cookie_id) },{ :$set => { 'а' => 1000 } }) if @env.client_current_profile[:u_chown] == 9999
		follows = $db_o4em['howFollow'].find({ :anchor => 1, :key => @env.client_cookie_id }).first
		return { :bool => false, :code => 0, :info => "MetaController (mind_data) -> Нет подписчиков для извещения о добовление пользователем #{@env.client_cookie_id} нового мнения" } if follows.nil?

		amount_follows = $limit_follow_document
		amount_follows = $limit_follow_document*follows['part'] if follows['part']

		array_follows = ArrayRead.new({
			:table  => 'howFollow',
			:key    => @env.client_cookie_id,
			:amount => amount_follows
		}).read

		return { :bool => false, :code => 0, :info => "MetaController (mind_data) -> Ошибка подписчиков для извещения о добовление пользователем #{@env.client_cookie_id} нового мнения" } if array_follows[:bool] == false

		1.upto(array_follows[:array_data][:counter]) do |count|
			element = array_follows[:array_data]["#{count}"]
			
			data[:notice][:action] = 'mind_add'
			
			HashWrite.new({
				:table       => 'notices',
				:key         => element,
				:inserted    => data[:notice],
				:write_limit => @limit_notice
			}).add unless element == @env.client_cookie_id if element

			@env.pool.control.destination = element
			@env.pool.control.msg = data[:notice]
			@env.pool.send
		end
	end
	def mind_remove(data)
		$authn.update({ :_id => BSON::ObjectId( @env.client_cookie_id ) },{ :$inc => { 'м' => -1} })
	end
	def follow(data)
		puts "Мета информация для #{__method__}: #{data}" if $log_console

		data[:notice][:action] = 'follow'

		HashWrite.new({
			:table       => 'notices',
			:key         => data[:notice][:key],
			:inserted    => data[:notice],
			:write_limit => @limit_notice
		}).add unless data[:notice][:key] == @env.client_cookie_id

		$authn.update({ :_id => BSON::ObjectId(@env.client_cookie_id)},{ '$inc' => {'н' => 1} })
		$authn.update({ :_id => BSON::ObjectId(data[:notice][:key])  },{ '$inc' => {'п' => 1,'б' => 1 } }) # Увеличиваем "п" подписчиков и "б" информацию для пула

		@env.pool.control.destination = data[:notice][:key]
		@env.pool.control.msg = data[:notice]
		@env.pool.send
	end
	def follow_remove(data)
		data[:notice][:action] = 'follow_remove'
		
		HashWrite.new({
			:table       => 'notices',
			:key         => data[:notice][:removed],
			:inserted    => data[:notice],
			:write_limit => @limit_notice
		}).add

		$authn.update({ :_id => BSON::ObjectId(@env.client_cookie_id)  },{ '$inc' => {'н' => -1} })
		$authn.update({ :_id => BSON::ObjectId(data[:notice][:removed])},{ '$inc' => {'п' => -1,'б' => 1} })

		@env.pool.control.destination = data[:notice][:removed]
		@env.pool.control.msg = data[:notice]
		@env.pool.send
	end
	def mind_minus(data)
		data[:notice][:action] = 'mind_minus'
		HashWrite.new({
			:table       => 'notices',
			:key         => data[:notice][:m_u_id],
			:inserted    => data[:notice],
			:write_limit => @limit_notice
		}).add unless data[:notice][:m_u_id] ==  @env.client_cookie_id

		@env.pool.control.destination = data[:notice][:m_u_id]
		@env.pool.control.msg = data[:notice]
		@env.pool.send
	end
	def mind_plus(data)
		data[:notice][:action] = 'mind_plus'
		
		HashWrite.new({
			:table       => 'notices',
			:key         => data[:notice][:m_u_id],
			:inserted    => data[:notice],
			:write_limit => @limit_notice
		}).add unless data[:notice]['m_u_id'] ==  @env.client_cookie_id

		@env.pool.control.destination = data[:notice][:m_u_id]
		@env.pool.control.msg = data[:notice]
		@env.pool.send
	end
end