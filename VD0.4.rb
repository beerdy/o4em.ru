# coding: utf-8

module TestMinds
  def minds_read_top(data)
    {
      :bool => true,
      :code => data[:code],
      :info => 'ТДрайвер - данные успешно протестированны',
      :users => data[:users],
      :content => {
        :0 => {
          :bool => true,
          :code => 1234,
          :action => 'minds_read_top',
          :info => 'info',
          :properties => {
            :count => data.delete(:count)
            :last  => data.delete(:last)
          },
          :content => data[:content]
        } 
      }
    }
  end
  extend self
end

module VolodiyaDriverN
  def router(data)
    return {:bool=>false,:code=>1001,:info=>"Нет данных на входе в ТДрайвер"} if data.nil?
    return {:bool=>false,:code=>1002,:info=>"Данные 'не оформленны' - нет параметра :bool для ТДрайвер"} unless data.has_key?(:bool)
    return {:bool=>false,:code=>1003,:info=>"Ошибка выполнения запроса (см. :content). Таковой ответ не обрабатывается ТДрайвер-ом", :content => data } unless data[:bool]

    #Обрабатываем :action
    case data[:action]
    when 'minds_read_top'
      content = master( data[:action] )
      content[:content] = TestMinds.minds_read_top( data )
    end

    return {:bool=>false,:code=>1004,:info=>"Для данных (см. :content) с положительным ответом :bool ТДрайвер не нашел 'route'"} unless data.has_key?(:bool)
  end

  def master(action)
  {
    :bool => true,
    :code => 2222,
    :info => 'ТДрайвер - данные успешно протестированны',
    :action => action
  }
  end
  extend self
end

}