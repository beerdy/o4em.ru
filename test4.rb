# encoding: UTF-8

class Success
	attr_accessor :a
end

class Rrr
	def initialize
		@success = Success.new()
		@success.a = 'tenis'
	end
	
	def run
		task(@success,@success.a,boby)
	end

	def task(success,a,null_data)
		puts success.a
		puts a
	end
	
	def boby
		@success.a='box'
		true
	end
end

obj = Rrr.new()
obj.run

a = {:action =>'aaaa',:ig => 'seter'}
b = {:action =>'bbbb',:name=>425432}

a.merge!(b)
p a