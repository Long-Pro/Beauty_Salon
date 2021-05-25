module.exports.deleteAllOrder = function (req, res, next) {
    let quantity = req.query.quantity;
    console.log(req.query);
    var d = new Date().getTime();
    console.log(d);
    d -= parseInt(quantity, 10) * 60 * 60;
    console.log(d, "-------------------");
    let kq = 0;
  
    sql
      .connect(config)
      .then(() => {
        //   validate tai khoan
        return sql.query`  select * from dattruoc where TRANGTHAI=0`;
      })
      .then((result) => {
        async function xoaDT() {
          let dt = result.recordset;
          for (let item of dt) {
            let t = new Date(item.THOIGIAN + ":00Z");
            console.log(t.getTime());
            if (t.getTime() <= d) {
              kq++;
              let myPromise = new Promise(function (myResolve, myReject) {
                sql
                  .connect(config)
                  .then(() => {
                    return sql.query`UPDATE DATTRUOC SET TRANGTHAI=1 WHERE MA=${item.MA}`;
                  })
                  .then((result) => {
                    myResolve();
                  });
              });
              await myPromise;
            }
          }
          res.cookie("succStaff", [`Hủy ${kq} hóa đơn đặt trước thành công`], {
            maxAge: 1000,
          });
          res.redirect("/staff/work/dt");
          // res.send('123')
        }
        xoaDT();
      })
      .catch((err) => {
        console.log("err " + err);
      });
  };