# coding: utf-8

require 'rmagick'

include Magick

class SimpleUploadB64
  attr_accessor :dir
  attr_accessor :filename
  attr_accessor :extention
  attr_accessor :size

  attr_reader :success

  def initialize
    @dir       = '~/'
    @filename  = '~/'
    @extention = 'jpg'
    @size      =  { 'o800' => {:x => 800, :y => 800 }, 'r400x400' => {:x => 400, :y => 400 }, 'r200x200' => {:x => 200, :y => 200 } }
  end

  def upload(base64_code)
    if base64_code =~ /^data:image\/jpeg;base64/ then
      save(base64_code)
    else
      @success = error(0)
    end
  end

private
  def save(file_obj,i=0)
    filename = "#{@dir}/#{@filename}_#{i}"
    filename_ext = "#{filename}.#{@extention}"
    
    begin
      file = Base64.decode64(file_obj)
      img = Magick::Image.read_inline(file_obj)
      correct_and_write( img[0],filename,filename_ext )
      @success = done(filename)
    rescue Exception => e
      @success = error(e)
    end
  end
  def correct_and_write(img,filename,filename_ext)
    @size.map{ |key,sz|
      small_fit  = img.resize_to_fill(sz[:x],sz[:y])
      small_fill = small_fit.resize_to_fit(sz[:x],sz[:y])
      small_fill.write("#{filename}_#{key}.#{@extention}")
    }
  end

protected
  def error(code=0)
    {
      :bool => false,
      :code => code,
      :info => 'Ошибка загрузки файла'
    }
  end
  def done(filename)
    {
      :bool => true,
      :code => 1,
      :info => 'Файл успешно загружен',
      :filename => filename
    }
  end
end


class UploadMindBackground
  def upload(base64_code,usercookie_id,mindid)
    obj = SimpleUploadB64.new()
    
    obj.filename = mindid #BSON::ObjectId.new()
    obj.dir      = "public/img/upload/#{usercookie_id}/mind"
    
    obj.upload(base64_code)
    obj.success
  end
end


class UploadAva
  attr_reader :data
  def initialize(base64_code,usercookie_id)
    obj = SimpleUploadB64.new()
    obj.filename = BSON::ObjectId.new()

    obj.dir = "public/img/upload/#{usercookie_id}"
    #obj.size = { 'o800' => 800, 'r100x100' => 100, 'r40x40' => 40 }
    obj.size = { 'o800' => {:x => 800, :y => 800 }, 'r100x100' => {:x => 100, :y => 100 }, 'r40x40' => {:x => 40, :y => 40 } }

    obj.upload(base64_code)
    @data = obj.success

    $authn.update({ :_id => BSON::ObjectId(usercookie_id) },{:$set => {'ф' => @data[:filename] }}) if @data[:bool]

    return @data
  end
end