# encoding: UTF-8

class NoticeRead < HashRead
	# Пост обработка. Добавление необходимых данных к уведомлению
	def extra(hash,key=nil)
		return { :bool => false, :code => 0, :info => 'No notice' } if hash.nil?
		
		case hash['action']
		when 'mind_add'
			u_id = hash['u_id']
		when 'comment_add'
			u_id = hash['u_id']
#			hash['user_mind_yes_no'] = LikeReadUser.new( 'likeUser', {
#				:idmind        => hash['m_id'],
#				:usercookie_id => u_id
#			}).like
		when 'follow'
			u_id = hash['inserted']
		when 'follow_remove'
			u_id = hash['key']
		when 'mind_minus'
			u_id = hash['u_like_id']
		when 'mind_plus'
			u_id = hash['u_like_id']
		end
		u_id.nil? ? hash : NewUser.get_user(nil,u_id).merge(hash)
	end
end

class Notice
	def initialize(options)
		@options = options
	end
	def read
		follow
	end
	def follow
		@options[:table]  = 'notices'
		@options[:amount] = 12
		NoticeRead.new(@options).read.merge({ :action => 'notices' })
	end
end	



