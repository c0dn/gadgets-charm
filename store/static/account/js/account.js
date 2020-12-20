$(document).ready(function(){
  $(".security-settings").css("display", "none");
  $(".Address-settings").css("display", "none");
  $(".security-link").click(function(e){
    e.preventDefault();
    $(".security-settings").css("display", "block");
    $(".profile-settings").css("display", "none");
    $(".Address-settings").css("display", "none");
  });
  $(".profile-link").click(function(e) {
    e.preventDefault();
    $(".profile-settings").css("display", "block");
    $(".Address-settings").css("display", "none");
    $(".security-settings").css("display", "none");
  });
  $(".Address-link").click(function(e) {
    e.preventDefault();
    $(".profile-settings").css("display", "none");
    $(".Address-settings").css("display", "block");
    $(".security-settings").css("display", "none");
  });
  $(".address-get-btn").click(function() {
    function showPosition(position) {
      var data_obj = {
        "lat": position.coords.latitude,
        "lng": position.coords.longitude
      }
      $.ajax({
        type: "POST",
        url: "/api/location/",
        data: JSON.stringify(data_obj),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function(data){
          var size = data.results[0].address_components.length;
          var address1 = data.results[0].address_components[1]["short_name"] + " "+ data.results[0].address_components[2]["long_name"];
          var address2 = data.results[0].address_components[size-size]["short_name"];
          var zip_code = data.results[0].address_components[size-1]["long_name"];
          var country = data.results[0].address_components[size-2]["long_name"];
          $("input[name='street_address1']").attr("value", address1);
          $("input[name='street_address2']").attr("value", address2);
          $("input[name='Zip_code']").attr("value", zip_code);
          $("input[name='city']").attr("value", country);
          $("input[name='state']").attr("value", country);
        },
        failure: function() {
          window.alert("Failed to get location")
        }
      });
    }
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
    } else {
      window.alert("Unable to get your location. Make sure you allowed website to access your location.");
    }
  });
  $(".profile-modal").click(function(event) {
    if( $(event.target).is($(".profile-modal")) ) {
      $(".profile-modal").css("display", "none");
    }
  });
  var form = $(".image-form");
  form.on('drag dragstart dragend dragover dragenter dragleave drop', function(e) {
    e.preventDefault();
    e.stopPropagation();
  })
  .on("dragover dragenter", function() {
    $(".dropzone").addClass("hover");
  })
  .on("dragleave dragend drop", function() {
    $(".dropzone").removeClass("hover");
  })
  .on("drop", function(e) {
    ($(".image-input"))[0].files = e.originalEvent.dataTransfer.files;
    form.submit();
  });
});
function imagemodal() {
  $(".profile-modal").css("display", "block");
}