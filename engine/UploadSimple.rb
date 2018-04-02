# coding: utf-8

require 'rmagick'

include Magick

class SimpleUpload_
	attr_reader :error
	def initialize(env,data)
		@data = data
		# Подготавливаем полученные данные - Избавление от boundary и прочей ереси.
		@params = Rack::Multipart.parse_multipart(env)

		@result = {}
		@error = false
	end
	def multi_upload
		begin
			0.upto( @max_files ){ |i|
				if !(file_up = @params.keys[i]).nil? then
					begin
						@params[ file_up ][:filename]
					rescue TypeError => ex
						puts "#{Time.now} SIMPLE-UPLOAD 001 Не корректный ХЭШ данных" if $log_console
						next
					end

					if @params[ file_up ][:filename].nil? then
						puts "#{Time.now} SIMPLE-UPLOAD 002 Поток файла пустой"+i.to_s if $log_console
					else
						file_obj = @params[ file_up ][:tempfile]
						puts "#{Time.now} SIMPLE-UPLOAD 003 Поток файла считан и отправлен на сохранение "+i.to_s if $log_console
						save( file_obj,i )
						return @result if @error
					end
				else
					puts "#{Time.now} SIMPLE-UPLOAD 000 Файл не передан" if $log_console
				end			
			}
			{ :bool => true,  :code => 0, :info => "Попытка загрузки файлов...", :data => @result }
		rescue Exception => e
			{ :bool => false, :code => 0, :info => "Попытка загрузки файлов...", :data => e }
		end
	end
	def save(file_obj,i)
		filename = "#{@dir}/#{@filename}_#{i}"
		filename_ext = "#{filename}.#{@extention}"
		
		begin
			img = Magick::Image.from_blob(Base64.decode64(file_obj.read))
			# Пример: Type image: [public/img/upload/55544502312f9174e4000001/55633de0312f914e4c000001_0.jpg JPEG 500x332 500x332+0+0 DirectClass 8-bit 35kb]
			
		rescue Exception => e
			@error = true
			@result = { :bool => false, :code => 0, :info => "Неверный формат изображения, одного из загружаемых файлов. #{e}" }
			return			
		end

		correct_( img[0],filename,filename_ext )
		@result[i] = filename
	end
end

class UploadAva < SimpleUpload_
	def initialize(env,data)
		super(env,data)

		@max_files = 1
		@dir = "public/img/upload/#{@data[:usercookie_id]}"
		@extention = 'jpg'
		@filename = BSON::ObjectId.new()
		@size = { 'o800' => 800, 'r100x100' => 100, 'r40x40' => 40 }
	end
	def correct_(img,filename,filename_ext)
		#puts "Type image: #{cat.format}, filesize: #{cat.filesize}"
		@size.map{ |key,sz|
			small_fit = img.resize_to_fill(sz,sz)
			small_fill = small_fit.resize_to_fit(sz,sz)
			small_fill.write("#{filename}_#{key}.#{@extention}")
		}
	end
	def way_db
		$authn.update_one({ :_id => BSON::ObjectId(@data[:usercookie_id]) },{:$set => {'ф' => @result[0] }})
	end
end

class UploadMind < UploadAva
	def initialize(env,data,filename)
		super(env,data)

		@dir = "public/img/upload/#{@data[:usercookie_id]}/mind"
		@filename = filename
		@size = { 'o800' => 800, 'r300x300' => 300, 'r200x200' => 200 }
	end
end