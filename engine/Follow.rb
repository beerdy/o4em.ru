# encoding: UTF-8

require './engine/ArrayBlock.rb'

class Follow
	def initialize(options)
		@options = options
		@options[:amount]      = 12 # if options[:amount].nil?
		@options[:write_limit] = $limit_follow_document
	end

	def remove
		result = $db_o4em['imFollow'].find_and_modify({
			:query => {
				:key    => @options[:key],
				:array  => @options[:removed]
			}, 
			:update => {
				:$pull => { :array => @options[:removed] }
			},
			:new => true })
		result = $db_o4em['howFollow'].find_and_modify({
		:query => {
			:key    => @options[:removed],
			:array  => @options[:key]
		}, 
		:update => {
			:$pull => { :array => @options[:key] }
		},
		:new => true })

		return {
			:bool   => true,
			:code   => 0,
			:action => 'follow_remove',
			:info   => 'Вы успешно отписаны',
			:notice => {
				:key => @options[:key],
				:removed => @options[:removed],
				:time => Time.now.to_i
			}
		} if result
		{
			:bool => false,
			:code => 0,
			:info => 'Ошибка. Невозможно отписаться'
		}
	end

	def get
		obj = ArrayRead.new(@options)
		def obj.usercookie_id=(value)
			@usercookie_id = value
		end
		def obj.chekImFollow(array_element)
			data = $db_o4em['imFollow'].find({
				:key   => @usercookie_id,
				:array => array_element
			}).first()
			return false if data.nil?
			return true
		end
		def obj.extra(array_element)
			return nil unless array_element =~ /^[0-9a-fA-F]{24}$/
			user = NewUser.get_user(@usercookie_id,array_element)
			@table_array=='howFollow' ? user.merge!({ :u_imfollow => chekImFollow( array_element ) }) : user.merge!({ :u_imfollow => true })
			user[:bool] ? user : nil
		end

		data = obj.read
		return {
			:bool    => true,
			:code    => 0,
			:action  => 'follows_read',
			:table   => @options[:table],
			:info    => 'Подписки существуют и успешно считанны',
			:user    => NewUser.get_user(@options[:usercookie_id],@options[:key]),
			:follows => data[ :array_data ]
		} if data[:bool]

		return {
			:bool   => false,
			:code   => 0,
			:action => 'follows_read',
			:info   => 'Подписок нет',
			:user    => NewUser.get_user(@options[:usercookie_id],@options[:key]),
			:follows => nil
		}
	end

	def add
		return {
			:bool   => false,
			:code   => 0,
			:action => 'follow',
			:info   => 'Невозможно подписаться на себя'

		} if @options[:inserted] == @options[:key]

		return {
			:bool   => false,
			:code   => 0,
			:action => 'follow',
			:info   => 'Подписка уже существует'
		} if has_follow

		ArrayWrite.new(@options).add.merge({
			:action => 'follow'
		})
	end

	def check
		$db_o4em[@options[:table]].find({
			:key   => @options[:key],
			:array => @options[:inserted]}
		).first()
	end
	def has_follow
		r = check
		return false if r == '' or r == nil
		return true
	end
end