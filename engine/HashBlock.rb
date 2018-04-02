# encoding: UTF-8

#require '../db.rb'

class HashWrite
  def initialize(options)
    # Эксперементально - необъходимо будет расчитать оптимальный документ для записи
    @table             = options[:table]
    @key               = options[:key]
    @inserted          = options[:inserted]
    @table_write_limit = options[:write_limit]
    @table_read_amount = options[:amount]
  end
  def add
    bson = BSON::ObjectId.new()
    data = $db_o4em[@table].find_and_modify({
      :query  => {
        :anchor => 1,
        :key => @key 
      },
      :update => {
        :$set => { "hash.#{bson}" => @inserted },
        :$inc => { :counter => 1}
      },
      :upsert => true
    })

    if data['counter'] >= @table_write_limit
      data[:inserted] = @inserted 
      data[:table]    = @table
      HashTransfer.new(data).rewrite
    end if data

    { 
      :bool => true, 
      :code => 0, 
      :info => 'Попытка добавления записи в блок хэша',
      :id   => bson.to_s
    }
  end
end

class HashTransfer
  def initialize(options)
    @table         = options[:table]
    @fragmentation = options['fragmentation']
    @inserted      = options[:inserted]
    @part = options['part'].nil? ? 1 : options['part']+1  
    @hash = options['hash']
    @key  = options['key']
  end

  def rewrite
    $db_o4em[@table].insert_one({
      :key   => @key, 
      :part  => @part,
      :hash  => @hash  # старый hash в новый part
    })
    $db_o4em[@table].update_one({
      :key     => @key,
      :anchor  => 1,
    },{
      :fragmentation => getFragmention,
      :key     => @key,
      :part    => @part, # meta part
      :anchor  => 1,
      :counter => 1,
      :hash    => { "#{BSON::ObjectId.new()}" => @inserted } # наш hash в первый элемент в якорь
    })
  end

  private
  def getFragmention
    if @fragmentation.nil?
      0
    else
      @fragmentation
    end
  end
end

class HashRead
  def initialize(options)

    @table = options[:table]
    @key   = options[:key]
    @table_read_amount = options[:amount] if options[:amount]

    @last_position = options[:last_position] if options[:last_position]

    unless options[:last_part].nil?
      @request = { :key => @key, :part => options[:last_part], :anchor => { :$exists => false } }
      @part    = options[:last_part]
    else
      @request = { :key => @key, :anchor => 1 }
    end
  end
  def read
    history  = {}
    result   = {}
    position = 0

    loop do
      data = find
      break if data.nil?
      setPosition( data['hash'] )
      history[position] = { :part => @part, :result_position => @position }
      @position.downto(0) do |count|
        id_position   = data['hash'].keys[count]
        data_position = data['hash'][id_position]
        next if exception(data_position)
        result[:position] = count
        position += 1
        result["h_#{position}"] = extra( data_position, id_position )
        history[position] = { :part => @part, :result_position => result[:position] }
        break if position >= @table_read_amount
      end 
      break if position >= @table_read_amount
      if setNextPart( data ).nil?
        history[position][:part] = { :part => @part, :result_position => position }
        break
      end
      setRequest
    end

    if @table_read_amount == position then
      result.delete("h_#{position}")
      result[:this_hash_poor] = false
      position -= 1
      result[:position] = history[position][:result_position]
      @part = history[position][:part]
    else
      result[:this_hash_poor] = true
    end

    if position > 0 then
      result[:counter] = position
      if result[:position] == 0 
        case @part
        when 1
        when nil
        else
          result[:part] -= 1 if result[:part]
          result.delete(:position)
        end
      else
        result[:position] -= 1
        result[:part] = @part
      end

      {
        :bool => true,
        :code => 0,
        :info => 'Успешно считанны записи из хэша',
        :hash => result
      }
    else
      {
        :bool => false,
        :code => 0,
        :info => 'Нет записей для блока хэша',
        :hash => result
      }
    end
  end

  private
  def find
    data = $db_o4em[@table].find(@request).first
    @parts_count = data['part'] if data['part'] if data
    data
  end
  def setRequest
    @request = { :key => @key, :part => @part, :anchor => { :$exists => false }}
  end
  def setPosition(hash)
    if @last_position
      @position = @last_position
      @last_position = nil
    else
      @position = hash.keys.size-1
    end
  end
  def setNextPart( data )
    if @part.nil?
      if data['part']
        @part = data['part']
        return true
      else
        return nil
      end
    else
      if @part == 1
        return nil
      else
        @part -= 1
        return true
      end
    end
  end

  def exception(data_position={})
    false
  end
  def extra (hash={},key=nil)
  end
end

=begin
HashWrite.new({
  :table => 'noticeNew',
  :key => 'apelisin',
  :inserted => {:t=>'op',:e=> 'hlop'},

  :write_limit => 3
}).add
=end