# encoding: UTF-8

class CommentAdd < HashWrite
end

class CommentsRead < HashRead
	def initialize(options,usercookie_id='nil')
		@usercookie_id = usercookie_id
		options[:table]  = 'comments'
		options[:amount] = 12
		super(options)
	end
	def extra(hash,key=nil)
		return { :bool => false, :code => 0, :info => 'No comments' } if hash.nil?
		hash['c_id'] = key
		hash['c_my'] = hash['u_id']==@usercookie_id
		hash['m_like'] = LikeReadUser.new( 'likeUser', {
			:idmind        => hash['m_id'],
			:usercookie_id => hash['u_id']
		}).like if hash['u_id'] and hash['m_id']
		NewUser.get_user(nil,hash['u_id']).merge hash
	end
	def exception(data_position)
		return true unless data_position.has_key?('c_id')
		data_position['c_deleted']
	end
end

module Comment
	def comment_add
		mind = $mind.find_one_and_update({
			:query  => {
				:_id => BSON::ObjectId(@env.client_data['m_id'])
			},
			:update => { 
				:$inc => { :c => 1}
			},
			:upsert => true
		})

		return { :bool => false, :code => 0, :info => 'Ошибка получения инормации о мнение'} if mind.nil?

		notice = {
			'm_like'    => LikeReadUser.new( 'likeUser', { :idmind => @env.client_data['m_id'],	:usercookie_id => @env.client_cookie_id }).like,
			'u_id'      => @env.client_cookie_id,                     # пользователь

			'c_time'    => Time.now.to_i,                             # время комментария
			'c_deleted' => false,                                     # удален комментарий или нет - ДОЛЖНО ПРИСУТСТВЫВАТЬ
			'c_text'    => CGI.escapeHTML(@env.client_data['c_text']),# текст комментария
			'c_like'    => 0,                                         # лайков
			'c_dislike' => 0,									      # дизлайков
			'c_id'      => 'self',

			'm_id'      => @env.client_data['m_id'],
			'm_u_id'    => mind['i'],
			'm_status'  => mind['s'],
			'm_tags'    => mind['h'],
			'm_text'    => mind['x']
		}

		result = CommentAdd.new({
			:table       => 'comments',
			:key         => @env.client_data['m_id'],
			:inserted    => notice,
			:write_limit => $limit_comments_write
		}).add

		notice['c_id'] = result[:id]

		@meta.comment_add( notice )

		{
			:bool   => true,
			:code   => 582,
			:action => 'comment_add',
			:info   => "Попытка добавления комментария",

			:notice => (notice.merge @env.client_current_profile) 
		}
	end
	def comment_remove
		key_c_id = "hash.#{@env.client_data['c_id']}"
		result = $comment.find_one_and_update({
			:query => {
				'key' => @env.client_data['m_id'],
				"hash.#{@env.client_data['c_id']}" => { :$exists => true },
				:$or => [
					{ "#{key_c_id}.u_id"   => @env.client_cookie_id },
					{ "#{key_c_id}.m_u_id" => @env.client_cookie_id }
				]
			},
			:update => {
				:$set => { "#{key_c_id}.c_deleted" => true }
			},
			:new => true
		})
		

		notice = {
			:bool => ( result.nil? ? false : true ),
			:code => 0,
			:info => 'Попытка удаление комментария'
		}

		@meta.comment_remove( result ) if notice[:bool]
		notice
	end
	def comments_read
		CommentsRead.new({
			:key           => @env.client_data['m_id'],
			:last_part     => (@env.client_data['c_last_part'].to_i if @env.client_data['c_last_part']),
			:last_position => (@env.client_data['c_last_position'].to_i if @env.client_data['c_last_position']),
			:amount        => @env.client_data['amount']
		}, @env.client_cookie_id ).read.merge ({ :action => 'comments_read' })
	end
end

