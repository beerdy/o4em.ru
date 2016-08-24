# encoding: UTF-8

class People
  def initialize(env)
    @env = env
    @tom_minder_file = '/run/top_minder'
  end

  def top_minder
    data = Hash.new
    data[:counter] = 0

    File.readlines(@tom_minder_file).map do |user|
      users = user.split('_')
      next unless users[0] =~ /^[0-9a-fA-F]{24}$/
      data[:counter] += 1
      data["u_#{data[:counter]}"] = NewUser.get_user(@env.client_cookie_id,users[0])
    end

    return {
      :bool => false,
      :code => 0,
      :info => 'Топ миндеров неопределен',
    } if data[:counter] == 0

    {
      :bool => true,
      :code => 0,
      :info => 'Топ миндеров считан',
      :action => 'top_minder',
      :users => data
    } 
  end
  def search_people
    obj = QuantumSearch.new('authn',{
        :amount  => 12,
        :word    => @env.client_data['user_name'],
        :endrate => @env.client_data['last_user_id'],
    }, true )
    def obj.usercookie_id=(usercookie_id)
      @usercookie_id = usercookie_id
    end
    obj.usercookie_id = @env.client_cookie_id
    def obj.extra(data)
      NewUser.get_user( @usercookie_id,nil,data )
    end
    data = obj.search
    if data[:bool]
      data[:action] = 'search_people'
      data[:users]  = data.delete(:data)
    end
    data
  end
end