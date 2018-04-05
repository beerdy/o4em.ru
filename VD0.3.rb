#require './VD0.4.rb'

module VolodiyaDriver
	# Попадают только с MegaController и MegaController::RouteLongPool
	#=BEGIN !---Router---!
	def convert(data)
		#return VolodiyaDriver.router(data) if data[:action] == 'minds_read_top'

		#puts "VD - Данные для конвертации: #{data}"
		converted_data = Hash.new

		#only user
		if data[:user] and data[:bool] == false and data[:user][:bool] == true
		return {
			:bool => true,
			:code => 0,
			:content => user(data[:user])
		} 
		end

		return data if data[:bool] == false
		
		case data[:action]
		when 'info_page'
			content = minds( data[:minds] )
			converted_data = {
				:bool => false,
				:code => 0,
				:action => 'auth_false', 
				:content => content.merge({
					:top_tags => data[:tags][:data],
					:mind_count => data[:mind_count], 
					:authn_count => data[:authn_count],
					:comment_count => data[:comment_count],
					:answer_count => data[:answer_count]
				})
			}
		when 'lp_noaction'
			converted_data = {
				:bool => true,
				:code => 0,
				:content => { :action => 'lp_noaction' }
			}
		when 'auth_login', 'route_user', 'vkauth'
			converted_data = master_info( data[:code] )
			converted_data[:content] = user( data[:user] )
			converted_data[:content].merge! minds( data[:minds] ) if data[:minds]
			converted_data[:content][:action] = data[:action]
		when 'field_users'
			converted_data = master_info( data[:code] )
			converted_data[:content] = user( data[:user] )
			converted_data[:content][:u_m] = field_users( data[:hash] )
			converted_data[:content][:f_last_part] = data[:hash][:part] if data[:hash][:part]
			converted_data[:content][:f_last_position] = data[:hash][:position] if data[:hash][:position]
			converted_data[:content][:f_this_minds_last] = data[:hash][:this_hash_poor]
		when 'mind_add'
			converted_data = master_info( data[:code] )
			converted_data[:content] = mind_add( data[:notice] )
			converted_data[:content].merge! user( data[:user] ) if data[:user]
		when 'mind_one'
			converted_data = master_info(data[:code])
			converted_data[:content] = { 
				'u_m' => { 
					'm_1' => mind( data[:minds]['m1'] )
				} 
			}
			converted_data[:content]['u_m']['m_1'].merge! ({ 'm_user' => user( data[:user] ) }) if data[:user]
		when 'minds_read', 'mind_random'
			converted_data = master_info(data[:code])
			converted_data[:content] = minds( data[:minds] )
			converted_data[:content][:top_tags] = data[:top_tags][:data] if data[:top_tags]
		when 'top_tags'
			converted_data = master_info( data[:code] )
			converted_data[:content] = data[:data]
		when 'minds_read_top'
			converted_data = master_info( data[:code] )
			converted_data[:content] = minds_read_top( data[:content] )
		when 'comments_read'
			converted_data = master_info( data[:code] )
			converted_data[:content] = comments( data )
		when 'comment_add'
			converted_data = master_info( data[:code] )
			converted_data[:content] = data[:notice]
			converted_data[:content].merge! user( data[:user] ) if data[:user]
		when 'notices'
			converted_data = master_info( data[:code] )
			converted_data[:content] = notices( data[:hash] )
		when 'field_add'
			converted_data = master_info( data[:code] )
			converted_data[:content] = data[:notice]
			converted_data[:content].merge! user( data[:user] ) if data[:user]
		when 'top_minder'
			converted_data = master_info(data[:code] )
			converted_data[:content] = user( data[:user] )
			converted_data[:content].merge! top_minder(data[:users])
		when 'search_people'
			converted_data = master_info(data[:code] )
			converted_data[:content] = search_people( data )
		when 'follows_read'
			converted_data = master_info(data[:code] )
			converted_data[:content] = user( data[:user] )
			converted_data[:content].merge! follows_read( data[:follows] ) if data[:user][:bool]
		when 'follow', 'follow_remove'
			converted_data = master_info(data[:code])
			converted_data[:content] = { :action => data[:action] }
			converted_data[:content].merge! user( data[:user] ) if data[:user]
		when 'profile_default', 'tags_default'
			converted_data = master_info(data[:code])
			converted_data[:content] = user( data[:user] )
		when 'mind_like'
			converted_data = master_info(data[:code])
			converted_data[:content] = data[:notice]
			converted_data[:content].merge! user( data[:user] ) if data[:user]
		when 'field_check'
			converted_data = master_info(data[:code])
			converted_data[:content] = mind( data[:mind] )
			converted_data[:content][:m_my_field] = data[:my_field]
		when 'hi_man'
			converted_data = {
				:bool => true,
				:code => 860,
				:content => data[:notice]
			}
			puts "Converted: #{converted_data[:content]}"
			puts "USER: #{data}"
			converted_data[:content].merge!(data[:user])
		else
			converted_data = data
		end
		
		case data[:action]
		when 'comment_add', 'mind_add', 'follow', 'follow_remove', 'mind_plus', 'mind_minus','field_add', 'field_check'
			if data.has_key?(:pool) then
			if converted_data then
			if converted_data.has_key?(:content) then
				converted_data[:content][:m_online] = online( data[:m_online] )
				converted_data[:content][:m_online_c] = data[:m_online][:counter]
				converted_data[:content][:m_id] = data[:m_id]
				#converted_data[:content][:action_slave] = 'online'
			end end end
		when 'online'
			converted_data = {
				:bool => true,
				:code => 850,
				:content => {
					:action => 'online',
					:m_online => online( data[:m_online] ),
					:m_online_c => data[:m_online][:counter],
					:m_id => data[:m_id]
				}
			}
		end if data.has_key?(:m_online)

		converted_data
	end  #=END !---Router---!

	#=BEGIN !---Convertor---!
	def master_info( code )
		{ :bool => true, :code => code }
	end

	def mind_add(data)
		{
			:m_id       => data['m_id'],
			:m_time     => data['m_time'],
			:m_u_id     => data['u_id'],
			:m_text     => data['m_text'],
			:m_tags     => data['m_tags'],
			:m_status   => data['m_status']
#			"m_mymind"  => data["m#{i}"][:mymind]
		}
	end
  def field_users(data)
    return { :u_m => nil } if data.nil?
    count = 1
    field = {}
    loop do
      h = "h_#{count}"
      m = "m_#{count}"
      if data[h] then

        field[m] = mind( data[h]['mind'] )
        field[m][:u_m_filed] = data[h]['field']
        field[m][:u_m_field_time] = data[h]['f_time']
        field[m][:m_user] = user( data[h]['user'] )

      else
        break
      end

      count += 1
    end

    return {:bool=> fale, :code => 0, :info => 'Ошибка перебора ХЭШа', :action => 'field_users' } if count == 1
    return field
  end
	def minds(data)
		return false if data.nil?

		ready_data = Hash.new

		1.upto(data[:count]) { |i|
			ready_data["m_#{i}"] = mind(data["m#{i}"])
		}
		{ 
			:u_m => ready_data,
			:u_m_this_minds_last => data[:this_minds_last]
		}
	end

	def minds_read_top(data)
		ready_data = Hash.new
		1.upto(data[:count]) { |i|
			ready_data["m_#{i}"] = mind(data[i][:mind_content])
			ready_data["m_#{i}"]['m_user'] = user(data[i][:mind_user])
		}

		{ 
			:u_m => ready_data,
			:u_m_this_minds_last => data[:last],
			:u_m_count => data[:count]
		}
	end

	def mind(data)
		f = field(data)
		summ = f.delete(:summ) unless f == false
		{
			:m_id        => data['_id'].to_s,
			:m_time      => data['t'],
			:m_u_id      => data['i'],
			:m_c_count   => data['c'],
			:m_yes_count => data['l'],
			:m_no_count  => data['d'],#???
			:m_text      => data['x'],
			:m_tags      => data['h'],
			:m_view_c    => data['position'],
#			:m_my_yes_no => data[:my_status],
#			:m_status    => data['s'],
			:m_my_field  => data[:my_field],
			:m_fields    => f,
			:m_fields_c  => summ, 
			:m_user      => ( data[:user].nil?       ? nil : user( data[:user] ) ),
			:m_comments  => ( data[:comments].nil?   ? nil : comments( data[:comments] ) ),
			:m_online_c  => ( data[:m_online_c].nil? ? nil : data[:m_online_c] ),
			:m_online    => ( data[:m_online].nil?   ? nil : data[:m_online] )

#			"m_mymind"    => data["m#{i}"][:mymind]
		}
	end
  def field(data)
    ready_data = Hash.new
    ready_data[:summ] = 0
    one_of = false
    return false if data['f'].nil?
    data = data['f']
    count = 1
    while true
      if data["f_text#{count}"].nil?
        break
      else
        one_of = true
        ready_data["f#{count}"] = { :title => data["f_text#{count}"], :count => data["f_countf#{count}"] } unless data["f_text#{count}"].nil?
        ready_data[:summ] += data["f_countf#{count}"].to_i
      end
      count += 1
    end
    return false unless one_of
    return ready_data
  end
	def comments(data)
		return { :m_c => nil } if data[:bool] == false
		ready_data = Hash.new
		counter = data[:hash][:counter]
		1.upto(data[:hash][:counter]) { |i|
			if data[:hash]["h_#{i}"]
				data[:hash]["h_#{i}"]['u_im'] = data[:hash]["h_#{i}"].delete('c_my')
				data[:hash]["h_#{i}"].delete(:bool) if data[:hash]["h_#{i}"][:bool]
				data[:hash]["h_#{i}"].delete(:bool) if data[:hash]["h_#{i}"][:bool]
				data[:hash]["h_#{i}"].delete(:info) if data[:hash]["h_#{i}"][:info]
				data[:hash]["h_#{i}"].delete(:code) if data[:hash]["h_#{i}"][:code]
				data[:hash]["h_#{i}"].delete('m_id')    if data[:hash]["h_#{i}"]['m_id']
				data[:hash]["h_#{i}"].delete('m_u_id')  if data[:hash]["h_#{i}"]['m_u_id']
				#data[:hash]["h_#{i}"].delete('m_status')if data[:hash]["h_#{i}"]['m_status']
				data[:hash]["h_#{i}"].delete('m_tags')  if data[:hash]["h_#{i}"]['m_tags']
				data[:hash]["h_#{i}"].delete('m_text')  if data[:hash]["h_#{i}"]['m_text']
			end
			ready_data["c_#{counter}"] = data[:hash]["h_#{i}"]
			counter -= 1
		}

		{
			:c => ready_data,
			:c_last_part => data[:hash][:part],
			:c_last_position => data[:hash][:position],
			:c_this_comments_last => data[:hash][:this_hash_poor]
		}
	end

	def notices(data)
		ready_data = Hash.new
		pp data
		1.upto(data[:counter]).each do |i|
			ready_data["n_#{i}"] = {
				:action => data["h_#{i}"]['action'],

				:u_id        => data["h_#{i}"][:u_id],
				:u_name      => data["h_#{i}"][:u_name],
				:u_nickname  => data["h_#{i}"][:u_nickname],
				:u_photo     => data["h_#{i}"][:u_photo],
				:u_last_time => data["h_#{i}"][:u_last_time]

			}.merge case data["h_#{i}"]['action']
			when 'hi_man'
				{
					:hi_text      => data["h_#{i}"]['hi_text'],
					:hi_time      => data["h_#{i}"]['hi_time']
				}
			when 'mind_add'
				temp = {
					:n_m_time   => data["h_#{i}"]['m_time'],
					:n_mind => mind(data["h_#{i}"]['m_data'])

				}
				temp[:n_mind][:m_user] = data["h_#{i}"]['m_user']
				temp
			when 'comment_add'
				{
					:m_u_id   => data["h_#{i}"]['m_u_id'],
					:m_id     => data["h_#{i}"]['m_id'],
					:m_text   => data["h_#{i}"]['m_text'],
					:m_status => data["h_#{i}"]['m_status'],
					:m_tags   => data["h_#{i}"]['m_tags'],
					:c_text   => data["h_#{i}"]['c_text'],
					:c_time   => data["h_#{i}"]['c_time'],
				}
			when 'field_add'
				{
					:m_u_id   => data["h_#{i}"]['m_u_id'],
					:m_id     => data["h_#{i}"]['m_id'],
					:m_text   => data["h_#{i}"]['m_text'],
					:m_tags   => data["h_#{i}"]['m_tags'],

					:f_time   => data["h_#{i}"]['f_time'],
					:f_status => data["h_#{i}"]['f_status'],
					:f_change  => data["h_#{i}"]['f_change'],
					:f_text   => data["h_#{i}"]['f_text'],
					
				}
			when 'follow'
				{
					:f_time => data["h_#{i}"]['time']
				}
			when 'follow_remove'
				{
					:f_time => data["h_#{i}"]['time']
				}
			when 'mind_minus', 'mind_plus'
				{
					:m_id   => data["h_#{i}"]['m_id'],
 					:m_text => data["h_#{i}"]['m_text'],
 					:m_u_id => data["h_#{i}"]['m_u_id'],
 					:n_time => data["h_#{i}"]['n_time'],
 					:u_like => data["h_#{i}"]['u_like']
				}
			else
				{}
			end
		end

		{
			:n => ready_data,
			:n_last_part => data[:part],
			:n_last_position => data[:position],
			:n_this_notices_last => data[:this_hash_poor]
		}
	end
	def online(data)
		ready_data = Hash.new
		
		1.upto(data[:counter]) do |i|
			u = "u_#{i}"
			ready_data[u] = {
				:u_id        => data[u][:u_id],
				:u_nickname  => data[u][:u_nickname],
				:u_name      => data[u][:u_name],
				:u_photo     => data[u][:u_photo],
				:u_about     => data[u][:u_about],
				:u_country   => data[u][:u_country],
				:u_city      => data[u][:u_city],
				:u_last_time => data[u][:u_last_time],
				:u_imfollow  => data[u][:u_imfollow]
			}
		end
		ready_data
	end
	def follows_read(data)
		ready_data = Hash.new
		
		1.upto(data[:counter]) do |i|
			u = "#{i}"
			ready_data["u_#{i}"] = {
				:u_id        => data[u][:u_id],
				:u_nickname  => data[u][:u_nickname],
				:u_name      => data[u][:u_name],
				:u_photo     => data[u][:u_photo],
				:u_about     => data[u][:u_about],
				:u_country   => data[u][:u_country],
				:u_city      => data[u][:u_city],
				:u_last_time => data[u][:u_last_time],

				:u_imfollow  => data[u][:u_imfollow]
			}
		end
		{
			:f => ready_data,
			:f_last_part => data[:part],
			:f_last_position => data[:position],
			:f_last => data[:last]
		}
	end
	def follow(data)
		{ :action => 'follow' }
	end
	def follow_remove(data)
		{ :action => 'follow_remove' }
	end
	def top_minder(data)
		{
			:u_top_minder => users(data),
			:u_c => data[:counter]
		}
	end
	def search_people(data)
		{
			:u_last    => data[:last],
			:u_counter => data[:count],
			:u_finded  =>	data[:users]
		}
	end
	def user(data)
		{
			:u_first_mind  => data[:u_first_mind],
			:u_id          => data[:u_id],
			:u_nickname    => data[:u_nickname],
			:u_name        => (data[:u_name].nil? ? data[:u_nickname] : data[:u_name]),
			:u_photo       => data[:u_photo],
			:u_about       => data[:u_about],
			:u_country     => data[:u_country],
			:u_city        => data[:u_city],
			:u_last_time   => data[:u_last_time],
			:u_followers_c => data[:u_followers_c],
			:u_following_c => data[:u_following_c],
			:u_m_count     => data[:u_mind_c],
			:u_field_c     => data[:u_field_c],
			:u_c_count     => 0,
			:u_yes_count   => data[:u_mind_yes_c],
			:u_no_count    => data[:u_mind_no_c],
			:u_im          => data[:u_im],
			:u_imfollow    => data[:u_imfollow],
			:u_notice      => data[:u_pool_like_c].to_i+data[:u_pool_comment_c].to_i+data[:u_pool_follow_c].to_i,

			:u_male =>   data[:u_male],  # Пол
			:u_age  =>   data[:u_age],  # Возраст
			:u_social => data[:u_social]  # соцсети

		}
	end
	def users(data,prerfix='u_')
		ready_data = Hash.new
		1.upto data[:counter] do |count|
			tmp = "#{prerfix}#{count}"
			ready_data[tmp] = user( data[tmp] )
		end
		ready_data
	end
	extend self
end