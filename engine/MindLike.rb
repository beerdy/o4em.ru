# coding: utf-8

# Класс узкоспециализированный для лайков и дизлайков пользователей — сочетает как reader так и  writer
#require '../db.rb'
#require 'json'

class Like_
	attr_accessor :part_, :position_, :one, :status
	def initialize(table,data)
		@data = data
		@table = table
		@table_ = $db_o4em[ table ]
		@one = true
		#@max_doc_size = 15728640
		@max_doc_size = 512
	end
	# Первый запрос выполняется именно только в том случае
	#если неполученны входные данные по "part" тобиш в какой части(в каком документе) находятся данные
	def comit
		init
		# Значит проход первый - таблица: likeMind или likeUser

		#cмысла в этом поиске нет т.к. нам нужно еще подсчитать размер
		#r = @table_.find({ :key => @key, :p => 1, @fended => {"$exists" => true} }).first
		# Поэтому # Первый запрос поиск именно в таблице значений а не в информационной таблице
		#абы уменьшить нагрузку
		r = @table_.find({ :k => @key, :p => 1 }).first

		### +++>>> ВСТАВКА НОВОГО ДОКУМЕНТА
		if r.nil? then
			# Если и тут ничего ненайденно значит это равнозначно тому что
			#что пользователь не производил никаких действий с лайками и 
			#таблица действий вообще пуста создадим новую таблицу пользователя (или мнения)

			# Но предварительно вычислим part и position у mind. Так как мы находимся в этом блоке значит
			#мы папали сюда так как таблица likeMind или likeUser незаполнены поэтому смело выставляем все
			#все параметры в единицу
			#P.S. part может быть записан в любом месте
			part = 1
			position = 1
			if @one then
				# Пасивная проверка статуса чтобы занести в мнение изменения
				check_status({'s'=>0})
				@lm.part_= part
				@lm.position_= position
				@lm.status = @status
				@lm.comit

				@part_= @lm.part_
				@position_= @lm.position_
				@table_.insert_one({ :k => @key, :p => part, :n => 1, @finded => {:s => @status, :p => @part_, :c => @position_, :m => 1} })
			else
				#=> Вычисляем перекресные значения позиций из соседней коллекции
				# Иначе это второй проход и данные уже подготовленны, так запишем
				#P.S. :part => 1 так как это первая запись и данный блок для первой записи
				# @part_ и @position_ при втором проходе уже установленны поэтому просто вставим
				@table_.insert_one({ :k => @key, :p => part, :n => 1, @finded => {:s => @status, :p => @part_, :c => @position_, :m => 1} })
				@part_ = part
				@position_ = position
			end

		#### Иначе в документе есть данные и возможно уже есть следующие части.
		#### Тут мы и вычислим эти части
		else
			# Следующим шагом проверим, есть ли в первом документе действий пользователя, действие
			#которое было произведенно именно с мнением которое породило этот запрос
			
			if r[@finded].nil? then
				#### Данных нет. Значит их необходимо внести, только куда??? В этот ПЕРВЫЙ документ или же
				#### Записать новые данные в текущий ПЕРВЫЙ документ если размер позволяет

				# Считаем размер
				# Если размер позволяет то запишем новвые данные в текущий ПЕРВЫЙ документ
				#Без использования информационной таблицы

				# +++>>> ДОБАВЛЕНИЕ К ДОКУМЕНТУ
				if BSON.serialize(r).size < @max_doc_size then
					# В случае первого прохода, получим данные из второго
					part = 1
					position = r['n']+1
					if @one then
						check_status({'s'=>0})
						@lm.part_= part
						@lm.position_= position
						@lm.status = @status
						@lm.comit

						@part_= @lm.part_
						@position_= @lm.position_
						@table_.update_one({ :k => @key, :p => part },{'$set' => { :n => position, @finded => {:s => @status,:p => @part_,:c => @position_,:m => position} }})
					else
						@table_.update_one({ :k => @key, :p => part },{'$set' => { :n => position, @finded => {:s => @status,:p => @part_,:c => @position_,:m => position} }})
						@part_ = part
						@position_ = position
					end
				else
					@tableInfo_ = $db_o4em[ "#{@table}Info"]
					#================================================================================#
					#### Иначе читаем информационную таблицу.
					####И тут начинается самое основное если у нас уже имееться информационная таблица 
					####Или же ее нужно создать так как первый документ таблицы уже заполнен
					info = @tableInfo_.find({:k => @key}).first
					
					# Если информационной таблицы для данного ключа нет, то создадим ее с part => 2
					if info.nil? then

						@tableInfo_.insert_one({:k => @key,:p => 2, :c => 1})
						
						# Передадим втор таблице данные о нашем part и position в случае первого прохода
						#И запишем полученные позиции
						part = 2
						position = 1
						if @one then
							check_status({'s'=>0},false)
							@lm.part_= part
							@lm.position_= position
							@lm.status = @status
							@lm.comit

							@part_= @lm.part_
							@position_= @lm.position_
							@table_.insert_one({ :k => @key, :p => 2, :n => 1, @finded => {:s => @status, :p => @part_, :c => @position_, :m => 1} })
						else
							@table_.insert_one({ :k => @key, :p => 2, :n => 1, @finded => {:s => @status, :p => @part_, :c => @position_, :m => 1} })
							@part_ = part
							@position_ = position
						end
					else
						### Если же информационная таблица существует то нужно посмотреть сколько там частей!!!
						### В одной из частей может быть наше искомое
						f = false
						r = nil
						part = nil
						part_ = nil
						#position = nil
						#number = nil

						# ВОТ ЭТО НУЖНО БУДЕТ УПРОСТИТЬ!!!!
						2.upto(info['p']) { |i|
							# Читаем весь документ
							r = @table_.find({ :k => @key, :p => i }).first
							# И если в документе есть искомое, запомним часть в которй мы его нашли и позицию
							if not r[@finded].nil? then
								f = true
								part = i
								part_ =r[@finded]['p']
								# Берем уже существующий position для перекресной таблицы и переписываем без изменений
								#position = r[@finded]['c']
								# также берем номер позиции в текуще таблице
								#number = r[@finded]['m']
								break
							end 
						}

						# Если нашли искомое то просто его обновим без всяких вычислений мест новой вставки
						# +++>>> ТОЛЬКО ОБНОВЛЕНИЕ ДОКУМЕНТА
						if f then
							if @one then
								check_status(r[@finded],false)
								@lm.only_update(part_,@status)
								@table_.update_one({ :k => @key, :p => part },{'$set' => {"#{@finded}.s" => @status}})
							end
						else
							# Расчитываем здесь для того чтобы снизить нагрузку. Т.е. расчет по мере необходимости (мелоч но приятно)
							# 48 получается из: 45 - размер одного статуса + 3 - резервные байты
							# Если часть заполнена то нужно начать новую
							if info['c'] >= (@max_doc_size/48).to_i then
								@tableInfo_.update_one({:k => @key}, {'$set' => {:c => 1}, '$inc' => {:p => 1}} )
								
								part = info['p']+1
								position = 1

								if @one then
									check_status({'s'=>0})
									@lm.part_= part
									@lm.position_= position
									@lm.status = @status
									@lm.comit

									@part_= @lm.part_
									@position_= @lm.position_

									@table_.insert_one({ :k => @key, :p => part, :n => 1, @finded => {:s => @status, :p => @part_, :c => @position_, :m => 1} })
								else
									@table_.insert_one({ :k => @key, :p => part, :n => 1, @finded => {:s => @status, :p => @part_, :c => @position_, :m => 1} })
									@part_ = part
									@position_ = position
								end
							else
								# Иначе просто увеличиваем позицию так как вставка будет идти в туже часть документа
								@tableInfo_.update_one({:k => @key}, {'$inc' => {:c => 1}} )
								
								part = info['p']
								position = info['c']+1

								if @one then
									check_status({'s'=>0})
									@lm.part_= part
									@lm.position_= position
									@lm.status = @status
									@lm.comit

									@part_= @lm.part_
									@position_= @lm.position_
									@table_.update_one({ :k => @key, :p => part },{'$set' => { :n => position, @finded => {:s => @status,:p => @part_,:c => @position_,:m => position} }})
								else
									@table_.update_one({ :k => @key, :p => part },{'$set' => { :n => position, @finded => {:s => @status,:p => @part_,:c => @position_,:m => position} }})
									@part_ = part
									@position_ = position
								end
							end
						end
					end
				end
			else
				# То просто обновим существующий ключ
				part = 1
				part_ = r[@finded]['p']
				if @one then
					check_status(r[@finded],false)
					@lm.only_update(part_,@status)
					@table_.update_one({ :k => @key, :p => part },{'$set' => {"#{@finded}.s" => @status}})
				end
			end
		end
	end
	private
	def lm_init(part,position)
		@lm.part_= part
		@lm.position_= position
		@lm.status = @status
		@lm.comit

		@part_= @lm.part_
		@position_= @lm.position_
	end
	def upd(part)
		@table_.update_one({ :k => @key, :p => part },{'$set' => { :n => @count, @finded => {:s => @status, :p => @part_, :c => @position_, :t => @time} }})
	end
	def ins(part)
		@table_.insert_one({ :k => @key, :p => part, :n => 1, @finded => {:s => @status, :p => @part_, :c => @position_, :t => @time} })
	end
end

class LikeUser < Like_
	def init
		@lm = LikeMind.new('likeMind',@data) if @one
		# Установим (в данном случае устанавливаем в 1 так как подтверждено что то первая запись в документе)
		@lm.one = false
		@key = @data[:usercookie_id]
		@finded = @data[:idmind]
		@status = @data[:status]
	end
	def check_status(finded,bool=true)
		# Теперь обновление
		# Если fended просто nil тогда это просто новый position статус не вычисляем он будет принятый по умолчанию. Иначе вычислим
		@new_like = bool
		if !finded.nil? then
			if finded['s'] == 0 and @status == 1 then
				$mind.update_one( req_mind, { :$inc => { :l => 1}})
			elsif finded['s'] == 0 and @status == 2 then
				$mind.update_one( req_mind, { :$inc => { :d => 1}})
			elsif finded['s'] == 2 and @status == 1 then
				$mind.update_one( req_mind, { :$inc => { :l => 1, :d => -1} })
			elsif finded['s'] == 1 and @status == 2 then
				$mind.update_one( req_mind, { :$inc => { :l => -1, :d => 1} })
			elsif finded['s'] == 1 and @status == 1 then
				$mind.update_one( req_mind, { :$inc => { :l => -1}})
				@status = 0
			elsif finded['s'] == 2 and @status == 2 then
				$mind.update_one( req_mind, { :$inc => { :d => -1}})
				@status = 0
			end
		end
	end
	def req_mind
		{:_id => BSON::ObjectId(@data[:idmind])}
	end
	# от 24.02.16
	#def send
	#	r = $mind.find(req_mind).first
	#	{:like => r['l'], :dislike => r['d'], :myself => @status, :new_like => @new_like, :text => r['x'], :userid => r['i'], }
	#end
	def send
		mind_data = $mind.find(req_mind).first
		if @status.nil? or @new_like.nil? or mind_data.nil? then
		{
			:bool => false,
			:code => 0,
			:info => 'Что то пошло не так при оценке мнения'
		}
		else
		{
			:bool => true,
			:code => 0,
			:action => 'mind_like',
			:notice => {
				:m_id      => @data[:idmind],
				:m_like    => mind_data['l'],
				:m_dislike => mind_data['d'],
				:m_text    => mind_data['x'],
				:m_u_id    => mind_data['i'],
				:u_like_id => @key,
				:u_like    => @status,
				:n_time    => Time.now.to_i
			}
		}
		end
	end
end

class LikeMind < Like_
	def init
		# Установим (в данном случае устанавливаем в 1 так как подтверждено что то первая запись в документе)
		@key = @data[:idmind]
		@finded = @data[:usercookie_id]
	end
	def only_update(part,status)
		init
		@table_.update_one({ :k => @key, :p => part },{'$set' => {"#{@finded}.s" =>status}})
	end
end

class LikeRead
	def initialize(table,data)
		@data = data
		@table = table
		@table_ = $db_o4em[table]
		@key = data[:usercookie_id]
	end
end
class LikeReadUser < LikeRead
	def init
		@finded = @data[:idmind]
		@max_doc_size = 512
	end
	def like
		init
		r = @table_.find({ :k => @key, @finded => {:$exists => true} }).first
		if r.nil? then
			puts "Найдено в userid: #{@key}, idmind: #{@finded}  status: <<3>>" if $log_console
			return 3
		else
			puts "Найдено в userid: #{@key}, idmind: #{@finded}  status: <<#{r[@finded]['s']}>>" if $log_console
			return r[@finded]['s']
		end
	end	
end

class MindMyLiked < LikeRead
	def init
		@tableInfo_ = $db_o4em[@table+'Info']

		@endpart = @data[:endpart]
		@endcount = @data[:endcount]
		@amount = @data[:amount]

		@vx = ValidateXXX.new()
		if @amount.nil?
			@amount = 12
		else
			r = @vx.amount(@amount)
			return r.to_json if not r[:bool]
		end

		@mp = MindReadPrepare_.new()
	end
	# Забираем массив мнений в обратном хронологическом порядке т.е. от новых к старым в количестве "i"
	def mind
		init
		if @endpart.nil? then
			# Так как мы начинаем с конца то сначало мы читаем информационную таблицу
			info = @tableInfo_.find({:k => @key}).first
			# Если информационная таблица пуста значит остается только part 1
			if info.nil? then
				pass(1,nil)
			else
				pass(info['p'],nil)
			end
		else
			pass(@endpart,@endcount)
		end
	end
	def pass(endpart,endcount)
		position = 0
		amounted = 0
		down = nil

		c = endpart
		1.upto(endpart){ 
			r = @table_.find({ :k => @key, :p => c }).first
			if r.nil? then
				return @mp.send(c,position)
			else
				# Если посл. позиция не передана то вычислим ее из текущей части
				if endcount.nil?
					up = r['n']
					puts "endcount - Инициализирован таблицей: #{up}" if $log_console
				else
					puts "endcount - Инициализирован пользователем" if $log_console
					up = endcount
					endcount = nil
				end
				# Максимально возможно количество (числа с перебором - инкремент -1)
				position = up

				if down.nil? then
					down = up - @amount
				else
					down = up - down.abs
				end

				r.map{ |key,value|
					if key != '_id' and key != 'n' and key != 'p' and key != 'k' then
						if value['m'] > down and value['m'] <= up then
							# подготовим позицию для записи
							amounted += 1
							# Так же, передадим ваш лайк или дизлайк на компановку
							puts "Не сортированно с конца: #{value['m']} ключ #{key}" if $log_console
							f = @mp.prepare(key, value['m'], value['s'])
							if f then
								position -= 1
							else
								#вернем позицию для очередного заполнения
								amounted -= 1
								down -= 1
							end
							if amounted >= @amount
								@mp.sort(up,down)
								return @mp.send(c,position) 
							end
							# см. выше. только цчет позиций
							break if position == 0
						end
					end
				}
				@mp.sort(up,down)
				return @mp.send(0,0) if c <= 1
			end
			# Это части и они полюбому уменьшаются
			c -= 1
		}
	end
end

class MindReadPrepare_
	def initialize
		@data = {}
		@ready = {}
		@m = 1
	end
	def driver(doc)
		# t - Дата? возможно лучше получать из ObjectID
		# i - Userid
		# u - Флаг удаленного пользователя? - возможно тоже ненужно
		# m - Флаг удаленного мнения
		# c - Счетчик комментариев
		# g - Оценка самим пользователем? Возможно также не требуется
		# l - Лайк
		# d - Дизлайк
		# h - Хэш
		# e - Тема? Тоже под вопросом
		# x - Сам текст
		{:t =>doc['date'],:i=>doc['userid'],:u=>doc['user_del'],:m=>doc['mind_del'],:c=>doc['cnt_comment'],:l=>doc['like'],:d=>doc['dislike'],:h=>doc['hash'],:e=>doc['them'],:x=>doc['text']}
	end	
	def prepare(id,num,status)
		doc = $mind.find({"_id" => BSON::ObjectId(id)}).first
		return false if doc.nil?
		
		# Драйвер конвертирования из старого формата в новый (для мнения)
		#doc = driver(doc) if doc['x'].nil?#
		###################################

		return false if doc[:m]
		
		m = num
		@data[m] = doc
		@data[m][:q] = id
		@data[m][:ava] = ava(doc[:i])
		@data[m][:myself] = status
		true
	end
	def sort(up,down)
		up.downto(down){ |i|
			if not @data[i].nil?
				@ready["m#{@m}"] = @data[i]
				@m += 1
			end
		}
		@data = {}
	end
	def send(endpart,endcount)
		@ready[:endpart] = endpart
		@ready[:endcount] = endcount
		if @m == 1 then
			@ready[:bool] = false
		else
			@ready[:bool] = true
		end
		@ready
	end
	def ava(userid)
		# Проверяем на наличие userid
		if userid.nil? then
			false
		else
			File.exist?("public/img/upload/r40x40_#{userid}-ava-1.jpg")
		end
	end	
end

class ValidateXXX
	def amount(n)
		{ :bool => false, :code => 0, :info => "Предельно допустимый запрос - 32 позиции" } if n > 32
		{ :bool => true }
	end
end

#puts MindMyLiked.new('likeUser',{:usercookie_id => '55544502312f9174e4000001'}).mind
#LikeReadUser.new('likeUser',{ :usercookie_id => '55544502312f9174e4000001', :idmind => '5564333d312f9155c3000011' }).like