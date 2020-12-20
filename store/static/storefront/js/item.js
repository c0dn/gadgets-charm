function Updateside(id, q) {
  c_q += q;
  for (y in json_item.items) {
    if (json_item.items[y].id == id) {
      var max_q = +json_item.items[y].max;
    }
  }
  if (json_cart != null) {
    for (x in json_cart.items) {
      if (json_cart.items[x].id == id) {
        max_q -= +json_cart.items[x].quantity;
      }
    }
  }
  max_q -= c_q;
  var max_span = $(".max-quantity");
  var stock = true;
  if (max_q == 0) {
    stock = false;
    max_span.text("Out of Stock");
    max_span.css("color", "red");
    max_span.css("font-weight", "bold");
  } else if (max_q > 10) {
    max_span.text("In stock");
    max_span.css("color", "green");
  } else if (max_q > 5) {
    max_span.text("Limited amount left!");
    max_span.css("color", "darkorange");
  } else {
    max_span.text("Only " + max_q + " in stock right now!");
    max_span.css("color", "red")
  }
  if (stock) {
    var select_div = $(".select-option");
    select_div.empty();
    var select_span = $("<span>").text("Qty:");
    select_div.append(select_span);
    var select_ele = $('<select name="qty"></select>');
    for (var i = 1; i <= max_q; i++) {
      if (i > 10) {
        break
      } else {
        var option_ele = $('<option>' + i + "</option>");
        select_ele.append(option_ele);
      }
    }
    select_div.append(select_ele);
  } else {
    var select_div = $(".select-option")
    select_div.empty();
    $(".cart-buttons").css("display", "none");
  }
}
$(document).ready(function () {
  function detectSwipe(id, func) {
    const swipe_det = {
      sX: 0,
      sY: 0,
      eX: 0,
      eY: 0
    };
    // Directions
    const directions = Object.freeze({
      UP: "u",
      DOWN: "d",
      RIGHT: "r",
      LEFT: "l"
    });
    const deltaMin = 90;
    let direction = null;
    const el = document.getElementById(id);
    el.addEventListener("touchstart", function (e) {
      const t = e.touches[0]
      swipe_det.sX = t.screenX
      swipe_det.sY = t.screenY
    }, false);
    el.addEventListener("touchmove", function (e) {
      const t = e.touches[0]
      swipe_det.eX = t.screenX
      swipe_det.eY = t.screenY
    }, false);
    el.addEventListener("touchend", function (e) {
      if (swipe_det.eX != 0) {
        const deltaX = swipe_det.eX - swipe_det.sX;
        const deltaY = swipe_det.eY - swipe_det.sY;
        // Min swipe distance
        if (deltaX ** 2 + deltaY ** 2 < deltaMin ** 2) return
        // horizontal
        if (deltaY === 0 || Math.abs(deltaX / deltaY) > 1)
          direction = deltaX > 0 ? directions.RIGHT : directions.LEFT
        else // vertical
          direction = deltaY > 0 ? directions.UP : directions.DOWN
        if (direction && typeof func === "function") func(id, direction)
        direction = null
        swipe_det.eX = 0
        swipe_det.eY = 0
      }
    }, false);
  }
  function changeImage(el, d) {
    if (slideMax != 1) {
      if (d == "l") {
        if (slideIndex == slideMax) {
          $(".gallery-slide").eq(slideIndex - 1).fadeOut("fast", function () {
            $(".dot").eq(slideIndex - 1).removeClass("active");
            slideIndex = 1;
            $(".dot").eq(0).addClass("active");
            $(".gallery-slide").eq(0).fadeIn("fast");
          })
        } else {
          $(".gallery-slide").eq(slideIndex - 1).fadeOut("fast", function () {
            $(".dot").eq(slideIndex - 1).removeClass("active");
            slideIndex += 1;
            $(".dot").eq(slideIndex - 1).addClass("active");
            $(".gallery-slide").eq(slideIndex - 1).fadeIn("fast");
          });
        }
      } else if (d == "r") {
        if (slideIndex == 1) {
          $(".gallery-slide").eq(slideIndex - 1).fadeOut("fast", function () {
            $(".dot").eq(slideMax - 1).addClass("active");
            $(".dot").eq(slideIndex - 1).removeClass("active");
            $(".gallery-slide").eq(slideMax - 1).fadeIn("fast");
            slideIndex = slideMax;
          })
        } else {
          $(".gallery-slide").eq(slideIndex - 1).fadeOut("fast", function() {
            $(".dot").eq(slideIndex - 1).removeClass("active");
            slideIndex -= 1;
            $(".dot").eq(slideIndex - 1).addClass("active");
            $(".gallery-slide").eq(slideIndex - 1).fadeIn("fast");
          });
        }
      }
    }
  }
  c_q = 0;
  var slideIndex = 1;
  var slideMax = $(".gallery-slide").length;
  $(".gallery-slide").eq(slideIndex - 1).css("display", "block");
  $(".dot").eq(slideIndex - 1).addClass("active");
  if ($(".gallery-slide").length == 1) {
    $(".prev, .next").css("display", "none");
  }
  $(".prev").click(function (e) {
    e.preventDefault();
    if (slideIndex == 1) {
      $(".gallery-slide").eq(slideIndex - 1).fadeOut("fast", function () {
        $(".dot").eq(slideIndex - 1).removeClass("active");
        $(".dot").eq(slideMax - 1).addClass("active");
        $(".gallery-slide").eq(slideMax - 1).fadeIn("fast", function () {
          slideIndex = slideMax;
        });
      });
    } else {
      $(".gallery-slide").eq(slideIndex - 1).fadeOut("fast", function () {
        $(".dot").eq(slideIndex - 1).removeClass("active");
        slideIndex -= 1;
        $(".dot").eq(slideIndex - 1).addClass("active");
        $(".gallery-slide").eq(slideIndex - 1).fadeIn("fast")
      });
    }
  });
  $(".next").click(function (e) {
    e.preventDefault();
    if (slideIndex == slideMax) {
      $(".gallery-slide").eq(slideIndex - 1).fadeOut("fast", function () {
        $(".dot").eq(0).addClass("active");
        $(".dot").eq(slideIndex - 1).removeClass("active");
        $(".gallery-slide").eq(0).fadeIn(function () {
          slideIndex = 1;
        });
      });
    } else {
      $(".gallery-slide").eq(slideIndex - 1).fadeOut("fast", function () {
        $(".dot").eq(slideIndex - 1).removeClass("active");
        slideIndex += 1;
        $(".dot").eq(slideIndex - 1).addClass("active");
        $(".gallery-slide").eq(slideIndex - 1).fadeIn();
      });
    }
  });
  $(".img1-dot").click(function () {
    $(".gallery-slide").eq(slideIndex - 1).css("display", "none");
    $(".dot").eq(slideIndex - 1).removeClass("active");
    $(".gallery-slide").eq(0).css("display", "block");
    $(".dot").eq(0).addClass("active");
    slideIndex = 1;
  });
  $(".img2-dot").click(function () {
    $(".gallery-slide").eq(slideIndex - 1).css("display", "none");
    $(".dot").eq(slideIndex - 1).removeClass("active");
    $(".gallery-slide").eq(1).css("display", "block");
    $(".dot").eq(1).addClass("active");
    slideIndex = 2;
  });
  $(".img3-dot").click(function () {
    $(".gallery-slide").eq(slideIndex - 1).css("display", "none");
    $(".dot").eq(slideIndex - 1).removeClass("active");
    $(".gallery-slide").eq(2).css("display", "block");
    $(".dot").eq(2).addClass("active");
    slideIndex = 3;
  });
  $(".img4-dot").click(function () {
    $(".gallery-slide").eq(slideIndex - 1).css("display", "none");
    $(".dot").eq(slideIndex - 1).removeClass("active");
    $(".gallery-slide").eq(3).css("display", "block");
    $(".dot").eq(3).addClass("active");
    slideIndex = 4;
  });
  $(".shipping-table-toggle").click(function (e) {
    e.preventDefault();
    $(".shipping-model").css("display", "flex");
  });
  $(".shipping-model").click(function (e) {
    if ($(e.target).is($(".shipping-model"))) {
      $(".shipping-model").css("display", "none");
    }
  });
  $(".close-shipping").click(function () {
    $(".shipping-model").css("display", "none");
  });
  $(".add-cart-btn").click(function () {
    var product_id = $(this).attr("value");
    var quantity = parseInt($(".select-option").find("select")[0].value);
    addCartData(product_id, quantity);
    Swal.fire({
      title: "Thank You",
      text: "Item added to cart",
      type: "success",
    }).then(
      Updateside(product_id, quantity)
    )
  });
  $(".cart-item").click(function(e) {
    e.preventDefault();
    cartUpdate(function () {
      setTimeout(function() {
        window.location.href = "/checkout/"
      }, 300)
    });
  })
  $(".buy-btn").click(function () {
    var product_id = $(this).attr("value");
    var quantity = parseInt($(".select-option").find("select")[0].value);
    addCartData(product_id, quantity);
    cartUpdate(function () {
      setTimeout(function() {
        window.location.href = "/checkout/";
      }, 300)
    })
  })
  setTimeout(function() {
    var item_id = $(".buy-btn").attr("value");
    for (y in json_item.items) {
      if (json_item.items[y].id == item_id) {
        var max_q = +json_item.items[y].max;
      }
    }
    if (json_cart != null) {
      for (x in json_cart.items) {
        if (json_cart.items[x].id == item_id) {
          max_q -= +json_cart.items[x].quantity;
        }
      }
    }
    var max_span = $(".max-quantity");
    var stock = true;
    if (max_q == 0) {
      stock = false;
      max_span.text("Out of Stock");
      max_span.css("color", "red");
      max_span.css("font-weight", "bold");
    } else if (max_q > 10) {
      max_span.text("In stock");
      max_span.css("color", "green");
    } else if (max_q > 5) {
      max_span.text("Limited amount left!");
      max_span.css("color", "darkorange");
    } else {
      max_span.text("Only "+max_q+" in stock right now!");
      max_span.css("color", "red")
    }
    if (stock) {
      var select_div = $(".select-option");
      var select_ele = $('<select name="qty"></select>');
      for (var i = 1; i <= max_q; i++) {
        if (i > 10) {
          break
        } else {
          var option_ele = $('<option>'+i+"</option>");
          select_ele.append(option_ele);
        }
      }
      select_div.append(select_ele);
    } else {
      var select_span = $(".select-option").find("span")[0];
      select_span.style.display = "none";
      $(".cart-buttons").css("display", "none");
    }
  }, 600);
  detectSwipe("swipe-gallery", changeImage);
});