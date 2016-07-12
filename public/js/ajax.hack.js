$(document).ajaxSuccess(function(e, data, status, xhr) {
  try {
    data = jQuery.parseJSON(data.responseText);
  } catch (err) {
    console.log('Error ajax.hack parse: '+err);
    return;
  }
  if(data['content']){
    var content =  data['content'];
    }
  }
});
