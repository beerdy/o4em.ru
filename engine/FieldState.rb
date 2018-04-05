# encoding: UTF-8

#require '../config.rb'
#require '../engine/HashBlock.rb'

class FieldStateAdd < HashWrite; end

class FieldStateRead < HashRead
  def initialize(options)
    @usercookie_id = options[:usercookie_id]
    @current_profile = options[:current_profile]
    super(options)
  end
  def extra(data,mindid)
    if data.nil?
      ss = { :bool => false, :code => 0, :info => 'Не верный результат считывания' } 
      puts ss 
      return ss 
    end
    data['mind'] = $mind.find({ :_id => BSON::ObjectId(mindid) }).first
    data['mind']['mymind'] = @usercookie_id==data['mind']['i']
    data['user']=data['mind']['mymind']?@current_profile:NewUser.get_user(@usercookie_id,data['mind']['i'])
    return data
  end
  def exception(data_position)
    return true if data_position['field'] == -1
    return false
  end
end

class FieldState
  attr_reader :result

  def initialize(options)
    @table  = options[:table]
    @userid = options[:userid]
    @mindid = options[:mindid]
    @field  = options[:field]

    @last_part     = options[:last_part]
    @last_position = options[:last_position]
  end

  def add
    inserted = {
      'f_time' => Time.now.to_i, # время действия
      'field'  => @field,
      'delete' => 0
    }

    unless if_has_matches_remove
      obj = FieldStateAdd.new({
        :table       => @table,
        :key         => @mindid,
        :inserted    => inserted,
        :write_limit => $limit_filed_add
      })
      obj.bson = @userid
      @result = obj.add
      @result[:status] = 1 if @result[:bool]
    end
    return false if @result[:bool].nil?
    @result[:bool]
    # Также нужна таблица по сохранению для самого пользователя
  end

private
  def if_has_matches_remove
    key_c_id = "hash.#{@userid}"
    result = $db_o4em[@table].find_one_and_update(
      {
        'key' => @mindid,
        "hash.#{@userid}" => { '$exists' => true }
#        :$or => [ 
#          { "#{key_c_id}.u_id"   => @env.client_cookie_id }, 
#          { "#{key_c_id}.m_u_id" => @env.client_cookie_id }
#        ] # см. комментарии
      },
      {
        '$set' => { "#{key_c_id}.field" => @field }
      }#,
      #:new => true # не новую так как проверим сравнение то что было и то что стало если одинаково то удалим
    )
    
    return false if result.nil?

    # Если найдено. И смотри что найдено
    case result["hash"]["#{@userid}"]["field"]
    when @field # Если мнение такое же как и из текущей таблицы. Ключ delete в -1 т.е. отменим предыдущие и все
      $db_o4em[@table].update_one({ :key => @mindid, "hash.#{@userid}" => { '$exists' => true }},  { '$set' => { "#{key_c_id}.delete" => -1, "#{key_c_id}.field" => -1 }})
      @result = { :bool => true, :code => 0, :info => 'Вы ранее выражали свое мнение в таком же духе - мнение отменено', :status => -1 }
    when -1 # Если было отменено
      $db_o4em[@table].update_one({ :key => @mindid, "hash.#{@userid}" => { '$exists' => true }},  { '$set' => { "#{key_c_id}.field" => @field, "#{key_c_id}.delete" => 0 } })
      @result = { :bool => true, :code => 0, :info => 'Вы ранее выражали свое мнение но удалили его - мнение учтено', :status => 1 }
    else
      # тут старое мнение высылается чтобы в мете минусануть его в счетчике
      @result = { :bool => true, :code => 0, :info => 'Вы ранее выражали свое мнение и поменяли на другое - мнение учтено', :status => 0, :field => result["hash"]["#{@userid}"]["field"] } 
    end
    extra
    return true
  end

protected
  def extra
  end
end

=begin
  userid = '578f2612a8438d6b61000001'
  mindid = '58244e00a8438d314e000003'
  field  = 'f1'

  obj  = FieldState.new( userid, mindid, field )
  data = obj.add
  puts "result: #{obj.result}"
=end