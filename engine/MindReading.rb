# coding: utf-8

#require './MindLike.rb'
#require '../db.rb'
#require './AuthHyb.rb'
#require './Comment.rb'

class MindReading
	attr_writer :mindid
	def initialize(options,pool=nil)
		@pool = pool

		@usercookie_id   = options[:usercookie_id]
		@usercookie_id   = options[:usercookie_id_other] if not options[:usercookie_id_other].nil?

		@current_profile = options[:current_profile]

		@endtime    = options[:endtime]
		@mindid_end	= @endtime
		@mindid     = options[:mindid]

		@limit_read_minds_for_mix = 100                        # Лимит уменьшить 
		@limit_read_minds = 13 # Для проверки наличия еще один 13-й но он не отоброжается
		@limit_read_minds_random = 13
	end
	############
	def read
		minds_readed = {}
		minds_readed_count = 0
		request_previous = {}
		loop do
			if @mindid_end.nil? 
				read_request = { 'i' => @usercookie_id }
			else
				read_request = { 'i' => @usercookie_id, :_id => { '$lt' => BSON::ObjectId( @mindid_end ) } }
			end
			if read_request.to_s == request_previous then break else request_previous = read_request.to_s end

			minds_data = $mind.find( read_request, :sort => [:_id, -1] ).limit( @limit_read_minds )
			minds_data.each do |mind_temp|
				mindid = mind_temp['_id'].to_s
				if @mindid_end == mindid then break else @mindid_end = mindid end

				next unless mind_temp.has_key?('m')
				next if mind_temp['m'] == true

				minds_readed_count += 1
				
				mind_temp[:m_online_c] = online_get( mindid, true )
				mind_temp[:my_status] = LikeReadUser.new( 'likeUser', { :idmind => mindid, :usercookie_id => @usercookie_id }).like
				
				minds_readed["m#{minds_readed_count}"] = mind_temp
				break if minds_readed_count == @limit_read_minds
			end

			break if minds_readed_count == @limit_read_minds
		end

		if minds_readed_count == 0
			return { 
				:bool => false, 
				:code => 0, 
				:info => 'Мнений нет' 
			}
		else
			minds_readed[:count] = minds_readed_count
			minds_readed[:last_mindid] = @mindid_end
			return {
				:bool   => true,
				:code   => 0,
				:info   => 'Мнения успешно считаны',
				:action => 'minds_read',
				:minds  => check_and_correct_last_mind( minds_readed, @limit_read_minds )
			}
		end
	end

	def one
		mind_data = $mind.find({ :_id => BSON::ObjectId(@mindid) }).first
		return { :bool => false, :code => 0, :info => 'Мнения не существует' }  if mind_data.nil?
		return { :bool => false, :code => 0, :info => 'Мнение удалено' }        if mind_data['m']
		mind_data[:mymind]=@usercookie_id==mind_data['i']
		mind_data[:my_status] = LikeReadUser.new( 'likeUser', {
			:idmind        => @mindid,
			:usercookie_id => @usercookie_id
		}).like

		user_data=mind_data[:mymind]?@current_profile:NewUser.get_user(@usercookie_id,mind_data['i'])
		
		mind_data[:comments] = comments_get( @mindid )
		mind_data[:m_online] = online_get( @mindid )
	
		{
			:bool => true,
			:code => 0,
			:info => 'Мнение успешно считано',
			:action => 'mind_one',
			:user   => user_data,
			:minds  => { 'm1' => mind_data, :count => 1 }
		}
	end
	def random(word=nil, one=false )
		limit = one ? 1 : @limit_read_minds_random
		@random_minds = {}
		@random_minds[:count] = 0

		loop do
			rr = (word.nil? ? request : request.merge(word))
			minds_data = $mind.find( rr, :sort => [:_id,-1]).limit(@limit_read_minds_for_mix).to_a
			break if minds_data.nil? or minds_data[0].nil?
			@endtime   = minds_data[minds_data.size-1]['_id'].to_s
			minds_data = minds_data.sort_by { rand }
			minds_data.each do |mind_data|
				next if mind_data['i'] == @usercookie_id or mind_data['m'] or mind_data['i'].nil?
				idmind = mind_data['_id'].to_s
				next if LikeReadUser.new('likeUser',{ :usercookie_id => @usercookie_id, :idmind => idmind }).like != 3
				next if check_exist_mind_in_random_hash(mind_data)
				@random_minds[:count] += 1

				mind = "m#{@random_minds[:count]}" 
				@random_minds[mind] = mind_data
				@random_minds[mind][:user]       = NewUser.get_user( @usercookie_id, mind_data['i'] )
				@random_minds[mind][:comments]   = comments_get( mind_data['_id'].to_s )
				@random_minds[mind][:m_online_c] = online_get( idmind, true )
				break if @random_minds[:count] >= limit
			end
			break if @random_minds[:count] >= limit
		end
		check_and_correct_last_mind( @random_minds, @limit_read_minds_random )
		#send
		if @random_minds[:count] >= 1
			{
				:bool   => true,
				:info   => 'Мнение успешно считано',
				:action => 'mind_random',
				:minds  => @random_minds
			}
		else
			{
				:bool   => false,
				:code   => 0,
				:info   => 'Мнений больше нет'
			}
		end

	end
	def liked(amount,endpart,endcount)
		MindMyLiked.new( 'likeUser', {
			:usercookie_id => @usercookie_id,
			:amount        => amount,
			:endpart       => endpart,
			:endcount      => endcount
		}).mind
	end

protected
	def comments_get(idmind)
		CommentsRead.new({:key => idmind},@usercookie_id).read
	end

	def online_get(idmind,type=false)
		return {} if @pool.nil?
		return {} unless idmind
		@pool.control.mindid = idmind
		return {} unless @pool.online

		len = 0
		len = @pool.success.received_message['users'].length unless @pool.success.received_message['users'].nil? 

		return len if type
		return {}  if len == 0
		
		users = {}
		count = 0

		@pool.success.received_message['users'].each { |u|  
			count += 1
			users["u_#{count}"] = NewUser.get_user( @usercookie_id, u )
		}		
		
		return users if count > 0
		return {}
	end

private
	def request
		if @endtime.nil? then
			{}
		else
			{:_id => { '$lt' => BSON::ObjectId(@endtime) } }
		end
	end
	def request_by_userid
		if @endtime.nil? then
			{ 'i' => @usercookie_id }
		else
			{ 'i' => @usercookie_id, :_id => { '$lt' => BSON::ObjectId(@endtime) } }
		end
	end

	#for random
	def check_exist_mind_in_random_hash(mind_data)
		1.upto(@random_minds[:count]) do |i|
			return true if @random_minds["m#{i}"]['_id'] == mind_data['_id']
		end
		false
	end
	def check_and_correct_last_mind(minds,limit)
		last_mind = "m#{limit}"
		if minds[last_mind]
			minds[:last_mindid] = minds["m#{limit-1}"]['_id'].to_s
			minds[:this_minds_last] = false
			minds[:count] -= 1
			minds.delete last_mind
		else
			minds[:this_minds_last] = true
		end
		minds
	end
end

#test = MindReading.new({
#	:usercookie_id => '565b1b45a8438d3af0000002'
#})
#puts test.random