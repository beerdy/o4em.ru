# coding: utf-8

module MindReadM
  module Messages
    def message_minds_read_bad
      { :bool => false, :code => 3001, :info => 'Нет мнений' }
    end
    def message_minds_read_ok(content,action)
      { :bool => true, :code => 4001, :info => 'Мнения успешно считаны', :action => action, :content => content }
    end
    def message_pool_no
      { :bool => false, :code => 3002, :info => 'Пул не инициализирован' }
    end
    def message_pool_poor
      { :bool => false, :code => 3003, :info => 'Пул инициализирован но пуст' }
    end
  end
  module Fib
    def each_mind
      fib = Fiber.new do |minds,count=1|
        minds.each do |mind|

          mind[:_id] = mind['_id'].to_s
          mind[:count] = count
          count += 1

          Fiber.yield mind 
        end
        Fiber.yield nil
      end
    end
  end
  module OnlineUsers
    def read_online(id)
      users_online = Hash.new

      return message_pool_no if @env.pool.nil?
      @env.pool.control.mindid = id
      return message_pool_poor unless @env.pool.online
      return message_pool_poor unless @env.pool.success.received_message.has_key?('users')

      @env.pool.success.received_message['users'].each_with_index do |(user_id),index|
        users_online[index] = NewUser.get_user( @user_id, user_id )
      end

    end
  end
end


class MindReadN
  attr_reader :minds

  include MindReadM::Messages
  include MindReadM::Fib
  include MindReadM::OnlineUsers

  def initialize(env)
    @env = env
    @minds = Hash.new {|h,k| h[k]={}}

    @user_id = @env.client_data.has_key?('user_id') ? @env.client_data.has_key?('user_id') : @env.client_cookie_id
    @current_profile = @env.client_current_profile
  end

  def minds_read_top(last_mindid=nil)
    minds_read(last_mindid,{},{:sort=>[:g,-1]})
  end

  def minds_read(last_mindid=nil, request={:i=>@user_id,:m=>false}, sort={:sort=>[:_id,-1]})
    request.merge!({ :_id => {'$lt' => BSON::ObjectId(last_mindid) }}) if last_mindid
    minds = $mind.find(request, sort).limit( $minds_read_limit )

    return message_minds_read_bad unless minds

    fib = each_mind
    count = 0
    mind = fib.resume minds
    loop do
      break if mind.nil?
      
      count = mind[:count]

      @minds[count][:mind_content] = mind
      @minds[count][:online_users] = read_online( mind[:_id] )
      @minds[count][:mind_itmy]    = @user_id==['i']
      @minds[count][:mind_user]    = @user_id==['i'] ? @current_profile : NewUser.get_user( @user_id, mind['i'] )

      mind = fib.resume
    end

    #pp @minds

    if @minds.has_key?($minds_read_limit)
      @minds[:last] = false
      @minds[:count] = count-1
      @minds.delete($minds_read_limit)
    else
      @minds[:last] = true
      @minds[:count] = count
    end

    return message_minds_read_bad if count == 0
    return @minds = message_minds_read_ok(@minds, @env.client_action)
  end
end