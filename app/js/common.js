$(function() {

	// animate
		
		
	new WOW().init();

	//logo стилизуем лого добавлением span
	$('.header-logo_link').each(function () {
		var ths = $(this);
		
		ths.html(ths.html().replace('МЕД', '<span class="header-logo_link__med">МЕД</span>'));
		
		ths.html(ths.html().replace('ИНФО', '<span class="header-logo_link__info">ИНФО</span>'));

	});
	
	// $('header-logo_link wow fadeInDownBig').click(function () {
	// 	$(this).toggleClass('header-logo_link wow fadeOutUp');
	// 	});

//Search
	$('.header_search').click(function () {
		$('.header_search__filed').stop().slideToggle();
		$('.header_search__filed input[type=text]').focus();
	});

	$(document).keyup(function (e) {
		if (e.keyCode == 27) {
			$('.header_search__filed').slideUp();
		}
	}).click(function () {
		$('.header_search__filed').slideUp();
	});
	$('.header_search').click(function (e) {
		e.stopPropagation();
	});

	$('.header_search__filed').click(function () {
		$('.header_search__filed').slideToggle();
		// $('.header_search__filed input[type=text]').focus();
	});


//************************************************** */
	
	//menu-mobile
	
	
		
		$('.header').after('<div class="mobile-menu">');// $('.mobile-menu-button').toggleClass('mobile-menu');
			$('.top-menu').clone().appendTo('.mobile-menu');
			$('.mobile-menu-button').click(function () {
				$('.mobile-menu').slideToggle();
				
					
		});
	// $('#Nav').toggleClass('mobile-menu').removeClass('.Navigation');
// 			$('.Navigation').clone().appendTo('.mobile-menu');
// 			// $('.mobile-menu').attr('.wow', '.ww');
// 		}
// 		else{
// 			// Подключаем стиль для остальных
// 			$('.mobile-menu').css("display", "none"); 
// 		}
//  $('.mobile-menu-button').click(function() {
// 	 $('.mobile-menu').stop().slideToggle();
	if ($(window).width() > 700) {
		$('.mobile-menu').remove('.mobile-menu');
		// location.reload();
}


	
//End
});