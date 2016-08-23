var sepia = function (imageData) {
  // получаем одномерный массив, описывающий все пиксели изображения
  var pixels = imageData.data;
  // циклически преобразуем массив, изменяя значения красного, зеленого и синего каналов
  for (var i = 0; i < pixels.length; i += 4) {
    var r = pixels[i];
    var g = pixels[i + 1];
    var b = pixels[i + 2];
    pixels[i]     = (r * 0.393)+(g * 0.769)+(b * 0.189); // red
    pixels[i + 1] = (r * 0.349)+(g * 0.686)+(b * 0.168); // green
    pixels[i + 2] = (r * 0.272)+(g * 0.534)+(b * 0.131); // blue
  }
  return imageData;
};