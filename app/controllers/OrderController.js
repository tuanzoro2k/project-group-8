const e = require("express");
const db = require("../../config/db/database");
const Cart = require("../models/Cart");

class OrderController {
  createOrder(req, res, next) {
    const sess = req.session.userID;
    if (typeof sess === "undefined") {
      console.log("login");
      res.redirect("/account/login");
    } else {
      db.connection.query(
        "Select * from Ordered where UserID = ? and OrderState = 'Processing'",
        [sess.id],
        function (error, done) {
          if (error) console.log(error);
          else {
            if (done.length == 0) {
              var countOrdered = 0;
              db.connection.query(
                "Select * from Ordered",
                function (err, results) {
                  if (err) console.log(err);
                  countOrdered = results.length;
                  countOrdered++;
                  db.connection.query(
                    "Insert into Ordered (OrderID, OrderState, UserID) values(?, ?, ?)",
                    ["OR#" + countOrdered, "Processing", sess.id],
                    function (error) {
                      if (error) console.log(error);
                    }
                  );
                }
              );
            }
          }
        }
      );
      setTimeout(function () {
        next();
      }, 100);
    }
  }
  fillInfoPage(req, res) {
    const sess = req.session.userID;
    db.connection.query(
      "Select Products.ProductName, Products.Color, Products.Price, Products.Material, Products.thumbnail_photo,NumProduct from Product_Cart, Products where Product_Cart.ProductID = Products.ProductID",
      function (error, rows) {
        if (error) console.log(error);
        else {
          if (typeof sess === "undefined") {
            console.log("login");
            res.redirect("/account/login");
          } else {
            var subTotal = 0;
            for (let i = 0; i < rows.length; i++) {
              subTotal += rows[i].NumProduct * rows[i].Price;
            }
            res.render("information", { rows: rows, subTotal: subTotal });
          }
        }
      }
    );
  }
  fillShippingPage(req, res) {
    const sess = req.session.userID;
    db.connection.query(
      "Select Products.ProductName, Products.Color, Products.Price, Products.Material, Products.thumbnail_photo,NumProduct from Product_Cart, Products where Product_Cart.ProductID = Products.ProductID",
      function (error, rows) {
        if (error) console.log(error);
        else {
          if (typeof sess === "undefined") {
            console.log("login");
            res.redirect("/account/login");
          } else {
            var subTotal = 0;
            for (let i = 0; i < rows.length; i++) {
              subTotal += rows[i].NumProduct * rows[i].Price;
            }
            res.render("shipping", { rows: rows, subTotal: subTotal });
          }
        }
      }
    );
  }
  fillPaymentPage(req, res) {
    const sess = req.session.userID;
    db.connection.query(
      "Select Products.ProductName, Products.Color, Products.Price, Products.Material, Products.thumbnail_photo,NumProduct from Product_Cart, Products where Product_Cart.ProductID = Products.ProductID",
      function (error, rows) {
        if (error) console.log(error);
        else {
          if (typeof sess === "undefined") {
            console.log("login");
            res.redirect("/account/login");
          } else {
            var subTotal = 0;
            for (let i = 0; i < rows.length; i++) {
              subTotal += rows[i].NumProduct * rows[i].Price;
            }
            res.render("payment", { rows: rows, subTotal: subTotal });
          }
        }
      }
    );
  }
  completeOrder(req, res) {
    const sess = req.session.userID;
    var addr = req.body.addr;
    var city = req.body.city;
    var today = new Date();
    var date =
      today.getFullYear() +
      "-" +
      (today.getMonth() + 1) +
      "-" +
      today.getDate();
    var time =
      today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date + " " + time;
    addr = addr + ", " + city;
    Cart.getProductOrdered(sess.cartid, function (err, rows) {
      if (err) console.log(err);
      else {
        var countOrdered = 0;
        db.connection.query("Select * from Ordered", function (err, results) {
          if (err) console.log(err);
          console.log(results.length);

          countOrdered = results.length;
          console.log({ countOrdered });

          db.connection.query(
            "Update Ordered set OrderContact = ? where OrderID = ?",
            [req.body.contact, "OR#" + countOrdered]
          );
          db.connection.query(
            "Update Ordered set OrderShippingAddr = ? where OrderID = ?",
            [addr, "OR#" + countOrdered]
          );
          db.connection.query(
            "Update Ordered set OrderAddrDetail = ? where OrderID = ?",
            [req.body.addrDetail, "OR#" + countOrdered]
          );
          db.connection.query(
            "Update Ordered set OrderDate = ? where OrderID = ?",
            [dateTime, "OR#" + countOrdered]
          );
          db.connection.query(
            "Update Ordered set ShippingMethod = ? where OrderID = ?",
            [req.body.shipMeth, "OR#" + countOrdered]
          );
          db.connection.query(
            "Update Ordered set PaymenMethod = ? where OrderID = ?",
            [req.body.payMeth, "OR#" + countOrdered]
          );
          db.connection.query(
            "Update Ordered set TotalCost = ? where OrderID = ?",
            [req.body.totalCost, "OR#" + countOrdered]
          );
          db.connection.query(
            "Update Ordered set OrderState = ? where OrderID = ? and OrderState = ?",
            ["Complete", "OR#" + countOrdered, "Processing"],
            function (error) {
              if (error) console.log(error);
            }
          );
          for (let i = 0; i < rows.length; i++) {
            db.connection.query(
              "Insert into OrderItem values (?, ?, ?)",
              ["OR#" + countOrdered, rows[i].ProductID, rows[i].NumProduct],
              function (error) {
                if (error) console.log(error);
              }
            );
          }

          console.log("countOrdered", countOrdered);

          let orderID = "OR#" + countOrdered;
          res.json({ orderID: orderID });
        });
      }
    });
  }
  showSuccessfulPayment(req, res) {
    const extraData = req.query.extraData;
    let buff = new Buffer(extraData, "base64");
    const obj = JSON.parse(buff.toString());

    // const orderID = "OR#10";
    const orderID = obj.orderID;

    db.connection.query(
      "Select * from Ordered, OrderItem, Products where Ordered.OrderID = OrderItem.OrderID and OrderItem.ProductID = Products.ProductID and Ordered.OrderID = ?",
      [orderID],
      function (err, results) {
        if (err) console.log(err);
        else {
          var subTotal = 0;
          for (let i = 0; i < results.length; i++) {
            subTotal += results[i].Quantity * results[i].Price;
          }
          res.render("successful-payment", {
            rows: results,
            subTotal: subTotal,
          });
        }
      }
    );
  }
}

module.exports = new OrderController();
