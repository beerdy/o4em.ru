# encoding: UTF-8

module MindRemove
  def mind_remove
    bson   = BSON::ObjectId( @env.client_data['m_id'] )
    result = $mind.find({ :_id => bson, :i => @env.client_cookie_id }).first
    if result.nil?
      return { :bool => false, :code => 0, :info => 'Не существует мнения отвечающего Вашему запросу' }
    elsif result['c'] > 2
      return { :bool => false, :code => 0, :info => 'Невозможно удалить мнение - больше трех комментариев' }
    elsif result['l']+result['d'] > 1
      return { :bool => false, :code => 0, :info => 'Невозможно удалить мнение - больше двух проголосовавших' }
    else
      $mind.update( { :_id => bson }, {:$set => { :m => true }})
      return { :bool => true, :code => 0, :info => 'Мнение успешно удалено' }
    end
  end
end