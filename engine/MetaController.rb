# encoding: UTF-8

class MetaController
	attr_reader :result

	def initialize(env)
		@env = env

		@limit_notice = 12
	end

	def mind_one(data)
		puts "data for meta: #{data}"
		if data[:bool] and @env.client_data['refresh'].nil?
			@env.pool.control.mindid = data[:minds]['m1']['_id'].to_s
			@env.pool.control.action = 'whois'
			@env.pool.send
		end
	end

	def field_add(data)
		$meta.update({:counter => { :$exists => true }},{:$inc => {:o => 1}})
		case data[:status]
		when 1
			@result = $mind.find_and_modify({
				:query  => { :_id => BSON::ObjectId( @env.client_data['mindid']) },
				:update => { :$inc => { "f.f_count#{@env.client_data['field']}" => 1, :g => 1 }},
				:new    => true
			})
			$authn.update({:_id => BSON::ObjectId(@env.client_cookie_id)},{:$inc => {'в'=> 1}})
			#$mind.update({ :_id => BSON::ObjectId( @env.client_data['mindid']) },{ :$inc => { "f.f_count#{@env.client_data['field']}" => 1 }} )
		when 0
			@result = $mind.find_and_modify({
				:query  => { :_id => BSON::ObjectId( @env.client_data['mindid']) },
				:update => { :$inc => { "f.f_count#{data[:field]}" => -1,"f.f_count#{@env.client_data['field']}" => 1, }},
				:new    => true
			})

			#$mind.update({ :_id => BSON::ObjectId( @env.client_data['mindid']) },{ :$inc => { "f.f_count#{data[:field]}" => -1,"f.f_count#{@env.client_data['field']}" => 1, }} )
		when -1
			@result = $mind.find_and_modify({
				:query  => { :_id => BSON::ObjectId( @env.client_data['mindid']) },
				:update => { :$inc => { "f.f_count#{@env.client_data['field']}" => -1, :g => -1 }},
				:new    => true
			})

			$authn.update({:_id => BSON::ObjectId(@env.client_cookie_id)},{:$inc => {'в'=> -1}})
			#$mind.update({ :_id => BSON::ObjectId( @env.client_data['mindid']) },{ :$inc => { "f.f_count#{@env.client_data['field']}" => -1 }} )
		end
		
		field_number_selected = @env.client_data['field'][1..-1]
		text_field_selected = @result['f']["f_text#{field_number_selected}"]

		if data.has_key?(:field)
			field_number_changed = data[:field][1..-1]
			text_field_changed  = @result['f']["f_text#{field_number_changed}"]
		end

		notice = {
			:action     => 'field_add',

			'u_id'      => @env.client_cookie_id,                     # пользователь

			'f_time'    => Time.now.to_i,                             # время чека поля
			'f_status'  => data[:status],                             # какой статус
			'f_text'    => text_field_selected,
			'f_change'  => text_field_changed,

			'm_id'      => @env.client_data['mindid'],
			'm_u_id'    => @result['i'],
			'm_tags'    => @result['h'],
			'm_text'    => @result['x']
		}

		HashWrite.new({
			:table       => 'notices',
			:key         => @result['i'],
			:inserted    => notice,
			:write_limit => @limit_notice
		}).add unless @result['i'] == @env.client_cookie_id

		@env.pool.control.destination = @result['i']
		@env.pool.control.mindid = @env.client_data['mindid']
		@env.pool.control.msg = notice
		@env.pool.send
	end

	def comment_add(data)
		#$meta.update({:counter => { :$exists => true }},{:$inc => {:c => 1}})

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
		$meta.update({:counter => { :$exists => true }},{:$inc => {:m => 1}})

		#counter
		if @env.client_current_profile[:u_first_mind]
				$authn.update({ :_id => BSON::ObjectId(@env.client_cookie_id) },{ '$inc' => { 'м' => 1}, :$set => { 'ж' => false } })
		else
				$authn.update({ :_id => BSON::ObjectId(@env.client_cookie_id) },{ '$inc' => { 'м' => 1} })
		end


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
				:table       => 'noticesMindAdded',
				:key         => element,
				:inserted    => data[:notice],
				:write_limit => @limit_notice
			}).add unless element == @env.client_cookie_id if element

			#@env.pool.control.destination = element
			#@env.pool.control.msg = data[:notice]
			#@env.pool.send
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
	def authn(data)
		$meta.update({:counter => { :$exists => true }},{:$inc => {:u => 1}})
	end
end