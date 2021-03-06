# encoding: UTF-8
require 'unicode'

class QuantumSearch
	def initialize(table,data,convert=false)
		@convert = convert
		# Настройки
		@limit  = data[:amount] + 1
		@result = {}

		# Инициализируем переданные параметры
		if convert then
			@word = Unicode::downcase(data[:word])
		else
			@word = data[:word]
		end
		@endrate = data[:endrate]
		# Вспомогательные переменные класса
		@table_ = $db_o4em[table]
		@count = 0
	end
	#выводит все хеши от: bl... (нужно сделать оптимизированный вывод по длине от меньшего)
	def search
		data = symbols_hash

		# Дальше ищем по рейтингу
		r = @table_.find(marker(data),:sort => {:r=>-1}).limit(@limit)
		if r.nil? then
			send
		else
			@count = 0
			r.each {|doc|
				case @convert
				when true
					compare1(doc)
				when false
					compare0(doc)
				end
			}
			send
		end
	end
	def add
		data = symbols_hash
		# endword byte
		data["#{@count}"] = '='
		r = @table_.find(data).first
		if r.nil?
			data[:r] = 0
			# Встави с нулевым рейтингом слово
			@table_.insert_one(data)
		else
			# Обновим рейтинг слова
			@table_.update_one(data,{:$inc => {:r => 1}})
		end
	end
	def symbols_hash
		hash = {}
		0.upto(@word.length-1){|s|
			hash["#{s}"] = @word[s]
			@count += 1
		}
		hash
	end
	def compare0(doc)
		@count += 1
		count = 0
		str = ''
		doc.map{ |key,value|
			if key != '_id' and key != 'r' then
				count += 1
				str += value
			end
		}
		# Удалим байт конца см. выше '='
		str[count-1] = ''
		@endrate = doc[:r]

		# Точное совпадение перемещаем на первое место
		if str == @word then
			@result["#{@count}"] = @result["1"]
			@result["1"] = str
		else
			@result["#{@count}"] = str
		end
	end
	def compare1(doc)
		@count += 1
		@endrate = doc[:r]

		str = extra(doc)

		# Точное совпадение перемещаем на первое место
		if str == @word then
			@result["#{@count}"] = @result["1"]
			@result["1"] = str
		else
			@result["#{@count}"] = str
		end

	end

	def send
		if @count > 0 then
			@result[:last]    = true
			@result[:counter] = @count
			@result[:endrate] = @endrate
			if @count == @limit then
				@result[:last] = false
				@result[:counter] -= 1
				@result.delete "#{@limit}"
			end
			bool = true
		else
			bool = false
		end
		{:bool => bool, :code => 0, :info => 'Считыватель', :data => @result }
	end
	def marker(data)
		if @endrate.nil? then
			data
		else
			data[:r] = { '$lt' => @endrate }
			data
		end
	end
	def extra(data)
		data
	end
end