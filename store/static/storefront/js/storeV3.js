var cart_data_UPDATE = {
  "type": "UPDATE",
  "items": []
};
var cart_data_CREATE = {
  "type": "CREATE",
  "items": []
};
function addCartData(id, quantity=1, stat=1){
  if (json_cart == null) {
    if($(".account-content").hasClass("account-content-shown"))
      $(".account-content").removeClass("account-content-shown");
  }
  var item_list = json_cart.items;
  var check_count = 0;
  for (x in item_list) {
    if (item_list[x].id == id) {
      var x_id = item_list[x].id;
      var x_quantity = parseInt(item_list[x].quantity);
      if (stat == 1) {
        x_quantity += quantity;
        for (y in json_item.items) {
          if (json_item.items[y].id == id) {
            var y_price = parseFloat(json_item.items[y].price);
            var total_price = parseFloat($(".total-cart").text().slice(1));
            var total_c = +$(".CartCount").text();
            var max_q = parseInt(json_item.items[y].max);
            if (x_quantity > max_q) {
              var max_fail = true;
              item_list[x].quantity = max_q;
            } else {
              var max_fail = false;
              item_list[x].quantity = x_quantity;
              total_c += quantity;
              $(".CartCount").text(total_c);
              var new_price = total_price + (y_price * quantity);
              $(".total-cart").text("$" + new_price);
              console.log("first");
            }
            if (!max_fail) {
              var cart_count = $(".shopping-cart-items").children().length;
              if (cart_count != 0) {
                var li_counter = 1;
                for (var i = 0; i < cart_count; i++) {
                  var li_ele = $(".shopping-cart-items").children()[i];
                  if (li_ele.children[1].textContent == json_item.items[y].item) {
                    var item_quantity = parseInt(li_ele.children[4].textContent.slice(2));
                    item_quantity += quantity;
                    li_ele.children[4].textContent = "x " + item_quantity.toString();
                  } else
                    li_counter += 1;
                }
                if (li_counter != cart_count) {
                  var item_data = json_item.items[y];
                  var cart_img_div = $('<div class="item-img"></div>');
                  var cart_img = cart_img_div.append($("<img>").attr('src', item_data.img1));
                  var cart_item = $('<span class="item-name"></span>').text(item_data.item);
                  var cart_price = $('<span class="item-price"></span>').text("$" + item_data.price);
                  var onclick_delete = "removeItem(" + item_data.id + ", this)";
                  var delete_item_span = $('<span class="item-delete"></span>').attr("onclick", onclick_delete);
                  var delete_item = delete_item_span.html("&times;");
                  var cart_quantity = $('<span class="item-quantity">').text("x " + quantity.toString());
                  var onlick_func = "gotoProduct(" + item_data.id + ")";
                  var div = $('<div />', {
                    onclick: onlick_func,
                  });
                  var item = div.append(cart_img, cart_item, cart_price, delete_item, cart_quantity);
                  $(".shopping-cart-items").append(item);
                }
              } else {
                var item_data = json_item.items[y];
                var cart_img_div = $('<div class="item-img"></div>');
                var cart_img = cart_img_div.append($("<img>").attr('src', item_data.img1));
                var cart_item = $('<span class="item-name"></span>').text(item_data.item);
                var cart_price = $('<span class="item-price"></span>').text("$" + item_data.price);
                var onclick_delete = "removeItem(" + item_data.id + ", this)";
                var delete_item_span = $('<span class="item-delete"></span>').attr("onclick", onclick_delete);
                var delete_item = delete_item_span.html("&times;");
                var cart_quantity = $('<span class="item-quantity">').text("x " + quantity.toString());
                var onlick_func = "gotoProduct(" + item_data.id + ")";
                var div = $('<div />', {
                  onclick: onlick_func,
                });
                var item = div.append(cart_img, cart_item, cart_price, delete_item, cart_quantity);
                $(".shopping-cart-items").append(item);
              }
            }
          }
        }
      } else {
        x_quantity -= quantity;
        if (x_quantity <= 0) {
          var q_valid = false;
          item_list[x].quantity = 1;
        } else {
          var q_valid = true;
          var total_c = +$(".CartCount").text();
          total_c -= quantity;
          $(".CartCount").text(total_c);
        }
        if (q_valid) {
          for (y in json_item.items) {
            if (json_item.items[y].id == id) {
              var y_price = parseFloat(json_item.items[y].price);
              var total_price = parseFloat($(".total-cart").text().slice(1));
              var new_price = total_price - (y_price * quantity);
              $(".total-cart").text("$"+new_price);
              for (var i = 0; i < $(".shopping-cart-items").children().length; i++) {
                var li_ele = $(".shopping-cart-items").children()[i];
                if (li_ele.children[1].textContent == json_item.items[y].item) {
                  var item_quantity = parseInt(li_ele.children[4].textContent.slice(2));
                  item_quantity -= quantity;
                  li_ele.children[4].textContent = "x " + item_quantity.toString();
                }
              }
            }
          }
        }
      }
      if (q_valid || !max_fail) {
        var item_dict = {
          "id": x_id,
          "quantity": x_quantity.toString()
        }
        cart_data_UPDATE.items.push(item_dict);
      }
    } else {
      check_count += 1;
    }
  }
  if (check_count == item_list.length) {
    var check2_count = 0;
    for (z in json_item.items) {
      if (json_item.items[z].id == id) {
        var max_q = parseInt(json_item.items[z].max);
      }
    }
    var create_dat = cart_data_CREATE.items;
    var delete_dat = cart_data_DESTROY.items;
    var del_counter = 0;
    for (v in delete_dat) {
      if (delete_dat[v].id == id) {
        var in_del = true;
      } else {
        del_counter += 1;
      }
    }
    if (del_counter == delete_dat.length)
      var in_del = false;
    for (y in create_dat) {
      if (create_dat[y].id == id) {
        var y_quantity = parseInt(create_dat[y].quantity);
        y_quantity += quantity;
        if (y_quantity > max_q) {
          y_quantity = max_q
          var max2_fail = true;
        } else
          var max2_fail = false;
        create_dat[y].quantity = y_quantity.toString();
        for (i in json_item.items) {
          if (json_item.items[i].id == id) {
            console.log("second:" + max2_fail);
            if (!max2_fail) {
              var total_c = +$(".CartCount").text();
              total_c += quantity;
              $(".CartCount").text(total_c);
              var item_data = json_item.items[i];
              var total_price = parseFloat($(".total-cart").text().slice(1));
              var new_price = total_price + (parseFloat(item_data.price) * quantity);
              $(".total-cart").text("$" + new_price);
              console.log("second");
              for (var i = 0; i < $(".shopping-cart-items").children().length; i++) {
                var li_ele = $(".shopping-cart-items").children()[i];
                if (li_ele.children[1].textContent == item_data.item) {
                  var item_quantity = parseInt(li_ele.children[4].textContent.slice(2));
                  item_quantity += quantity;
                  li_ele.children[4].textContent = "x " + item_quantity.toString();
                }
              }
            }
          }
        }
      } else {
        check2_count += 1;
      }
    }
    if (check2_count == create_dat.length) {
      if (y_quantity > max_q) {
        y_quantity = max_q
        var max2_fail = true;
      } else
        var max2_fail = false;
      console.log("third:" + max2_fail);
      if (!max2_fail) {
        var item_dict = {
        "id": id,
        "quantity": quantity.toString()
        };
        cart_data_CREATE.items.push(item_dict);
        console.log(cart_data_CREATE)
        for (y in json_item.items) {
          if (json_item.items[y].id == id) {
            if (!max2_fail) {
              var total_c = +$(".CartCount").text();
              total_c += quantity;
              $(".CartCount").text(total_c);
              var item_data = json_item.items[y];
              var total_price = parseFloat($(".total-cart").text().slice(1));
              var new_price = total_price + (parseFloat(item_data.price) * quantity);
              $(".total-cart").text("$" + new_price);
              console.log("3rd")
              var cart_img_div = $('<div class="item-img"></div>');
              var cart_img = cart_img_div.append($("<img>").attr('src', item_data.img1));
              var cart_item = $('<span class="item-name"></span>').text(item_data.item);
              var cart_price = $('<span class="item-price"></span>').text("$" + item_data.price);
              var onclick_delete = "removeItem(" + item_data.id + ", this)";
              var delete_item_span = $('<span class="item-delete"></span>').attr("onclick", onclick_delete);
              var delete_item = delete_item_span.html("&times;");
              var cart_quantity = $('<span class="item-quantity">').text("x "+quantity.toString());
              var onlick_func = "gotoProduct(" + item_data.id + ")";
              var div = $('<div />', {
                onclick: onlick_func,
              });
              var item = div.append(cart_img, cart_item, cart_price, delete_item, cart_quantity);
              $(".shopping-cart-items").append(item);
            }
          }
        }
      }
    }
  }
}