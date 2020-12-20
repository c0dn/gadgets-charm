$(document).ready(function () {
  $(".item-row").click(function() {
    window.location = $(this).find("a").attr("href");
  });
  if ($(".search-content").children("div").length == 0) {
    $(".search-content").css("background-color", "white");
    var err_msg = $('<span class="message">').text("No results found");
    $(".search-content").append(err_msg);
  }
});