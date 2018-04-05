# encoding: UTF-8
require 'unicode_utils'

=begin
require 'benchmark'
 
Benchmark.bm do |bm|
 
    bm.report do
      a = "Саша Грищин".downcase
      p UnicodeUtils.downcase(a)
    end
    
    bm.report do
      b = "Sasha Grishin".downcase
      p b
    end
    bm.report do
      c = "Саша Грищин".downcase
      p UnicodeUtils.downcase(c)
    end
end
=end

      c = "Саша Грищин".downcase

      c = UnicodeUtils.downcase(c)

      c = c.split("")
      puts c

