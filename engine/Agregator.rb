# coding: utf-8

class Agregator
  def initialize(options,action)
    @options = options
    @action  = action
  end
  
  def recount_mind_liks_disliks
    counter = Hash.new

    counter[:liks] = 0
    counter[:disliks] = 0
    counter[:none] = 0

    mindid = @options[:mindid]
    userid = @options[:userid]
    
    users = $authn.find()

    users.each do |user|
      status = LikeReadUser.new('likeUser',{ :usercookie_id => user['_id'].to_s, :idmind => mindid }).like
      case status
      when 1
        counter[:liks] += 1
      when 2
        counter[:disliks] += 1
      when 0
        counter[:none] += 1
      end
    end

    info = "С мнением '#{mindid}' пользователя #{userid} cогласны: #{counter[:liks]}, несогласны #{counter[:disliks]}, в итоге воздержалось #{counter[:none]} человек."
    
    $mind.update({ 'i' => userid, :_id => BSON::ObjectId( mindid ) }, { :$set  => { :l => counter[:liks], :d => counter[:disliks] } })
    
    { :bool => true, :code => 0, :info => info, :counter => counter}
  end
  
  def recount_minds_for_userid
    counter = 0
    data = {}

    userid = @options[:userid]

    data = { :minds => {:last_mindid => nil} }
    loop do
      data = mind( userid, data[:minds][:last_mindid] )
      #sleep 1
      break unless data[:bool]
      counter += data[:minds][:count]
    end
    info = "КОЛИЧЕСТВО МНЕНИЙ для #{userid}: #{counter}"
    
    $authn.update({ :_id => BSON::ObjectId(userid) },{ '$set' => { 'м' => counter } })

    { :bool => true, :code => 0, :info => info, :counter => counter}
  end
  
  def recount_comments_for_mindid
    counter = 0
    data = {}

    mindid = @options[:mindid]
    userid = @options[:userid]

    data = { :hash => {:part=> nil, :position => nil}}
    loop do
      data = comment( mindid, data[:hash][:part], data[:hash][:position] )
      counter += data[:hash][:counter] if data[:hash].has_key?(:counter) if data[:hash]
      break unless data[:bool]
      break if data[:hash][:this_hash_poor]
    end

    info = "Количество комментариев для '#{mindid}': #{counter}"

    $mind.find_and_modify({
      :query  => {
        :i => userid,
        :_id => BSON::ObjectId( mindid )
      },
      :update => { 
        :$set  => { :c => counter }
      },
      :upsert => false
    })

    { :bool => true, :code => 0, :info => info, :counter => counter}
  end

  def recount_follows_for_userid
    counter = {}
    data = {}

    userid = @options[:userid]
    tables = ['howFollow','imFollow']
    
    tables.each do |table|
      
      counter[table] = 0
      data = { :follows => { :part=> nil, :position => nil } }

      loop do
        data = follow( table, userid, data[:follows][:part], data[:follows][:position] )
        break unless data[:follows]
        counter[table] += data[:follows][:counter]
        break if data[:follows][:last]
      end
    end
    info = "Количество подписок: #{counter['imFollow']}, подписчиков: #{counter['howFollow']}"
    
    $authn.update({ :_id => BSON::ObjectId(userid)},{ '$set' => { 'н' => counter['imFollow'], 'п' => counter['howFollow'] } })

    { :bool => true, :code => 0, :info => info, :counter => counter}
  end

protected
  def follow(table,userid,part=nil,position=nil)
    Follow.new({
      :usercookie_id => userid,
      :table    => table,
      :key      => userid,
      :part     => part,
      :position => position
    }).get
  end
  def comment(mindid,part=nil,position=nil)
    CommentsRead.new({
      :key           => mindid,
      :last_part     => part,
      :last_position => position
    }).read
  end
  def mind(userid,last_mindid=nil)
    MindReading.new({
      :usercookie_id_other => nil,
      :usercookie_id       => userid,
      :current_profile     => nil,
      :endtime             => last_mindid,
      :mindid              => nil
    }).read
  end
end