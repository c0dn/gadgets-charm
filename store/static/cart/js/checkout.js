function tohome() {
  cartUpdate(function() {
    setTimeout(function() {
      window.location.href = "/"
    }, 200)
  })
}
$(document).ready(function () {
  if ($(".ui-entry").find("div").length == 0) {
    $(".ui-entry").css("height", "150px");
    $(".ui-entry").append("<span>Your cart is empty</span>");
    $(".ui-entry > span").css("color", "red");
    $(".ui-entry > span").css("font-weight", "600");
    $(".ui-entry > span").css("margin", "auto");
    $(".checkout-next").prop("disabled", true);
  }
  $(".minus-btn").click(function() {
    var item_id = +this.parentElement.parentElement.children[0].value;
    var c_q = +this.parentElement.querySelector("span").textContent;
    var c_p = parseFloat(this.parentElement.parentElement.children[5].textContent.slice(1));
    for (x in json_item.items) {
      if (json_item.items[x].id == item_id) {
        var price = parseFloat(json_item.items[x].price);
      }
    }
    var new_q = c_q - 1;
    var min_fail = false;
    if (new_q <= 0) {
      min_fail = true;
    }
    if (!min_fail) {
      var c_total_p = parseFloat(document.querySelector(".ui-title > span").textContent.slice(8));
      c_total_p -= price
      document.querySelector(".ui-title > span").textContent = "Total: $"+c_total_p.toFixed(2);
      this.parentElement.querySelector("span").textContent = new_q;
      var new_p = c_p - price;
      this.parentElement.parentElement.children[5].textContent = "$"+new_p.toFixed(2);
      var counter = 0;
      for (y in cart_data_UPDATE.items) {
        if (cart_data_UPDATE.items[y].id == item_id) {
          var u_q = +cart_data_UPDATE.items[y].quantity;
          u_q -= 1;
          cart_data_UPDATE.items[y].quantity = u_q.toString();
        } else {
          counter += 1;
        }
      }
      if (counter == cart_data_UPDATE.items.length) {
        var item_dict = {
          "id": item_id.toString(),
          "quantity": new_q.toString()
        }
        cart_data_UPDATE.items.push(item_dict);
      }
    }
  });
  $(".plus-btn").click(function() {
    var item_id = +this.parentElement.parentElement.children[0].value;
    var c_q = +this.parentElement.querySelector("span").textContent;
    var c_p = parseFloat(this.parentElement.parentElement.children[5].textContent.slice(1));
    for (x in json_item.items) {
      if (json_item.items[x].id == item_id) {
        var price = parseFloat(json_item.items[x].price);
        var max_q = +json_item.items[x].max;
      }
    }
    var new_q = c_q + 1;
    var max_fail = false;
    if (new_q > max_q) {
      max_fail = true;
    }
    if (!max_fail) {
      var c_total_p = parseFloat(document.querySelector(".ui-title > span").textContent.slice(8));
      c_total_p += price
      document.querySelector(".ui-title > span").textContent = "Total: $" + c_total_p.toFixed(2);
      this.parentElement.querySelector("span").textContent = new_q;
      var new_p = c_p + price;
      this.parentElement.parentElement.children[5].textContent = "$" + new_p.toFixed(2);
      var counter = 0;
      for (y in cart_data_UPDATE.items) {
        if (cart_data_UPDATE.items[y].id == item_id) {
          var u_q = +cart_data_UPDATE.items[y].quantity;
          u_q += 1;
          cart_data_UPDATE.items[y].quantity = u_q.toString();
        } else {
          counter += 1;
        }
      }
      if (counter == cart_data_UPDATE.items.length) {
        var item_dict = {
          "id": item_id.toString(),
          "quantity": new_q.toString()
        }
        cart_data_UPDATE.items.push(item_dict);
      }
    }
  });
  $(".delete-btn-ui").click(function() {
    var c_total = parseFloat(this.parentElement.parentElement.parentElement.querySelector(".ui-title > span").textContent.slice(8));
    var item_p = parseFloat(this.parentElement.querySelector("div.total-price").textContent.slice(1));
    var new_p = c_total - item_p;
    this.parentElement.parentElement.parentElement.querySelector(".ui-title > span").textContent = "Total: $"+new_p.toFixed(2);
    var child_ele = this.parentElement;
    var parent_ele = this.parentElement.parentElement;
    var item_id = this.parentElement.children[0].value;
    parent_ele.removeChild(child_ele);
    var item_dict = {
      "id": item_id
    }
    cart_data_DESTROY.items.push(item_dict);
    if ($(".ui-entry").find("div").length == 0) {
      $(".ui-entry").css("height", "150px");
      $(".ui-entry").append("<span>Your cart is empty</span>");
      $(".ui-entry > span").css("color", "red");
      $(".ui-entry > span").css("font-weight", "600");
      $(".ui-entry > span").css("margin", "auto");
      $(".checkout-next").prop("disabled", true);
    }
  });
  $(".checkout-next").click(function() {
    var stripe_data = {
      "items": []
    }
    $(".ui-entry").find("div.entry").each(function () {
      var c_id = this.children[0].value;
      var c_q = this.children[4].children[1].textContent;
      var item_dict = {
        "id": c_id,
        "quantity": c_q
      };
      stripe_data.items.push(item_dict);
    });
    $.ajax({
      type: "POST",
      url: "/checkout/charge/",
      data: JSON.stringify(stripe_data),
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      success: function(data) {
        cartUpdate(function() {
          var stripe_input = $("<input>");
          stripe_input.attr("type", "hidden");
          stripe_input.attr("class", "stripe-session");
          stripe_input.attr("value", data.id);
          $(".ui-payment").append(stripe_input);
          $(".ui-entry").css("display", "none");
          $(".ui-address").css("display", "none");
          $(".ui-payment").css("display", "block");
        })
      }
    });
  });
  $(".checkout-pay-stripe").click(function() {
    var stripe_pub = document.querySelector(".ui-payment > input.stripe-pub").value
    var session_id = document.querySelector(".ui-payment > input.stripe-session").value;
    var stripe = Stripe(stripe_pub);
    $.ajax({
      type: "POST",
      url: "/api/cart/clear/",
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      success: function (data) {
        stripe.redirectToCheckout({
          sessionId: session_id
        }).then(function (result) {
          console.log(result.error.message);
        });
      }
    });
  });
});