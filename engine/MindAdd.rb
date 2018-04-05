# encoding: UTF-8

require 'cgi'
require './engine/Tags.rb'

module MindAdd
	def mind_add
		mind_data = Mind.new( @env.client_cookie_id, @env.client_data ).add
		return render_page({ :data => mind_data }) unless mind_data[:bool]

		data = UploadMindBackground.new().upload( @env.client_data["the-file1"], @env.client_cookie_id, mind_data[:notice]['m_id']  )

		if data[:bool]
			@meta.mind_add(mind_data)
			data = mind_data
		else
			$mind.update({ :_id => BSON::ObjectId( mind_data[:notice]['m_id'] ) },{ :$set => {:m=>true}} )
		end
		return data
	end
end

class Mind
	def initialize(usercookie_id,data)
		@usercookie_id = usercookie_id
		@time = Time.now.to_i
		@data = data

		@array = Array.new
		@text  = CGI.escapeHTML(@data['text'])
	end
	# Добавить мнение
	def add
		id_mind = $mind.insert( insertmind )
		return { :bool => false, :code => 0, :info => 'Ошибка добавления мнения.' } if id_mind.nil?
		return { 
			:bool   => true,
			:code   => 0, 
			:info   => 'Мнение успешно добавлено.',
			:action => 'mind_add',
			:notice => {
				'm_id'   => id_mind.to_s, 
				'm_tags' => @array,
				'm_text' => @text,
				'm_status' => @data['status'],
				'u_id'   => @usercookie_id,
				'm_time' => @time
			}
		}
	end

	private
	def insertmind
		if @data['kt'].to_i >= 1 then
			@array.push @data['t1']
			Tags.new({'word' => @data['t1']}).add
			if @data['kt'].to_i >= 2 then
				@array.push @data['t2']
				Tags.new({'word' => @data['t2']}).add
				if @data['kt'].to_i >= 3 then
					@array.push @data['t3']
					Tags.new({'word' => @data['t3']}).add
					if @data['kt'].to_i >= 4 then
						@array.push @data['t4']
						Tags.new({'word' => @data['t4']}).add
						if @data['kt'].to_i >= 5 then
							@array.push @data['t5']
							Tags.new({'word' => @data['t5']}).add
						end
					end
				end
			end
		end

		field = Hash.new()

		1.upto(@data['f_count'].to_i) do |i|
			field["f_text#{i}"]  = @data["f_text#{i}"]
			field["f_count#{i}"] = 0
		end

		{
			:t => @time,
			:i => @usercookie_id, # id кука пользователя
	
			:u => false, # удален ли пользователь
			:m => false, # удалено ли мнение
			:c => 0,     # счетчик комментариев - общий

			# meta информация для комментариев
			:part => 1,     # сколько частей существует
			:position => 0, # позиция в части # по новому счетчик просмотров
			##################################

			:g => 1, # рейтинг мнения (комментарии,выбор вариантов,просмотров)
			
			# количество лайков и количество дизлайков
			:l => 0,
			:d => 0,

			:x => @text,
			:s => 1, #@data['status'],	# статус
			:h => @array,
			:f => field
		}
	end
end