# encoding: UTF-8

module QuantumSearchMod
  module Dictionary
    def abcd
    end
  end
end

class QuantumSearchN
  include QuantumSearchMod::Dictionary

  def initialize(options)
    @bd = $db_o4em
    @table = options[:table]
    @key_in_table = 'quantum' # Ключ от корня таблици, где храниться "квант поиска"

    @abcd = abcd
  end

  def add
  end

  def read
    @bd[@table].find({})
  end
end