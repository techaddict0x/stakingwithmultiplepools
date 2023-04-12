/** 
*
* -----------------------------------------------------------------------------
* Template : GamFi - Metaverse Web3 IGO/IDO Token Launchpad Figma Template
* Author : uigigs
* Author URI : http://www.uigigs.com/
*
* -----------------------------------------------------------------------------
*
**/
(function ($) {
  ("use strict");
  // sticky menu
  var header = $(".menu-sticky");
  var win = $(window);
  
  win.on("scroll", function () {
    var scroll = win.scrollTop();
    if (scroll < 1) {
      header.removeClass("sticky");
    } else {
      header.addClass("sticky");
    }
    
    $("section").each(function () {
      var elementTop = $(this).offset().top - $("#sc-header").outerHeight();
      if (scroll >= elementTop) {
        $(this).addClass("loaded");
      }
    });
  });
  
  // wow init
  new WOW().init();
  
  // Counter Up
  var counter = $('.counter');
  if(counter.length) {  
    $('.counter').counterUp({
      delay: 20,
      time: 1500
    });
  }
  
  // magnificPopup init
  var popupvideos = $(".video-icons");
  if (popupvideos.length) {
    $(".video-icons").magnificPopup({
      disableOn: 10,
      type: "iframe",
      mainClass: "mfp-fade",
      removalDelay: 160,
      preloader: false,
      fixedContentPos: false,
    });
  }
  
  //window load
  $(window).on( 'load', function() {
    $(".loader_first").delay(500).fadeOut(300);
    $(".circular-spinner").on( 'click', function() {
      $(".loader_first").fadeOut(300);
    })
  })  
  
  /*-------------------------------------
  OwlCarousel
  -------------------------------------*/
  $(".sc-carousel").each(function () {
    var owlCarousel = $(this),
    loop = owlCarousel.data("loop"),
    items = owlCarousel.data("items"),
    margin = owlCarousel.data("margin"),
    stagePadding = owlCarousel.data("stage-padding"),
    autoplay = owlCarousel.data("autoplay"),
    autoplayTimeout = owlCarousel.data("autoplay-timeout"),
    smartSpeed = owlCarousel.data("smart-speed"),
    dots = owlCarousel.data("dots"),
    nav = owlCarousel.data("nav"),
    navSpeed = owlCarousel.data("nav-speed"),
    xsDevice = owlCarousel.data("mobile-device"),
    xsDeviceNav = owlCarousel.data("mobile-device-nav"),
    xsDeviceDots = owlCarousel.data("mobile-device-dots"),
    smDevice = owlCarousel.data("ipad-device"),
    smDeviceNav = owlCarousel.data("ipad-device-nav"),
    smDeviceDots = owlCarousel.data("ipad-device-dots"),
    smDevice2 = owlCarousel.data("ipad-device2"),
    smDeviceNav2 = owlCarousel.data("ipad-device-nav2"),
    smDeviceDots2 = owlCarousel.data("ipad-device-dots2"),
    mdDevice = owlCarousel.data("md-device"),
    centerMode = owlCarousel.data("center-mode"),
    HoverPause = owlCarousel.data("hoverpause"),
    mdDeviceNav = owlCarousel.data("md-device-nav"),
    mdDeviceDots = owlCarousel.data("md-device-dots");
    owlCarousel.owlCarousel({
      loop: loop ? true : false,
      items: items ? items : 4,
      lazyLoad: true,
      center: centerMode ? true : false,
      autoplayHoverPause: HoverPause ? true : false,
      margin: margin ? margin : 0,
      //stagePadding: (stagePadding ? stagePadding : 0),
      autoplay: autoplay ? true : false,
      autoplayTimeout: autoplayTimeout ? autoplayTimeout : 1000,
      smartSpeed: smartSpeed ? smartSpeed : 250,
      dots: dots ? true : false,
      nav: nav ? true : false,
      navText: [
        "<i class='flaticon flaticon-left-arrow'></i>",
        "<i class='flaticon flaticon-right-arrow'></i>",
      ],
      navSpeed: navSpeed ? true : false,
      responsiveClass: true,
      responsive: {
        0: {
          items: xsDevice ? xsDevice : 1,
          nav: xsDeviceNav ? true : false,
          dots: xsDeviceDots ? true : false,
          center: false,
        },
        768: {
          items: smDevice2 ? smDevice2 : 2,
          nav: smDeviceNav2 ? true : false,
          dots: smDeviceDots2 ? true : false,
          center: false,
        },
        992: {
          items: smDevice ? smDevice : 3,
          nav: smDeviceNav ? true : false,
          dots: smDeviceDots ? true : false,
          center: false,
        },
        1025: {
          items: mdDevice ? mdDevice : 4,
          nav: mdDeviceNav ? true : false,
          dots: mdDeviceDots ? true : false,
        },
      },
    });
  });
  
  //expeander Class
  $('.expeander-iteam-area').on("click", function () {
    $(this).parent().toggleClass('expeand-bottom-content')
  });
  
  
  //canvas menu
  var navexpander = $('#nav-expander');
  if(navexpander.length){
    $('#nav-expander,  #nav-close2').on('click',function(e){
      e.preventDefault();
      $('body').toggleClass('nav-expanded');
    });
  }
  
  /******** Mobile Menu Start ********/
  $('.mobile-navbar-menu a').each(function(){
    var href = $(this).attr("href");
    if(href ="#"){
      $(this).addClass('hash');
    }else{
      $(this).removeClass('hash');
    }
  });
  
  $.fn.menumaker = function(options) {
    var mobile_menu = $(this), settings = $.extend({
      format: "dropdown",
      sticky: false
    }, options);
    
    return this.each(function() {
      mobile_menu.find('li ul').parent().addClass('has-sub');
      var multiTg = function() {
        mobile_menu.find(".has-sub").prepend('<span class="submenu-button"><em></em></span>');
        mobile_menu.find(".hash").parent().addClass('hash-has-sub');
        mobile_menu.find('.submenu-button').on('click', function() {
          $(this).toggleClass('submenu-opened');
          if ($(this).siblings('ul').hasClass('open-sub')) {
            $(this).siblings('ul').removeClass('open-sub').hide('fadeIn');
            $(this).siblings('ul').hide('fadeIn');                                     
          }
          else {
            $(this).siblings('ul').addClass('open-sub').hide('fadeIn');
            $(this).siblings('ul').slideToggle().show('fadeIn');
          }
        });
      };
      
      if (settings.format === 'multitoggle') multiTg();
      else mobile_menu.addClass('dropdown');
      if (settings.sticky === true) mobile_menu.css('position', 'fixed');
      var resizeFix = function() {
        if ($( window ).width() > 991) {
          mobile_menu.find('ul').show('fadeIn');
          mobile_menu.find('ul.sub-menu').hide('fadeIn');
        }          
      };
      resizeFix();
      return $(window).on('resize', resizeFix);
    });
  };
  
  $(document).ready(function(){
    $("#mobile-navbar-menu").menumaker({
      format: "multitoggle"
    });
  });
  
  /*--------------------------------
  kyc process page js
  --------------------------------*/
  $(".kyc_country_dropbox").on('click', function(){
    $(".kyc_country_drop_list").toggle();
  });
  
  $('.kyc_radio_btn .container').on('click', function() {
    $('.kyc_radio_btn').each(function(a) {
      $(this).addClass('active')
    });
  });
  
  
  $('.kyc_radio_btn .container').on('click', function() {
    $('.kyc_radio_btn').each(function(a) {
      $(this).addClass('active')
    });
  });
  $('.nid_btn .container').on('click', function() {
    $('.passport_btn').each(function(a) {
      $(this).removeClass('active')
    });
  });
  $('.nid_btn .container').on('click', function() {
    $('.driving_licnse_btn').each(function(a) {
      $(this).removeClass('active')
    });
  });
  
  $('.passport_btn .container').on('click', function() {
    $('.nid_btn').each(function(a) {
      $(this).removeClass('active')
    });
  });
  $('.passport_btn .container').on('click', function() {
    $('.driving_licnse_btn').each(function(a) {
      $(this).removeClass('active')
    });
  });
  
  $('.driving_licnse_btn .container').on('click', function() {
    $('.nid_btn').each(function(a) {
      $(this).removeClass('active')
    });
  });
  $('.driving_licnse_btn .container').on('click', function() {
    $('.passport_btn').each(function(a) {
      $(this).removeClass('active')
    });
  });
  
  /*--------------------------------
  connect wallet page js
  --------------------------------*/
  var btnContainer = $("#ChooseNetworkBtns");
  
  // Get all buttons with class="btn" inside the container
  var btns = $(".choose_net_button");
  
  // Loop through the buttons and add the active class to the current/clicked button
  for (var i = 0; i < btns.length; i++) {
    btns[i].addEventListener("click", function() {
      var current = document.getElementsByClassName("active");
      current[0].className = current[0].className.replace(" active", "");
      this.className += " active";
    });
  }
  
  /*-------------------------
  Project details js
  -------------------------*/
  $('.project-summary-tab-btn1').on('click', function() {
    $('.project-summary-tab-btn1').each(function(a) {
      $(this).addClass('active')
    });
  });
  $('.project-summary-tab-btn1').on('click', function() {
    $('.project-summary-tab-btn2, .project-summary-tab-btn3, .project-summary-tab-btn4, .project-summary-tab-btn5, .project-summary-tab-btn6, .project-summary-tab-btn7').each(function(a) {
      $(this).removeClass('active')
    });
  });
  $('.project-summary-tab-btn2').on('click', function() {
    $('.project-summary-tab-btn2').each(function(a) {
      $(this).addClass('active')
    });
  });
  $('.project-summary-tab-btn2').on('click', function() {
    $('.project-summary-tab-btn1, .project-summary-tab-btn3, .project-summary-tab-btn4, .project-summary-tab-btn5, .project-summary-tab-btn6, .project-summary-tab-btn7').each(function(a) {
      $(this).removeClass('active')
    });
  });
  $('.project-summary-tab-btn3').on('click', function() {
    $('.project-summary-tab-btn3').each(function(a) {
      $(this).addClass('active')
    });
  });
  $('.project-summary-tab-btn3').on('click', function() {
    $('.project-summary-tab-btn1, .project-summary-tab-btn2, .project-summary-tab-btn4, .project-summary-tab-btn5, .project-summary-tab-btn6, .project-summary-tab-btn7').each(function(a) {
      $(this).removeClass('active')
    });
  });
  $('.project-summary-tab-btn4').on('click', function() {
    $('.project-summary-tab-btn4').each(function(a) {
      $(this).addClass('active')
    });
  });
  $('.project-summary-tab-btn4').on('click', function() {
    $('.project-summary-tab-btn1, .project-summary-tab-btn2, .project-summary-tab-btn3, .project-summary-tab-btn5, .project-summary-tab-btn6, .project-summary-tab-btn7').each(function(a) {
      $(this).removeClass('active')
    });
  });
  $('.project-summary-tab-btn5').on('click', function() {
    $('.project-summary-tab-btn5').each(function(a) {
      $(this).addClass('active')
    });
  });
  $('.project-summary-tab-btn5').on('click', function() {
    $('.project-summary-tab-btn1, .project-summary-tab-btn2, .project-summary-tab-btn3, .project-summary-tab-btn4, .project-summary-tab-btn6, .project-summary-tab-btn7').each(function(a) {
      $(this).removeClass('active')
    });
  });
  $('.project-summary-tab-btn6').on('click', function() {
    $('.project-summary-tab-btn6').each(function(a) {
      $(this).addClass('active')
    });
  });
  $('.project-summary-tab-btn6').on('click', function() {
    $('.project-summary-tab-btn1, .project-summary-tab-btn2, .project-summary-tab-btn3, .project-summary-tab-btn4, .project-summary-tab-btn5, .project-summary-tab-btn7').each(function(a) {
      $(this).removeClass('active')
    });
  });
  $('.project-summary-tab-btn7').on('click', function() {
    $('.project-summary-tab-btn7').each(function(a) {
      $(this).addClass('active')
    });
  });
  $('.project-summary-tab-btn7').on('click', function() {
    $('.project-summary-tab-btn1, .project-summary-tab-btn2, .project-summary-tab-btn3, .project-summary-tab-btn4, .project-summary-tab-btn5, .project-summary-tab-btn6').each(function(a) {
      $(this).removeClass('active')
    });
  });
  
  /*-------------------------
  stacking card flip js
  -------------------------*/
  $('.flip_card_btn').on('click', function() {
    $(this).parents('.staking_flip_card').addClass('active');
  });
  
  $('.staking_flip_card_close_btn').on('click',function() {
    $(this).parents('.staking_flip_card').removeClass('active');
  });
  
  
  /*---------------------------
  governance page Progress line
  ---------------------------*/
  var progress = document.querySelectorAll('.progress-done');
  
  Array.from(progress).forEach(function(item){
    item.style.width = item.getAttribute('data-percent') + '%';
    item.style.opacity = 1;
  });



  // check if wallet is already connected

  window.onload = () =>{
    // checkAccountIsConnected();
  }

  const checkAccountIsConnected = async () =>{
    if(isMetaMaskInstalled()){
      const activeAccounts = await isAccountConnected();
      if( activeAccounts.length !== 0 ){
        $('.connect-btn-wrapper').html(`
          <button type="button" class="connect-btn readon white-btn hover-shape">
              <img src="assets/images/icons/connect.png" alt="Icon"> 
              <span class="btn-text">${activeAccounts[0].substr(0, 10)}</span>
              <span class="hover-shape1"></span>
              <span class="hover-shape2"></span>
              <span class="hover-shape3"></span>
          </button>
        `);
      }
    }
  }

  
  //connect meta
  $('.connect-meta').on('click', async function(){
    if(isMetaMaskInstalled()){
      const activeAccounts = await connectWallet();
      if( activeAccounts.length !== 0 ){
        $('#exampleModal').modal('hide');
        $('body').removeClass('modal-open');
        $('.modal-backdrop').remove();
        $('.connect-btn-wrapper').html(`
          <button type="button" class="connect-btn readon white-btn hover-shape">
              <img src="assets/images/icons/connect.png" alt="Icon"> 
              <span class="btn-text">${activeAccounts[0].substr(0, 10)}</span>
              <span class="hover-shape1"></span>
              <span class="hover-shape2"></span>
              <span class="hover-shape3"></span>
          </button>
        `);
      }
    }else{
      $('#exampleModal').modal('hide');
      $('body').removeClass('modal-open');
      $('.modal-backdrop').remove();
      $('#download-metamask').modal('show');
    }
  });
  
})(jQuery);