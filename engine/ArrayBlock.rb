# encoding: UTF-8

class ArrayWrite
	def initialize(options)
		# Эксперементально - необъходимо будет расчитать оптимальный документ для записи
		@table_array = options[:table]
		@table_array_write_limit = options[:write_limit]
		@table_array_read_amount = options[:amount]
		@key      = options[:key]
		@inserted = options[:inserted]
	end
	def add
		data = $db_o4em[@table_array].find_one_and_update({
			:query  => {
				:anchor => 1,
				:key => @key 
			},
			:update => { 
				:$push => {	'array'  => @inserted },
				:$inc  => { :counter => 1}
			},
			:upsert => true
		})
		if data
			data[:inserted] = @inserted 
			data[:table] = @table_array
			ArrayTransfer.new(data).rewrite if data['counter'] >= @table_array_write_limit
			notice
		else
			return {
				:bool => false,
				:code => 0,
				:info => 'Ошибка добавления элемента в массив'
			} if nil == $db_o4em[@table_array].find({
				:key   => @key,
				:array => @inserted
			}).first()
			notice
		end
	end
	
	private
	def notice
		{ 
			:bool => true,
			:code => 0,
			:info => 'Элемент успешно добавлен в массив',
			:notice => {
				:key => @key,
				:inserted => @inserted,
				:time => Time.now.to_i
			}
		}		
	end
end

class ArrayTransfer
	def initialize(options)
		@table_array   = options[:table]
		@fragmentation = options['fragmentation']
		@inserted      = options[:inserted]
		@part  = getPart( options['part'] )
		@array = options['array']
		@key   = options['key']
	end

	def rewrite
		$db_o4em[@table_array].insert_one({
			:key   => @key, 
			:part  => @part,
			:array => @array
		})
		$db_o4em[@table_array].update_one({
			:key     => @key,
			:anchor  => 1,
		},{
			:fragmentation => getFragmention,
			:key     => @key,
			:part    => @part,
			:anchor  => 1,
			:counter => 1,
			:array   => [ @inserted ]
		})
	end

	private
	def getPart(part)
		if part.nil?
			1
		else
			part+1
		end
	end
	def getFragmention
		if @fragmentation.nil?
			0
		else
			@fragmentation
		end
	end
end

class ArrayRead
	def initialize(options)
		@table = $db_o4em[options[:table]]
		@key = options[:key]
		@part = options[:part]
		@user_position = options[:position]
		@amount = options[:amount]+1
		if @part.nil? or @part == -1
			@part = -1
			@request = { :key => @key, :anchor => 1 }	# First request or next request in current part
		else
			next_request # Next request. Все заебись, тут не паримся
		end
		@watch_request = {}
	end
	def read
		result  = {}
		history = {}
		counter = 0
		loop do
			data = @table.find( @request ).first
			break if @watch_request == @request
			@watch_request = @request
			next if data.nil?
			prepare_meta data
			@position.downto(0) do |count|
				next if data['array'][count].nil?
				element = extra( data['array'][count] )
				next if element.nil?
				counter += 1
				result[:position] = count
				position = "#{counter}"
				result[position]  = element
				history[position] = { :position => count, :part => @request[:part], :counter => counter }
				break if counter >= @amount
			end if @position
			break if @part == -2
			break if counter >= @amount
			next_request
		end

		if counter > 0 then
			result[:counter] = counter
			{
				:bool => true,
				:code => 0,
				:info => 'Успешно считанны записи из блока массива',
				:array_data => correct_meta( result,history,counter )
			}
		else
			{
				:bool => false,
				:code => 0,
				:info => 'Нет записей для блока массива',
				:array_data => result
			}
		end
	end

	private
	def prepare_meta(data)
		@user_position.nil? ? @position=data['array'].size : @position=@user_position
		@user_position = nil
		@previous_part = @part

		if @part == -1 # т.е. anchor
			if @amount >= @position # т.е. выбирем все позиции
				if data['part'] 
					@part = data['part']
				else
					@part = -2 # т.е. last_part = true
				end
			end
		elsif data.nil?
			@part = -2
		elsif data['part'] # для следующего считывания
			@part = data['part'] - 1
			@part = -2 if @part == 0
		end
	end

	def correct_meta(data,history,counter)
		if @amount == counter
			counter = history["#{@amount-1}"][:counter]
			position = "#{counter}"
			data[:counter]  = counter
			data[:position] = history[position][:position]
			data[:part]     = history[position][:part]
			data[:last]     = false
			data.delete(@amount)
			data[:position] -= 1
			data.delete(:position) if data[:position] < 0
			return data
		else
			data[:last]	= true
			return data if @previous_part == -2
			data[:part]	= @previous_part
			data[:position] -= 1
			if data[:position] < 0
				data.delete(:position)
				data[:part] -= 1 
				return data if data[:part] <= 0
			end
			data[:last]	= false
			return data
		end
	end

	def next_request
		@request  = { :key => @key, :part => @part, :anchor => { :$exists => false }}
	end

	def extra(data)
		data
	end
end

=begin
puts FollowRead.new({
		:usercookie_id => 'apelisin',
		:key           => 'apelisin',
		:part => 2,
		:position => 2

	}).get  if $log_console
=end

=begin
ARGV.each do |element|
	ArrayWrite.new({
		:key => 'apelisin',
		:inserted => element
	}).add
end
=end