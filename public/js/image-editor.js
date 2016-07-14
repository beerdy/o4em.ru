var imageEditor = {
    init: function(){
        // С
        var example = document.getElementById("image_preview"),
        canvas.width = 800;
        canvas.height = 800;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(this, 0, 0, tempW, tempH);
        dataURL = canvas.toDataURL('image/jpeg', 0.8);
        $('#image_preview').attr('src', dataURL);
    },  