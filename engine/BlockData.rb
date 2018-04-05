# coding: utf-8

class DataBlockMetaWrite
	attr_writer :nameBlock, :key
	attr_reader :part, :position, :typeWriten
	def initialize
		# The maximum mongodb BSON document size is 16 megabytes
		@maxPosInDocBlock = 12
	end

	def read
		@table  = metaTable
		@meta = $db_o4em[@table].find(request).first

		if @meta.nil? then
			metaForFirstDoc
		elsif @meta['position'] >= @maxPosInDocBlock then
			metaForNextDoc
		else				
			metaForUpdateDoc
		end
		metaUpdate 
	end

	private
	# typeWriten:
	#   0 - insertNewDoc;
	#   1 - updateExistingDoc
	def metaForFirstDoc
		@position = 1
		@part = 1
		@typeWriten = 0
	end
	def metaForNextDoc
		@part = @meta['part'] + 1
		@position = 1
		@typeWriten = 0
	end
	def metaForUpdateDoc
		@part = @meta['part']
		@position = @meta['position'] + 1
		@typeWriten = 1
	end
	def metaTable
		@nameBlock+"Meta"
	end
	def request
		{ :key => @key }
	end
	def metaUpdate
		$db_o4em[@table].update_one( request, { '$set' =>{
			:part => @part,
			:position => @position
		}},
		{:upsert => true} )
	end
end

class DataBlockWriter
	attr_writer :nameBlock, :key, :part, :position, :typeWriten, :hashToSet
	def write
		case @typeWriten
		when 0
			insertNewDoc
		when 1
			updateExistingDoc
		end
		result
	end
	private
	def result
		{ 
			:bool => true,
			:code => 581,
			:info => "Позиция успешно добавлена",
			:date => $time_now,
			:part => @part,
			:comm => @position
		}	
	end
	def insertNewDoc
		$db_o4em[@nameBlock].insert_one({
			:key => @key,
			:part => @part,
			@position.to_s => @hashToSet
		})
	end
	def updateExistingDoc
		$db_o4em[@nameBlock].update( { :key => @key, :part => @part },
		{
			"$set" => {
				@position.to_s => @hashToSet
			}
		},
		{:upsert => true})
	end
end

class DataBlockMetaReade
	attr_writer :nameBlock, :key
	attr_reader :nodata, :amount, :part, :position
	def initialize(data)
		@data = data
		@maxAmount = 12
	end
	def read
		if @data['amount'].nil?   then @amount   = @maxAmount else @amount   = @data['amount']   end
		if @data['position'].nil? then @position = @maxAmount else @position = @data['position'] end

		if @data['part'].nil?
			finded = $db_o4em[metaTable].find(request).first
			return @nodata = true if finded.nil?
			
			@part     = finded['part']
			@position = finded['position']
		else
			@part = @data['part']
		end
	end

	private
	def metaTable
		@nameBlock+"Meta"
	end
	def request
		{ :key => @key }
	end	
end

class DataBlockReader
	attr_writer :nameBlock, :key, :amount, :part, :position
	def initialize
		@data = {}
		@data[:count] == 0
		@maxPosInDocBlock = 13
	end
	
	def read
		countAmount = 0
		currentPart = 0
		currentPosition = 0

		# currentPart Уменьшается!
		@part.downto(1) { |currentPart|
			doc = $db_o4em[@nameBlock].find( request(currentPart) ).first
			
			@position.downto(1){ |currentPosition| 
				unless doc["#{currentPosition}"]['s']
					countAmount += 1
					addToResult(countAmount,doc["#{currentPosition}"],currentPosition,currentPart)
				end
				if countAmount >= @amount
					meta(countAmount,currentPart,currentPosition)
					return @data
				end
			}
			@position = @maxPosInDocBlock
		}

		meta(countAmount,currentPart,currentPosition)
		return @data
	end

	private
	def addToResult(countAmount,doc,currentPosition,currentPart)
		@data[countAmount] = doc
	end
	def meta(countAmount,currentPart,currentPosition)
		@data[:count] = countAmount
 		@data[:last_part] = currentPart
		@data[:last_position] = currentPosition
	end
	def request(currentPart)
		{
			:key => @key,
			:part => currentPart
		}
	end
end