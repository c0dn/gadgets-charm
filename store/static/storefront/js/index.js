$(document).ready(function() {
  $(".item-card").click(function(){
    window.location = $(this).find("a").attr("href");
  });
  $(".cat-child").click(function() {
    window.location = $(this).find("a").attr("href");
  })
  $(".search-form").addClass("blur");
  $(".search-mobile").on("focus", function () {
    if (!$(".search-form").hasClass("active")) {
      $(".search-form").addClass("active");
      $(".search-form").removeClass("blur");
    }
  });
  $(".search-mobile").on("blur", function () {
    if ($(".search-form").hasClass("active")) {
      $(".search-form").removeClass("active");
      $(".search-form").addClass("blur");
    }
  });
  $(window).scroll(function () {
    var $height = $(window).scrollTop();
    if ($height > 50) {
      $(".mobile-index").addClass("active");
      $(".search-form").addClass("active");
      $(".search-form").removeClass("blur");
    } else {
      $(".mobile-index").removeClass("active");
      $(".search-form").addClass("blur");
      $(".search-form").removeClass("active");
    }
  });
  var slideIndex = 0;
  slideshow();
  function slideshow() {
    var slideMax = $(".img-slides").length;
    for (var i = 0; i < slideMax; i++) {
      $(".img-slides").eq(i).css("display", "none");
    }
    slideIndex++;
    if (slideIndex > slideMax)
      slideIndex = 1;
    $(".img-slides").eq(slideIndex - 1).fadeIn("fast", function() {
      setTimeout(slideshow, 5000);
    });
  }
});