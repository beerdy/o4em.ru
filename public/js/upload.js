var upload = {
	checkSystem: function(){

		return systemOS;
	},
	android: function(active){
	}
}
/*
     var input = $(data_this)[0];
      if ( input.files && input.files[0] ) {
        if ( input.files[0].type.match('image.*') ) {
        	$('.addPhototext').text("Загрузка...");
            var reader = new FileReader();
            reader.onload = function(e) {
            	$('#image_preview').attr('style', '');
                $('#image_preview').attr('src', e.target.result);
                $('#image_preview').attr('src', e.target.result);
                width = $('#image_preview').width(); // Current image width
                height = $('#image_preview').height(); // Current image height
                    if (width >= height ) {
                        ratio = width / height; // get ratio for scaling image
                        newWidth = 274 * ratio;
                        margin = '-' + (newWidth - 274) /2 + 'px';
                        $('img#image_preview').css("width", newWidth + 'px'); // Set new width
                        $('img#image_preview').css("height", '274px'); // Scale height based on ratio
                        $('#image_preview').css("margin-left", margin);
                    }
                    if (height > width) {
                        ratio = height / width; // get ratio for scaling image
                        newHeight = 274 * ratio;
                        margin = '-' + (newHeight - 274) /2 + 'px';
                        $('img#image_preview').css("height", newHeight + 'px'); // Set new width
                        $('img#image_preview').css("width", '274px'); // Scale height based on ratio
                        $('#image_preview').css("margin-top", margin);
                    }
                    $('#image_preview').show();
                    $('.addPhototext').hide();
            }
            reader.readAsDataURL(input.files[0]);
        } else console.log('is not image mime type');
      } else console.log('not isset files data or files API not supordet');
*/