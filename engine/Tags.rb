# encoding: UTF-8

class Tags
	def initialize(option)
		@limit = 12
		@tags  = {}
		@word    = option['word']
		@endrate = option['endrate']
		@table_ = $db_o4em['tags']
		@count  = 0
		@first  = '+'
	end

	#выводит все хеши от: bl... (нужно сделать оптимизированный вывод по длине от меньшего)
	def top
		search({}).merge({:action=>'top_tags'})
	end

	def search(request=nil)
		request = marker(hash_tag) if request.nil?

		# Дальше ищем по рейтингу
		r = @table_.find(request,:sort => [:r,-1]).limit(@limit)
		if r.nil? then
			send
		else
			@count = 0
			r.each {|doc|
				compare(doc)
			}
			send
		end
	end
	def add
		data = hash_tag
		# endtag byte
		data["#{@count}"] = '='
		r = @table_.find(data).first
		if r.nil?
			data[:r] = 0
			@table_.insert(data)
		else
			# Обновим рейтинг тега
			@table_.update(data,{:$inc => {:r => 1}})
		end
	end
	def hash_tag
		hash = {}

		0.upto(@word.length-1){|s|
			hash["#{s}"] = @word[s]
			@count += 1
		}
		hash
	end
	def compare(doc)
		@count += 1
		count = 0
		str = ''
		doc.map{ |key,value|
			if key != '_id' and key != 'r' then
				count += 1
				str += value
			end
		}
		# remove =
		str[count-1] = ''
		@endrates = doc[:r]

		# Точное совпадение перемещаем на первое место
		if str == @word then
			@tags["#{@count}"] = @tags["1"]
			@tags["1"] = str
		else
			@tags["#{@count}"] = str
		end
	end
	def send
		if @count > 0 then
			bool = true
		else
			bool = false
		end
		{:bool => bool, :endrate => @endrate, :c => @count, :data => @tags }
	end
	def marker(data)
		if @endrate.nil? then
			data
		else
			data[:r] = { '$lt' => @endrate }
			data
		end
	end
end

class TagsTop
	def initialize
		@table = $db_o4em['tags']
	end
	def read
		@table.find()
	end
end
