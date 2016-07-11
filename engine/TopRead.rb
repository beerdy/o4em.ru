# coding: utf-8

class TopRead
	def initialize(file)
		@file = file
		@count = 0
		@hash = {}
		@limit = 4
	end
	def go
		file = open(@file, 'r')
		lines = file.readlines
		lines.each do |line|
			temp = line.split('_')
			@count += 1
			@hash[@count] = {
				:whose => $pg.convert_data( $authn.find({ 'я' => temp[0] }).first ),
				:value => temp[1],
				:percent => temp[2].chomp
			}
			break if @limit <= @count
		end
		send
	end
	def send
		if @count > 0 then
			{
				:bool => true,
				:info => 'Топ успешно считан',
				:c => @count,
				:data => @hash
			}
		else
			{
				:bool => false,
				:c => 0,
				:info => 'В топе пусто'
			}
		end
	end
end

