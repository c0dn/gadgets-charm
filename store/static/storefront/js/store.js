var cart_data_UPDATE = {
  "type": "UPDATE",
  "items": []
};
var cart_data_CREATE = {
  "type": "CREATE",
  "items": []
};
function addCartData(id, quantity=1, stat=1) {
  if (json_cart == null) {
    Swal.fire({
      title: "Not logged in",
      text: "Please login or register an account",
      type: "error",
    });
  }
  var item_list = json_cart.items;
  var check_count = 0;
  for (x in item_list) {
    if (item_list[x].id == id) {
      var delete_dat = cart_data_DESTROY.items;
      var in_del = false;
      var counter = 0;
      for (y in delete_dat) {
        if (delete_dat[y].id == item_list[x].id) {
          in_del = true;
          cart_data_DESTROY.items.splice(counter, 1);
        } else {
          counter += 1;
        }
      }
      if (!in_del) {
        var item_data = item_list[x];
        var x_quantity = item_data.quantity;
        var x_max = item_data.max_quantity;
        x_quantity += quantity;
        var max_fail = false;
        if (x_quantity > x_max) {
          x_quantity = x_max;
          max_fail = true;
        }
        console.log("Update, cart");
        var item_dict = {
          "id": id.toString(),
          "quantity": x_quantity.toString()
        };
        cart_data_UPDATE.items.push(item_dict);
        return max_fail
      } else {
        for (x in json_item.items) {
          if (json_item.items[x].id == id) {
            var x_max = json_item.items[x].max;
          }
        }
        var max_fail = false;
        if (quantity > x_max) {
          quantity = x_max;
          max_fail = true;
        }
        console.log("Update, Create");
        var item_dict = {
          "id": id.toString(),
          "quantity": quantity.toString()
        };
        cart_data_UPDATE.items.push(item_dict);
        console.log(cart_data_UPDATE);
        return max_fail;
      }
    } else {
      check_count += 1;
    }
  }
  if (check_count == item_list.length) {
    var create_dat = cart_data_CREATE.items;
    var check2_count = 0;
    for (x in create_dat) {
      if (create_dat[x].id == id) {
        var item_data = create_dat[x];
        console.log("Update, create dat");
        var x_quantity = parseInt(item_data.quantity);
        for (y in json_item.items) {
          if (json_item.items[y].id == id)
            var x_max = parseInt(json_item.items[y].max);
        }
        console.log("max: "+x_max);
        console.log(x_quantity);
        x_quantity += quantity;
        console.log("after: "+x_quantity)
        var max_fail = false;
        if (x_quantity > x_max) {
          console.log("nani?");
          x_quantity = x_max
          max_fail = true;
        }
        cart_data_CREATE.items[x].quantity = x_quantity;
        console.log(cart_data_CREATE);
        return max_fail;
      } else
        check2_count += 1;
    }
    if (check2_count == create_dat.length) {
      for (x in json_item.items) {
        if (json_item.items[x].id == id) {
          var x_max = json_item.items[x].max;
        }
      }
      var max_fail = false;
      if (quantity > x_max) {
        quantity = x_max;
        max_fail = true;
      }
      console.log("Create");
      var item_dict = {
        "id": id.toString(),
        "quantity": quantity.toString()
      };
      cart_data_CREATE.items.push(item_dict);
      console.log(cart_data_CREATE);
      return max_fail
    }
  }
}