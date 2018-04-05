"use strict";
(function (factory) {
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else {
        factory(jQuery);
    }
}(function ($) {
    var imgEditor = function(options, el){
        var el = el || $(options.imageBox),
            obj =
            {
                state : {},
                ratio : 1.1,
                options : options,
                imageBox : el,
                thumbBox : el.find('.photoEditorCropper'),
                previewBox : options.previewBox,
                image : new Image(),
                getDataURL: function ()
                {
                    var prop = 800/obj.thumbBox.width();
                    var width = 800,
                        height = 800,
                        canvas = document.createElement("canvas"),
                        dim = el.css('background-position').split(' '),
                        size = el.css('background-size').split(' '),
                        dx = (parseInt(dim[0]) - el.width()/2 + obj.thumbBox.width()/2)*prop,
                        dy = (parseInt(dim[1]) - el.height()/2 + obj.thumbBox.height()/2)*prop,
                        dw = parseInt(size[0])*prop,
                        dh = parseInt(size[1])*prop,
                        sh = parseInt(this.image.height),
                        sw = parseInt(this.image.width);

                    canvas.width = width;
                    canvas.height = height;
                    var context = canvas.getContext("2d");
                    context.drawImage(this.image, 0, 0, sw, sh, dx, dy, dw, dh);
                    
                    var imageData = canvas.toDataURL('image/jpeg');
                    return imageData;
                },
                getBlob: function()
                {
                    var imageData = this.getDataURL();
                    var b64 = imageData.replace('data:image/jpeg;base64,','');
                    var binary = atob(b64);
                    var array = [];
                    for (var i = 0; i < binary.length; i++) {
                        array.push(binary.charCodeAt(i));
                    }
                    return  new Blob([new Uint8Array(array)], {type: 'image/jpeg'});
                },
                zoomIn: function ()
                {    
                    this.ratio*=1.05;
                    setBackground();
                    return false;
                },
                zoomOut: function ()
                {
                    this.ratio*=0.95;
                    setBackground();
                     return false;
                },
                rotate: function(rotate){
                    var canvas = document.createElement("canvas");
                    canvas.width = this.image.height;
                    canvas.height = this.image.width;
                    var ctx = canvas.getContext("2d");

                    canvas.setAttribute('width', this.image.height);
                    canvas.setAttribute('height', this.image.width);

                    if(rotate == 'left'){
                        ctx.rotate(-90 * Math.PI / 180);
                        ctx.drawImage(this.image, -this.image.width, 0);
                    } else if(rotate == 'right'){
                        ctx.rotate(90 * Math.PI / 180);
                        ctx.drawImage(this.image,0,-this.image.height);
                    }

                    el.css({'background-image': 'url(' + canvas.toDataURL('image/jpeg') + ')'});

                    //Обновляем состояние фотографии
                    obj.image.src = canvas.toDataURL('image/jpeg');
                },
                imgFilter: function(type)
                {
                    //Возвращаем изображение к исходному состоянию
                    obj.image.src = obj.image.original;

                    var canvas = document.createElement("canvas");
                    canvas.width = this.image.width;
                    canvas.height = this.image.height;
                    var ctx = canvas.getContext("2d");
                    
                    ctx.drawImage(this.image, 0, 0);
                    if(type=="vintage"){
                        // получаем объект, описывающий внутреннее состояние области контекста
                        var imageData = ctx.getImageData(0, 0, this.image.width, this.image.height);
                        // фильтруем
                        var imageDataFiltered = sepia(imageData);
                        // кладем результат фильтрации обратно в canvas
                        ctx.putImageData(imageDataFiltered, 0, 0);
                    }
                    el.css({'background-image': 'url(' + canvas.toDataURL('image/jpeg') + ')'});

                    //Обновляем состояние фотографии
                    obj.image.src = canvas.toDataURL('image/jpeg');
                },
                imgCrop: function(){
                    var img = cropper.getDataURL();
                    obj.previewBox.attr({'src':img});
                    el.hide();
                },
                close: function(){
                    el.css({
                        'background-image': 'url()'});
                    el.hide();
                }
            },
            setBackground = function()
            {

                if(parseInt(obj.image.width)>parseInt(obj.image.height)){
                    var prop = parseInt(obj.image.height)/obj.thumbBox.height();
                    var w =  parseInt(obj.image.width)/prop*obj.ratio;
                    var h =  obj.thumbBox.height()*obj.ratio;
                }else{
                    var prop = parseInt(obj.image.width)/obj.thumbBox.width();
                    var h =  parseInt(obj.image.height)/prop*obj.ratio;
                    var w =  obj.thumbBox.width()*obj.ratio;
                }

                var pw = (el.width() - w) / 2;
                var ph = (el.height() - h) / 2;

                el.css({
                    'background-image': 'url(' + obj.image.src + ')',
                    'background-size': w +'px ' + h + 'px',
                    'background-position': pw + 'px ' + ph + 'px',
                    'background-repeat': 'no-repeat'});
            },
            imgMouseDown = function(e)
            {
                e.stopImmediatePropagation();

                obj.state.dragable = true;
                obj.state.mouseX = e.clientX;
                obj.state.mouseY = e.clientY;
            },
            imgMouseMove = function(e)
            {

                var myClientX;
                var myClientY;

                e.stopImmediatePropagation();
                e.preventDefault();

                if(e.type == 'touchmove') {
                  var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
                  var myClientX = touch.clientX;
                  var myClientY = touch.clientY;
                }else{
                  var myClientX = e.clientX;
                  var myClientY = e.clientY;
                }
                 
                if (obj.state.dragable)
                {
                    var x = myClientX - obj.state.mouseX;
                    var y = myClientY - obj.state.mouseY;

                    var bg = el.css('background-position').split(' ');

                    var bgX = x + parseInt(bg[0]);
                    var bgY = y + parseInt(bg[1]);

                    //if(bgX>0){ bgX = 0;} 
                    //if(bgY>0){ bgY = 0;} 

                    el.css('background-position', bgX +'px ' + bgY + 'px');

                    obj.state.mouseX = myClientX;
                    obj.state.mouseY = myClientY;
                }

            },
            imgMouseUp = function(e)
            {
                e.stopImmediatePropagation();
                obj.state.dragable = false;
            },
            zoomImage = function(e)
            {
                e.originalEvent.wheelDelta > 0 || e.originalEvent.detail < 0 ? obj.ratio*=1.1 : obj.ratio*=0.9;
                setBackground();
            }

        //obj.spinner.show();
        obj.image.onload = function() {
            el.show();
            setBackground();

            el.on('touchstart mousedown', imgMouseDown);
            el.on('touchmove mousemove', imgMouseMove);
            el.on('touchend mouseup', imgMouseUp);
            el.on('mousewheel DOMMouseScroll', zoomImage);
        };
        obj.state.dragable = false;
        obj.image.src = options.imgSrc;
        obj.image.original = options.imgSrc;
        el.on('remove', function(){$(window).unbind('mouseup', imgMouseUp)});

        return obj;
    };

    jQuery.fn.imgEditor = function(options){
        return new imgEditor(options, this);
    };
}));