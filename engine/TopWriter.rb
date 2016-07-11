#!/usr/bin/ruby
# coding: utf-8

class HashCommentForWrite
	attr_reader :get
	def initialize(data)
		@data = data
	end
	def make
		@get = {
			:t => $time_now,						# время комментария
			:u => @data[:usercookie_id],			# пользователь
			:s => false, 							# удален комментарий или нет
			:x => CGI.escapeHTML(@data['text']),	# текст комментария
			:l => 0,								# лайков
			:d => 0									# дизлайков
		}
	end
end