$(document).ready(function () {


var imgs_upl = [];

	$('input[type=file].add-image').on('change', function () {
		var input_file_selector = $(this);
		var image = $(input_file_selector).parents('.image');
		if ($(input_file_selector).val()) {
			var image_div_selector = $(this).parents('.jq-file');
			var preload = '/catalog/preload.php';
			var fd = new FormData();
			fd.append('sid', $('input[type=hidden]').val());
			fd.append('img', $(input_file_selector)[0].files[0]);
			$(image_div_selector).css('background-image', "url('/local/templates/lorian/assets/images/loading.svg')");
			$.ajax(
				{
					type: 'POST',
					url: preload,
					data: fd,
					processData: false,
					contentType: false,
					success: function (data) {
						if (!data){
							$(image_div_selector).css('background-image', "url('images/big-size.png')");
						}else{
							$(image_div_selector).css('background-image', "url('" + data + "')");
							$(image).next().css('display', 'block');
							imgs_upl.push(data);
						}
					},
					error: function (data) {
						console.log(data);
					}
				});
		}
	});




$('form.add_otziv_k_tovaru').on('submit', function (e) {
	e.preventDefault();

	var url = '/local/ajax/otzivi_k_tovaram.php',
		values = [];

	$("form.add_otziv_k_tovaru input[type=text]").each(function () {
		values.push($(this).val());
	});
	values.push($(this).find('input[type=radio]:checked').val());
	values.push($("form.add_otziv_k_tovaru textarea").val());
	values.push(imgs_upl);

	$.ajax({
		url: url,
		type: 'POST',
		data: {
			'values' : values,
			'g-recaptcha-response': grecaptcha.getResponse(),
		},
		success: function (data){
			console.log(data);

			if(data[0]){
				$('form.add_otziv_k_tovaru').fadeOut();
				setTimeout(function(){
					$('.zagolovok_ookt+.form_response').addClass('mes-success').html('<p>'+data[1]+'</p>');
				}, 800);


			// 	$('#dropzone .feedback_questions>div:first-child input').val('');
			// 	$('#dropzone .feedback_questions .jq-file').val('').css({'background-image': 'url(/local/templates/lorian/assets/images/otzivy-upload-foto.png)', 'width':'80px', 'box-shadow':'0 1px 2px rgba(0,0,0,.1)'});
			// 	$('.resum_upload_foto .jq-file__name').text('');
			// 	$('.modal_CV p').css('color', '#00956d');
			}else{
				$('.zagolovok_ookt+.form_response').css('color', 'red').html('<p>'+data[1]+'</p>');

			// 	$('.modal_CV p').css('color', '#fe4407');
			}
			$('form.add_otziv_k_tovaru .g-recaptcha').remove();
			$('form.add_otziv_k_tovaru .feedback_upload_fotos_area+div').html('<script src="https://www.google.com/recaptcha/api.js" async defer></script><div class="g-recaptcha" data-sitekey="6LcuBqQUAAAAAEKrlODULEk943nYGVYxKaVGZ_gQ"></div>');
			//
			//
			// $('.modal_CV p').html(data[1]);
			// $('.modal_CV, .modal_CV+div').css('display', 'block');

		}
	})
});


});