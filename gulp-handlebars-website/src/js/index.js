$( document ).ready(function() {

  $('#carouselHeader').carousel({
    interval: 7000
  });

  $('#carouselMain').slick({
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 7000,
    prevArrow:'<a class="carousel-control-prev" role="button" data-slide="prev"><span class="carousel-control-prev-icon" aria-hidden="true"></span><span class="sr-only">Previous</span></a>',
    nextArrow:'<a class="carousel-control-next" role="button" data-slide="next"><span class="carousel-control-next-icon" aria-hidden="true"></span><span class="sr-only">Next</span></a>'
  });

  /*  EXPANDING AND CONTRACTING CARDS */
  $('a.btn-expand').on("click", function(e){
    e.preventDefault();

    var $this = $(this),
        $parent = $this.closest('.card');

    $parent.addClass('expand');

  });

  $('a.btn-close').on("click", function(e){
    e.preventDefault();

    var $this = $(this),
        $parent = $this.closest('.card');

    $parent.removeClass('expand');

  });

});

