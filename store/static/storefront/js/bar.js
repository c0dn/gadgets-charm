function gotoProduct(id){
  window.location.href = "/item/"+id;
}
var cart_data_DESTROY = {
  "type": "DELETE",
  "items": []
};
function removeItem(id, ele) {
  var item_dict = {
    "id": id,
  };
  cart_data_DESTROY.items.push(item_dict);
  var child = ele.parentElement;
  ele.parentElement.parentElement.removeChild(child);
  for (x in json_item.items) {
    if (json_item.items[x].id == id) {
      var quantity = parseInt(child.childNodes[4].textContent.slice(2));
      var unit_price = parseFloat(json_item.items[x].price);
      var total_price = parseFloat($(".total-cart").text().slice(1));
      var new_price = total_price - (unit_price * quantity);
      $(".total-cart").text("$" + new_price.toFixed(2));
    }
  }
  var total_c = +$(".CartCount").text();
  total_c -= quantity;
  $(".CartCount").text(total_c);
  if (!e) var e = window.event;
  e.cancelBubble = true;
  if (e.stopPropagation) e.stopPropagation();
}
function cartUpdate(callback) {
  try {
    var delete_data = cart_data_DESTROY;
    if (delete_data.items.length == 0) {
      delete_data = null;
    }
  } catch(e) {
    if (e.name == "ReferenceError")
      var delete_data = null;
  }
  try {
    var create_data = cart_data_CREATE;
    if (create_data.items.length == 0) {
      create_data = null;
    }
  } catch(e) {
    if (e.name == "ReferenceError")
      var create_data = null;
  }
  try {
    var update_data = cart_data_UPDATE;
    if (update_data.items.length == 0) {
      update_data = null;
    }
  } catch(e) {
    if (e.name == "ReferenceError")
      var update_data = null;
  }
  if (delete_data == null) {
    if (create_data != null) {
      console.log(create_data);
      navigator.sendBeacon("/api/cart/", JSON.stringify(create_data));
      cart_data_CREATE = {
        "type": "CREATE",
        "items": []
      };
    }
    if (update_data != null) {
      navigator.sendBeacon("/api/cart/", JSON.stringify(update_data));
      console.log(update_data);
      cart_data_UPDATE = {
        "type": "UPDATE",
        "items": []
      };
    }
  } else {
    var delete_ids = [];
    for (x in delete_data.items) 
      delete_ids.push(delete_data.items[x].id);
    if (create_data != null) {
      var create_ids = [];
      for (x in create_data.items)
        create_ids.push(create_data.items[x].id);
    } else
      var create_ids = null;
    if (update_data != null) {
      var update_ids = [];
      for (x in update_data.items)
        update_ids.push(update_data.items[x].id);
    } else
      var update_ids = null;
    if (update_ids != null) {
      for (x in update_ids) {
        for (y in delete_ids) {
          if (delete_ids[y] == update_ids[x]) {
            var counter = 0;
            for (z in cart_data_UPDATE.items) {
              if (cart_data_UPDATE.items[z].id == delete_ids[y]) {
                cart_data_UPDATE.items.splice(counter, 1);
                cart_data_DESTROY.items.splice(counter, 1)
                break
              } else
                counter += 1;
            }
          }
        }
      }
      if (cart_data_UPDATE.items.length != 0) {
        navigator.sendBeacon("/api/cart/", JSON.stringify(cart_data_UPDATE));
        console.log("cart_data_UPDATE"+cart_data_UPDATE);
        cart_data_UPDATE = {
          "type": "UPDATE",
          "items": []
        };
      }
    }
    if (create_ids != null) {
      for (x in create_ids) {
        for (y in delete_ids) {
          if (delete_ids[y] == create_ids[x]) {
            var counter = 0;
            for (z in cart_data_CREATE.items) {
              if (cart_data_CREATE.items[z].id == delete_ids[y]) {
                cart_data_CREATE.items.splice(counter, 1);
                cart_data_DESTROY.items.splice(counter, 1)
                break
              } else
                counter += 1;
            }
          }
        }
      }
      if (cart_data_CREATE.items.length != 0) {
        console.log("cart_data_CREATE"+cart_data_CREATE);
        navigator.sendBeacon("/api/cart/", JSON.stringify(cart_data_CREATE));
        cart_data_CREATE = {
          "type": "CREATE",
          "items": []
        };
      }
    }
    if (cart_data_DESTROY.items.length != 0) {
      console.log(cart_data_DESTROY)
      navigator.sendBeacon("/api/cart/", JSON.stringify(cart_data_DESTROY));
      cart_data_DESTROY = {
        "type": "DELETE",
        "items": []
      };
    }
  }
  if (typeof callback != "object") {
    callback()
  }
}
$(document).ready(function() {
  $(".cart-btn").click(function() {
    if ($(".cart-container").hasClass("active")) {
      $(".cart-container").removeClass("active");
    } else {
      $(".cart-container").addClass("active");
    }
    });
  $(".account-dropdown").click(function() {
    if ($(".account-content").hasClass("account-content-shown")) {
      $(".account-content").removeClass("account-content-shown");
    } else {
      $(".account-content").addClass("account-content-shown");
    }
  });
  $(document).click(function() {
    $(".account-content").removeClass("account-content-shown");
  });
  $(".check-btn").click(function() {
    if (json_cart == null) {
      Swal.fire({
        title: "Not logged in",
        text: "Please login or register an account",
        type: "error",
      });
    } else {
      cartUpdate(function() {
        setTimeout(function() {
          window.location.href = "/checkout/"
        }, 500)
      })
    }
  });
  $.ajax({
    type: "GET",
    url: "/api/cart/",
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    success: function(data){
      json_cart = data;
      var item_list = json_cart.items;
      var cart_count = 0;
      if (item_list.length == 0) {
        $(".CartCount").text("0");
      } else {
        for (x in item_list) {
          cart_count += item_list[x].quantity;
          var cart_img_div = $('<div class="item-img"></div>');
          var cart_img = cart_img_div.append($("<img>").attr('src', item_list[x].img));
          var cart_item = $('<span class="item-name"></span>').text(item_list[x].item);
          var cart_price = $('<span class="item-price"></span>').text("$"+item_list[x].unit_price);
          var onclick_delete = "removeItem("+item_list[x].id+", this)";
          var delete_item_span = $('<span class="item-delete"></span>').attr("onclick", onclick_delete);
          var delete_item = delete_item_span.html("&times;");
          var cart_quantity = $('<span class="item-quantity">').text("x "+item_list[x].quantity);
          var onlick_func = "gotoProduct("+item_list[x].id+")";
          var div = $('<div />', {
            onclick: onlick_func,
          });
          var item = div.append(cart_img, cart_item, cart_price, delete_item, cart_quantity);
          $(".shopping-cart-items").append(item);
        }
        $(".CartCount").text(cart_count);
      }
      $(".total-cart").text("$"+json_cart.Total);
    }
  })
  .fail (function() {
    $(".CartCount").text("0");
    $(".total-cart").text("$0");
    json_cart = null;
  });
  $.ajax({
    type: "GET",
    url: "/api/item/",
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    success: function(data){
      json_item = data;
    }
  });
  window.addEventListener("beforeunload", cartUpdate);
  window.addEventListener("visibilitychange", cartUpdate);
});