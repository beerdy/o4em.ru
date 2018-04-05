# coding: utf-8

module Users
  def convert(options)
    user_id = options[:u_id]
    return current_profile if options[:u_id] == current_profile[:]

    {
      :u_first_mind     => !user_data.has_key?('ж'), #первый опрос или нет
      :u_chown          => user_data['а'],          #chown
      :u_country        => user_data['с'],
      :u_last_time      => user_data['х'],
      :u_about          => user_data['о'],
      :u_nickname       => user_data['я'],
      :u_name           => (user_data['и'].nil? ? user_data['я'] : user_data['и']), #если нет имени отображаем никнейм
      :u_city           => user_data['г'],

      :u_mind_c         => user_data['м'],
      :u_comment_c      => user_data['к'],
      :u_field_c        => 
      :u_following_c    => user_data['н'],
      :u_followers_c    => user_data['п'],

      :u_photo          => user_data['ф'],
      :u_id             => user_id,
      :u_im             => my_page,
      :u_imfollow       => im_follow
    }
  end
end