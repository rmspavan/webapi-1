var express = require("express");
var router = express.Router();
var async = require("async");
var db = require("../dbconfig");
var date = require("../utilities/date");
var stripe = require("stripe")(
  "sk_test_51HlsuKBGhy6l8fry2VRnt2s609CMbpNQpmEBlek6pBxBfXt7uu2OnTapjyGJGUDYVmwiZI2JVRmGdAKzLKf4vTdi00CBKROdXd"
);
const createError = require("http-errors");
const { strict: assert } = require('assert');
var nodemailer = require('nodemailer');
const { lookupService } = require("dns");

/* GET home page. */
router.get("/users", async function (req, res, next) {
  var query = "SELECT * FROM users;";
  var data = await db.query(query);
  // res.send(JSON.stringify(data))
  res.json(data["rows"]);
  // res.render('index', { title: JSON.stringify(data.rows, null, 2) });
});

/* GET bonus */
router.get("/bonus", async function (req, res, next) {
  var query = "SELECT * FROM bonus;";
  var data = await db.query(query);
  res.json(data["rows"]);
});

/* Create bonus */
router.post("/bonus/add", async function (req, res) {
  var day_1 = req.body.day_1;
  var day_2 = req.body.day_2;
  var day_3 = req.body.day_3;
  var day_4 = req.body.day_4;
  var day_5 = req.body.day_5;
  var day_6 = req.body.day_6;
  var day_7 = req.body.day_7;
  var created_date = new Date();

  var data = {
    error: 1,
    bonus: "",
  };

  if (!!created_date) {
    var insert =
      "INSERT INTO bonus(id,day_1,day_2,day_3,day_4,day_5,day_6,day_7,created_date) Values (uuid(), ?,?,?,?,?,?,?,?);";
    var params = [
      day_1,
      day_2,
      day_3,
      day_4,
      day_5,
      day_6,
      day_7,
      created_date,
    ];
    console.log(params);
    var postResponse = db
      .post(insert, params)
      .then(function () {
        console.log("Promise Resolved");
      })
      .catch(function (err) {
        console.log(err);
        console.log("Promise Rejected");
      });
    console.log(postResponse);
    if (postResponse) {
      data["error"] = 0;
      data["bonus"] = "bonus created Successfully";
    }
    res.json(data);
  } else {
    data["bonus"] = "Please provide all required data";
    res.json(data);
  }
});

/* Update bonus */
router.put("/bonus/update/:id", async function (req, res) {
  var id = req.params.id;
  var day_1 = req.body.day_1;
  var day_2 = req.body.day_2;
  var day_3 = req.body.day_3;
  var day_4 = req.body.day_4;
  var day_5 = req.body.day_5;
  var day_6 = req.body.day_6;
  var day_7 = req.body.day_7;
  var modified_date = new Date();

  var data = {
    error: 1,
    bonus: "",
  };

  if (!!id) {
    var insert =
      "UPDATE bonus SET day_1=?,day_2=?,day_3=?,day_4=?,day_5=?,day_6=?,day_7=?,modified_date=? WHERE id=?;";
    var params = [
      day_1,
      day_2,
      day_3,
      day_4,
      day_5,
      day_6,
      day_7,
      modified_date,
      id,
    ];
    console.log(params);
    var postResponse = db
      .post(insert, params)
      .then(function () {
        console.log("Promise Resolved");
      })
      .catch(function (err) {
        console.log(err);
        console.log("Promise Rejected");
      });
    console.log(postResponse);
    if (postResponse) {
      data["error"] = 0;
      data["bonus"] = "bonus updated Successfully";
    }
    res.json(data);
  } else {
    data["bonus"] = "Please provide all required data";
    res.json(data);
  }
});

/* GET gifts */
router.get("/gifts", async function (req, res, next) {
  // var query = "SELECT name,value,status,icon,gif_img,created_date,added_by,type,conversion_rate,remarks,modified_date FROM gifts;";
  var query = "SELECT * FROM gifts;"
  var data = await db.query(query);
  res.json(data["rows"]);
});

/* GET gifts by ID */
router.get("/gifts/:id", async function (req, res, next) {
  var id = req.params.id;
  var query = "SELECT * FROM gifts WHERE id=?;";
  var params = [id];
  var data = await db.post(query, params);
  res.json(data["rows"]);
});

/* Create gifts */
router.post("/gifts/add", async function (req, res) {
  var name = req.body.name;
  var value = req.body.value;
  var status = req.body.status;
  var icon = req.body.icon;
  var gif_img = req.body.gif_img;
  var added_by = req.body.added_by;
  var type = req.body.type;
  var conversion_rate = req.body.conversion_rate;
  var remarks = req.body.remarks;
  var created_date = new Date();

  var data = {
    error: 1,
    gifts: "",
  };

  if (!!created_date) {
    var insert =
      "INSERT INTO gifts(id,name,value,status,icon,gif_img,created_date, added_by,type, conversion_rate,remarks) Values (uuid(), ?,?,?,?,?,?,?,?,?,?);";
    var params = [
      name,
      value,
      status,
      icon,
      gif_img,
      created_date,
      added_by,
      type,
      conversion_rate,
      remarks,
    ];
    console.log(params);
    var postResponse = db
      .post(insert, params)
      .then(function () {
        console.log("Promise Resolved");
      })
      .catch(function (err) {
        console.log(err);
        console.log("Promise Rejected");
      });
    console.log(postResponse);
    if (postResponse) {
      data["error"] = 0;
      data["gift"] = "gift created Successfully";
    }
    res.json(data);
  } else {
    data["gift"] = "Please provide all required data";
    res.json(data);
  }
});

/* Update gift */
router.put("/gifts/update/:id", async function (req, res) {
  var id = req.params.id;
  var name = req.body.name;
  var value = req.body.value;
  var status = req.body.status;
  var icon = req.body.icon;
  var gif_img = req.body.gif_image;
  var added_by = req.body.added_by;
  var type = req.body.type;
  var conversion_rate = req.body.conversion_rate;
  var remarks = req.body.remarks;
  var modified_date = new Date();

  var data = {
    error: 1,
    bonus: "",
  };

  if (!!id) {
    var insert =
      "UPDATE gifts SET name=?,value=?,status=?,icon=?,gif_img=?,modified_date=?, added_by=?,type=?, conversion_rate=?,remarks=? WHERE id=?;";
    var params = [
      name,
      value,
      status,
      icon,
      gif_img,
      modified_date,
      added_by,
      type,
      conversion_rate,
      remarks,
      id,
    ];
    console.log(params);
    var postResponse = db
      .post(insert, params)
      .then(function () {
        console.log("Promise Resolved");
      })
      .catch(function (err) {
        console.log(err);
        console.log("Promise Rejected");
      });
    console.log(postResponse);
    if (postResponse) {
      data["error"] = 0;
      data["gift"] = "gift updated Successfully";
    }
    res.json(data);
  } else {
    data["gift"] = "Please provide all required data";
    res.json(data);
  }
});

/* all gifts_icons in one place*/
router.get("/gifts", async function (req, res, next) {
  //var id = req.params.id
  //var data = await db.post(query, params);
  var query = "SELECT * FROM gifts_icon;"
  //var query = "SELECT * FROM gifts_icon WHERE userid=?,giftid;";
 //var data = await db.query(query);
  var data = await db.post(query);
  res.json(data["rows"]);
});
/* all gifts_icons_user crown in one place*/
router.get("/user_crown/:id", async function (req, res, next) {
  var query = "SELECT * FROM user WHERE id=?;";
  var data = await db.post(query);
  res.json(data["rows"]);
});
/* GET crown_to_pearl */
router.get("/crown_to_pearl", async function (req, res, next) {
  var query = "SELECT * FROM crown_to_pearl;";
  var data = await db.query(query);
  res.json(data["rows"]);
});

/* GET crown_to_pearl by ID */
router.get("/crown_to_pearl/:id", async function (req, res, next) {
  var id = req.params.id;
  var query = "SELECT * FROM crown_to_pearl WHERE id=?;";
  var params = [id];
  var data = await db.post(query, params);
  res.json(data["rows"]);
});

/* Create crown_to_pearl */
router.post("/crown_to_pearl/add", async function (req, res) {
  var crown_type = req.body.crown_type;
  var conversion_rate = req.body.conversion_rate;
  var status = req.body.status;
  var description = req.body.description;
  var created_date = new Date();

  var data = {
    error: 1,
    crown_to_pearl: "",
  };

  if (!!created_date) {
    var insert =
      "INSERT INTO crown_to_pearl(id,crown_type,conversion_rate,status,description,created_date) Values (uuid(),?,?,?,?,?);";
    var params = [
      crown_type,
      conversion_rate,
      status,
      description,
      created_date,
    ];
    console.log(params);
    var postResponse = db
      .post(insert, params)
      .then(function () {
        console.log("Promise Resolved");
      })
      .catch(function (err) {
        console.log(err);
        console.log("Promise Rejected");
      });
    console.log(postResponse);
    if (postResponse) {
      data["error"] = 0;
      data["crown_to_pearl"] = "crown_to_pearl created Successfully";
    }
    res.json(data);
  } else {
    data["crown_to_pearl"] = "Please provide all required data";
    res.json(data);
  }
});

/* upadate crown_to_pearl */
router.put("/crown_to_pearl/update/:id", async function (req, res) {
  var id = req.params.id;
  var crown_type = req.body.crown_type;
  var conversion_rate = req.body.conversion_rate;
  var status = req.body.status;
  var description = req.body.description;
  var modified_date = new Date();

  var data = {
    error: 1,
    bonus: "",
  };

  if (!!id) {
    var insert =
      "UPDATE crown_to_pearl SET crown_type=?,conversion_rate=?,status=?,description=?,modified_date=? WHERE id=?;";
    var params = [
      crown_type,
      conversion_rate,
      status,
      description,
      modified_date,
      id,
    ];
    console.log(params);
    var postResponse = db
      .post(insert, params)
      .then(function () {
        console.log("Promise Resolved");
      })
      .catch(function (err) {
        console.log(err);
        console.log("Promise Rejected");
      });
    console.log(postResponse);
    if (postResponse) {
      data["error"] = 0;
      data["crown_to_pearl"] = "crown_to_pearl updated Successfully";
    }
    res.json(data);
  } else {
    data["crown_to_pearl"] = "crown_to_pearl provide all required data";
    res.json(data);
  }
});

/* GET earning_setup */
router.get("/earning_setup", async function (req, res, next) {
  var query = "SELECT * FROM earning_setup;";
  var data = await db.query(query);
  res.json(data["rows"]);
});

/* GET earning_setup by ID */
router.get("/earning_setup/:id", async function (req, res, next) {
  var id = req.params.id;
  var query = "SELECT * FROM earning_setup WHERE id=?;";
  var params = [id];
  var data = await db.post(query, params);
  res.json(data["rows"]);
});

/* Create earning_setup */
router.post("/earning_setup/add", async function (req, res) {
  var user_id = req.body.user_id;
  var stream_id = req.body.stream_id;
  var status = req.body.status;
  var total_pearls = req.body.total_pearls;
  var example_select = req.body.example_select;
  var created_date = new Date();

  var data = {
    error: 1,
    earning_setup: "",
  };

  if (!!created_date) {
    var insert =
      "INSERT INTO earning_setup(id,user_id,stream_id,status,total_pearls,example_select,created_date) Values (uuid(),?,?,?,?,?,?);";
    var params = [
      user_id,
      stream_id,
      status,
      total_pearls,
      example_select,
      created_date,
    ];
    console.log(params);
    var postResponse = db
      .post(insert, params)
      .then(function () {
        console.log("Promise Resolved");
      })
      .catch(function (err) {
        console.log(err);
        console.log("Promise Rejected");
      });
    console.log(postResponse);
    if (postResponse) {
      data["error"] = 0;
      data["earning_setup"] = "earning_setup created Successfully";
    }
    res.json(data);
  } else {
    data["earning_setup"] = "Please provide all required data";
    res.json(data);
  }
});

/* upadate earning_setup */
router.put("/earning_setup/update/:id", async function (req, res) {
  var id = req.params.id;
  var user_id = req.body.user_id;
  var stream_id = req.body.stream_id;
  var status = req.body.status;
  var total_pearls = req.body.total_pearls;
  var example_select = req.body.example_select;
  var modified_date = new Date();

  var data = {
    error: 1,
    bonus: "",
  };

  if (!!id) {
    var insert =
      "UPDATE earning_setup SET user_id=?,stream_id=?,status=?,total_pearls=?,example_select=?,modified_date=? WHERE id=?;";
    var params = [
      user_id,
      stream_id,
      status,
      total_pearls,
      example_select,
      modified_date,
      id,
    ];
    console.log(params);
    var postResponse = db
      .post(insert, params)
      .then(function () {
        console.log("Promise Resolved");
      })
      .catch(function (err) {
        console.log(err);
        console.log("Promise Rejected");
      });
    console.log(postResponse);
    if (postResponse) {
      data["error"] = 0;
      data["earning_setup"] = "earning_setup updated Successfully";
    }
    res.json(data);
  } else {
    data["earning_setup"] = "earning_setup provide all required data";
    res.json(data);
  }
});

/* GET notification */
router.get("/notification", async function (req, res, next) {
  var query = "SELECT * FROM notification;";
  var data = await db.query(query);
  res.json(data["rows"]);
});

/* GET notification by ID */
router.get("/notification/:id", async function (req, res, next) {
  var id = req.params.id;
  var query = "SELECT * FROM notification WHERE id=?;";
  var params = [id];
  var data = await db.post(query, params);
  res.json(data["rows"]);
});

/* Create notification */
router.post("/notification/add", async function (req, res) {
  var subject = req.body.subject;
  var type = req.body.type;
  var status = req.body.status;
  var description = req.body.description;
  var expiry_date_time = req.body.expiry_date_time;
  var created_date = new Date();

  var data = {
    error: 1,
    notification: "",
  };

  if (!!created_date) {
    var insert =
      "INSERT INTO notification(id,subject,type,status,description,expiry_date_time,created_date) Values (uuid(),?,?,?,?,?,?);";
    var params = [
      subject,
      type,
      status,
      description,
      expiry_date_time,
      created_date,
    ];
    console.log(params);
    var postResponse = db
      .post(insert, params)
      .then(function () {
        console.log("Promise Resolved");
      })
      .catch(function (err) {
        console.log(err);
        console.log("Promise Rejected");
      });
    console.log(postResponse);
    if (postResponse) {
      data["error"] = 0;
      data["notification"] = "notification created Successfully";
    }
    res.json(data);
  } else {
    data["notification"] = "Please provide all required data";
    res.json(data);
  }
});

/* upadate notification */
router.put("/notification/update/:id", async function (req, res) {
  var id = req.params.id;
  var subject = req.body.subject;
  var type = req.body.type;
  var status = req.body.status;
  var description = req.body.description;
  var expiry_date_time = req.body.expiry_date_time;
  var updated_date = new Date();

  var data = {
    error: 1,
    bonus: "",
  };

  if (!!id) {
    var insert =
      "UPDATE notification SET subject=?,type=?,status=?,description=?,expiry_date_time=?,updated_date=? WHERE id=?;";
    var params = [
      subject,
      type,
      status,
      description,
      expiry_date_time,
      updated_date,
      id,
    ];
    console.log(params);
    var postResponse = db
      .post(insert, params)
      .then(function () {
        console.log("Promise Resolved");
      })
      .catch(function (err) {
        console.log(err);
        console.log("Promise Rejected");
      });
    console.log(postResponse);
    if (postResponse) {
      data["error"] = 0;
      data["notification"] = "notification updated Successfully";
    }
    res.json(data);
  } else {
    data["notification"] = "notification provide all required data";
    res.json(data);
  }
});

/* GET announcement */
router.get("/announcement", async function (req, res, next) {
  var query = "SELECT * FROM announcement;";
  var data = await db.query(query);
  res.json(data["rows"]);
});

/* GET announcement by ID */
router.get("/announcement/:id", async function (req, res, next) {
  var id = req.params.id;
  var query = "SELECT * FROM announcement WHERE id=?;";
  var params = [id];
  var data = await db.post(query, params);
  res.json(data["rows"]);
});

/* Create announcement */
router.post("/announcement/add", async function (req, res) {
  var category = req.body.category;
  var subject = req.body.subject;
  var type = req.body.type;
  var status = req.body.status;
  var description = req.body.description;
  var image = req.body.image;
  var expiry_date_time = req.body.expiry_date_time
    ? req.body.expiry_date_time
    : null;
  var created_date = new Date();

  var data = {
    error: 1,
    announcement: "",
  };

  if (!!created_date) {
    var insert =
      "INSERT INTO announcement(id,subject,category,type,status,description,expiry_date_time,image,created_date) Values (uuid(),?,?,?,?,?,?,?,?);";
    var params = [
      subject,
      category,
      type,
      status,
      description,
      expiry_date_time,
      image,
      created_date,
    ];
    console.log(params);
    var postResponse = db
      .post(insert, params)
      .then(function () {
        console.log("Promise Resolved");
      })
      .catch(function (err) {
        console.log(err);
        console.log("Promise Rejected");
      });
    console.log(postResponse);
    if (postResponse) {
      data["error"] = 0;
      data["announcement"] = "announcement created Successfully";
    }
    res.json(data);
  } else {
    data["announcement"] = "Please provide all required data";
    res.json(data);
  }
});

/* upadate announcement */
router.put("/announcement/update/:id", async function (req, res) {
  var id = req.params.id;
  var category = req.body.category;
  var subject = req.body.subject;
  var type = req.body.type;
  var status = req.body.status;
  var description = req.body.description;
  var image = req.body.image;
  var expiry_date_time = req.body.expiry_date_time
    ? req.body.expiry_date_time
    : null;
  var modified_date = new Date();

  var data = {
    error: 1,
    bonus: "",
  };

  if (!!id) {
    var insert =
      "UPDATE announcement SET subject=?,category=?,type=?,status=?,description=?,expiry_date_time=?,image=?,modified_date=? WHERE id=?;";
    var params = [
      subject,
      category,
      type,
      status,
      description,
      expiry_date_time,
      image,
      modified_date,
      id,
    ];
    console.log(params);
    var postResponse = db
      .post(insert, params)
      .then(function () {
        console.log("Promise Resolved");
      })
      .catch(function (err) {
        console.log(err);
        console.log("Promise Rejected");
      });
    console.log(postResponse);
    if (postResponse) {
      data["error"] = 0;
      data["announcement"] = "announcement updated Successfully";
    }
    res.json(data);
  } else {
    data["announcement"] = "announcement provide all required data";
    res.json(data);
  }
});

/* GET crowns */
router.get("/crowns", async function (req, res, next) {
  var query = "SELECT * FROM crowns;";
  var data = await db.query(query);
  res.json(data["rows"]);
});

/* GET user crowns */
router.post("/user_crowns", async function (req, res, next) {
  console.log("user crowns request", {
    req: req.body,
  });
  const uid = req.body.uid;
  const query = "SELECT * FROM user_crowns WHERE id=?;";
  const params = [uid];
  const data = await db.post(query, params);
  console.log(data);
  res.json(data["rows"]);
});

/* Create crowns */
router.post("/crowns/add", async function (req, res) {
  var crown_id = req.body.crown_id;
  var count = req.body.count;
  var value = req.body.value;
  var status = req.body.status;
  var currency = req.body.currency;
  var created_date = new Date();

  var data = {
    error: 1,
    crowns: "",
  };

  if (!!created_date) {
    var insert =
      "INSERT INTO crowns(id,crown_id,count,status,value,currency,created_date) Values (uuid(),?,?,?,?,?,?);";
    var params = [crown_id, count, status, value, currency, created_date];
    console.log(params);
    var postResponse = db
      .post(insert, params)
      .then(function () {
        console.log("Promise Resolved");
      })
      .catch(function (err) {
        console.log(err);
        console.log("Promise Rejected");
      });
    console.log(postResponse);
    if (postResponse) {
      data["error"] = 0;
      data["crowns"] = "crowns created Successfully";
    }
    res.json(data);
  } else {
    data["crowns"] = "Please provide all required data";
    res.json(data);
  }
});

/* upadate crowns */
router.put("/crowns/update/:id", async function (req, res) {
  var id = req.params.id;
  var crown_id = req.body.crown_id;
  var count = req.body.count;
  var value = req.body.value;
  var status = req.body.status;
  var currency = req.body.currency;
  var modified_date = new Date();

  var data = {
    error: 1,
    bonus: "",
  };

  if (!!id) {
    var insert =
      "UPDATE crowns SET crown_id=?,count=?,status=?,value=?,currency=?,modified_date=? WHERE id=?;";
    var params = [crown_id, count, status, value, currency, modified_date, id];
    console.log(params);
    var postResponse = db
      .post(insert, params)
      .then(function () {
        console.log("Promise Resolved");
      })
      .catch(function (err) {
        console.log(err);
        console.log("Promise Rejected");
      });
    console.log(postResponse);
    if (postResponse) {
      data["error"] = 0;
      data["crowns"] = "crowns updated Successfully";
    }
    res.json(data);
  } else {
    data["crowns"] = "crowns provide all required data";
    res.json(data);
  }
});

/**
 *  Payment integration using stripe
 */

router.post("/api/doPayment", async (req, res) => {
  console.log("payment request", { req: req.body });
  const uid = req.body.uid;
  const newCrowns = req.body.crowns;
  //res.json({ success: "madhu" });
  const chargeObject = {
    amount: parseInt(req.body.amount),
    currency: "usd",
    payment_method: req.body.tokenId,
    payment_method_types: ["card"],
    description: "Test payment New",
  };
  const paymentDetails = {
    amount: req.body.amount,
    tokenId: req.body.tokenId,
    type: "card",
    description: chargeObject.description,
    payment_date: new Date(),
    status: "Success"
  }

  try {
    const intent = await stripe.paymentIntents.create(chargeObject);
    const response = await stripe.paymentIntents.confirm(intent.id);

    // if success response update crowns table for the user
    if (response) {
      const query = "SELECT * FROM user_crowns WHERE id=?;";
      const params = [uid];
      const data = await db.post(query, params);

      const res = data["rows"];
      console.log(res);
      console.log(res[0]);
      console.log(res[0].crowns);
      if (data.rowLength === 1) {
        const updatedCrowns = `${parseInt(res[0].crowns) + parseInt(newCrowns)
          }`;
        const modified_date = new Date();
        console.log(
          "🚀 ~ file: index.js ~ line 849 ~ router.post ~ updatedCrowns",
          updatedCrowns
        );
        const insert =
          "UPDATE user_crowns SET crowns=?,modified_date=? WHERE id=?;";
        const params = [updatedCrowns, modified_date, uid];
        const postResponse = await db.post(insert, params);

        console.log({ postResponse });
        if (postResponse) {
          var query_success =
            "INSERT INTO transactions(id,amount,payment_token,type,description,crowns,payment_date_time,status) Values (?,?,?,?,?,?,?,?);";
          var values = [uid, paymentDetails.amount, paymentDetails.tokenId, paymentDetails.type
            , paymentDetails.description, paymentDetails.newCrowns, modified_date, paymentDetails.status];
          console.log(params);
          var payments = db.post(query_success, values);
          data["error"] = 0;
          data["crowns"] = "user crowns updated Successfully";
        }
        // res.json(data);
      }
    }
    res.json({ success: true });
  } catch (error) {
    paymentDetails.status = "failed";
    const payment_date = new Date();
    var query_failure =
      "INSERT INTO transactions(id,amount,payment_token,type,description,crowns,payment_date_time,status) Values (?,?,?,?,?,?,?,?);";
    var values = [uid, paymentDetails.amount, paymentDetails.tokenId, paymentDetails.type
      , paymentDetails.description, newCrowns, payment_date, paymentDetails.status];
    var payments = db.post(query_failure, values);
    res.json({ success: false });
  }

  // .then((charge) => {
  //   // New charge created. record charge object
  //   res.json(charge);
  // })
  // .catch((err) => {
  //   // charge failed. Alert user that charge failed somehow

  //   switch (err.type) {
  //     case "StripeCardError":
  //       // A declined card error
  //       console.log(err.message); // => e.g. "Your card's expiration year is invalid."
  //       res.json(err.message);
  //       break;
  //     case "StripeInvalidRequestError":
  //       // Invalid parameters were supplied to Stripe's API
  //       console.log(err.message);
  //       res.json(err.message);
  //       break;
  //     case "StripeAPIError":
  //       // An error occurred internally with Stripe's API
  //       console.log(err.message);
  //       res.json(err.message);
  //       break;
  //     case "StripeConnectionError":
  //       // Some kind of error occurred during the HTTPS communication
  //       console.log(err.message);
  //       res.json(err.message);
  //       break;
  //     case "StripeAuthenticationError":
  //       // You probably used an incorrect API key
  //       console.log(err.message);
  //       res.json(err.message);
  //       break;
  //     case "StripeRateLimitError":
  //       // Too many requests hit the API too quickly
  //       console.log(err.message);
  //       res.json(err.message);
  //       break;
  //   }
  // });
});

// User Services

/* GET user details */
router.get("/ratu_user", async function (req, res, next) {
  var query = "SELECT * FROM ratu_user;";
  var data = await db.query(query);
  res.json(data["rows"]);
});

/* GET user by id */
router.get("/ratu_user/:uid", async function (req,res,next) {
  var uid = req.params.uid;
  var query = "SELECT * FROM ratu_user WHERE uid=? ALLOW FILTERING;";
  var params = [uid];
  var data = await db.get(query, params);
  res.json(data["rows"]);

});

// /* Create rtl_user */
// router.post("/rtl_users/validate", async function (req, res) {
//   console.log({ req: req.body });
//   var name = req.body.name;
//   var phone = req.body.phoneNumber;
//   var email = req.body.email;
//   var address = req.body.address;
//   var country = req.body.country;
//   var pswd = req.body.pswd;
//   var age = req.body.age;
//   var location = req.body.location;
//   var user_type = req.body.user_type;
//   var is_agent_refaree = req.body.is_agent_refaree;
//   var agent_code = req.body.agent_code;
//   var modified_by =req.body.modified_by;
//   var profile_pic = req.body.profile_pic;
//   var modified_date = new Date();
//   var created_date = new Date();
//   var status = req.body.status;
//   var created_by = req.body.created_by;
//   // const Uuid = require("cassandra-driver").types.Uuid;
//   // const id = Uuid.random();
//   const uid = req.body.uid;
//   var data = {
//     error: 1,
//   };
//   var query = "";
//   var response = [];

//   if (id) {
//     query = "SELECT * FROM rtl_users WHERE id=? ALLOW FILTERING;";
//     var params = [id];
//     var data = await db.post(query, params);
//     response = data["rows"];
//   }  else {
//     res.json({ error: "Duplicate Entry!!!" });
//   }
//   if (response.length === 0) {
//     var insert =
//   "INSERT INTO rtl_users(id,name,phone,email,address,country,status,profile_pic,modified_date,modified_by,created_date,created_by,age,pswd,agent_code,is_agent_refaree,location,user_type) Values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);";
//     var params = [uid,name,phone,email,address,country,status,profile_pic,modified_date,modified_by,created_date,created_by,age,pswd,agent_code,is_agent_refaree,location,user_type ];
//     console.log(params);
//     var postResponse = db
//       .post(insert, params)
//       .then(function () {
//         console.log("User record created");       
//       })
//       .catch(function (err) {
//         console.log(err);
//         console.log("user creaetion failed");
//       });
//     res.json({ id: uid });
//   } else {
//     res.json({ id: response[0].id });
//   }
// });
/* Create rtl_user */
router.post("/ratu_user/validate", async function (req, res) {
  console.log({ req: req.body });
  var name = req.body.name;
  var phone = req.body.phone;
  var email = req.body.email;
  var address = req.body.address;
  var gender = req.body.gender;
  var country = req.body.country;
  var pswd = req.body.pswd;
  var age = req.body.age;
  var location = req.body.location;
  var user_type = req.body.user_type;
  var is_agent_refaree = req.body.is_agent_refaree;
  var agent_code = req.body.agent_code;
  var modified_by =req.body.modified_by;
  var profile_pic = req.body.profile_pic;
  var modified_date = new Date();
  var created_date = new Date();
  var status = req.body.status;
  var created_by = req.body.created_by;
  var moments = [];
  var likes = [];  
  // var moments = req.body.moments;
  // var likes = req.body.likes;
  // var followers = req.body.followers;
  // var following = req.body.following;
  // var purchased_crowns = req.boby.purchased_crowns;
  // var spent_crowns = req.body.spent_crowns;
  // var received_crowns = req.body.received_crowns;
  const uid = req.body.uid;
  var data = {
    error: 1,
  };
  var query = "";
  var response = [];

  if (uid) {
    query = "SELECT * FROM ratu_user WHERE uid=? ALLOW FILTERING;";
    var params = [uid];
    var data = await db.post(query, params);
    response = data["rows"];
    
  }  else {
    res.json({ error: "Duplicate Entry!!!" });
  }
  if (response.length === 0) {
    var query =
  "INSERT INTO ratu_user(uid,name,phone,email,address,country,status,profile_pic,modified_date,modified_by,created_date,created_by,age,pswd,agent_code,is_agent_refaree,location,user_type,gender) Values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);";
    var params = [uid,name,phone,email,address,country,status,profile_pic,modified_date,modified_by,created_date,created_by,age,pswd,agent_code,is_agent_refaree,location,user_type,gender];
    console.log(query)
    console.log(params);
    var postResponse = db
      .post(query, params)
      .then(function () {
        res.json({ uid: uid });
        console.log("User record created");       
      })
      .catch(function (err) {
        console.log(err);
        console.log("User creaetion failed");
      });    
  } else {
    res.json({ Failed: "Duplicate Entry!!!" });
  }
});



/* upadate rtl_user */

router.post("/ratu_user/update/:uid", async function (req, res) {
  var name = req.body.name;
  var phone = req.body.phone;
  var email = req.body.email;
  var address = req.body.address;
  var country = req.body.country;
  var gender = req.body.gender;
  //var pswd = req.body.pswd;
  var age = req.body.age;
  var location = req.body.location;
  //var user_type = req.body.user_type;
  //var is_agent_refaree = req.body.is_agent_rafaree;
  //var agent_code = req.body.agent_code;
  var modified_by =req.body.modified_by;
  var profile_pic = req.body.profile_pic;
  var modified_date = new Date();
  var created_date = new Date();
  var status = req.body.status;
  var created_by = req.body.created_by;
  var uid = req.params.uid;

  var data = {
    error: 1,
  };
   console.log("UID parameter : ",uid)
  if (!!uid) {
    var query =
      "UPDATE ratu_user SET name=?,phone=?,email=?,address=?,country=?,status=?,profile_pic=?,modified_date=?,modified_by=?,created_date=?,created_by=?,age=?,location=?,gender=? WHERE uid=?";
    var params = [name,phone,email,address,country,status,profile_pic,modified_date,modified_by,created_date,created_by,age,location,gender,uid];
    console.log(params);
    console.log(query);
    const postResponse = await db
      .post(query, params)
      .then(function () {
        res.json({uid:uid});
        console.log("Promise Resolved");
      })
      .catch(function (err) {
        console.log(err);
        console.log("Promise Rejected");
      });
    console.log(postResponse);
    if (postResponse) {
      data["error"] = 0;
      data["ratu_user"] = "user updated Successfully";
    }
    
  } else {
    //res["ratu_user"] = "Please provide all required data";
    res.json({Failed:updated });
  }
});

// /*create likes*/
// const uid = req.body.uid;
// var likes =[];
// var likes_id = new likes_id();
// likes.push(uid);
// console.log(likes);
// var likes_id= ['likes_id,'];
// app.listener

// var data = {
//     error: 1,
//   };
//   var query = "";
//   var response = [];

// if (uid) {
//   query = "SELECT * FROM ratu_user WHERE uid=? ALLOW FILTERING;";
//   var params = [uid];
//   var data = await db.post(query, params);
//   response = data["rows"];
//   }  
//   else {
//   res.json({ error: "Duplicate Entry!!!" });













/* GET transactions by id */
router.get("/transaction_details/:id", async function (req, res, next) {
  var id = req.params.id;
  var query = "SELECT * FROM transactions WHERE id=?;";
  var params = [id];
  var data = await db.post(query, params);
  res.json(data["rows"]);
});

/* Publisher information */

/* get active streamer sessions 
router.get("/activeStreams", async function (req, res, next) {
  var query = "SELECT * FROM publisher WHERE status='ACTIVE' ALLOW FILTERING;";
  var data = await db.query(query);
  res.json(data["rows"]);
}); */

router.post("/session_tokens", async function (req, res) {
  const { session_id, role } = req.body;
  assert(session_id, createError(400, `"session_id" required`));
  assert(["PUBLISHER", "SUBSCRIBER"].some((value) => value === role),
    createError(400, `"role" should be ["PUBLISHER", "SUBSCRIBER"]`)
  )

  const session = await req.ov.createSession({
    customSessionId: session_id
  });

  const connection = await session.createConnection({
    role
  });

  res.json({
    data: {
      session_id,
      token: connection.token,
      role,
    }
  })

})

/* create streamer data */
router.post("/publisher/add", async function (req, res) {
  var id = req.body.id;
  var crowns = req.body.crowns;
  var password = req.body.password;
  var role = 'PUBLISHER';
  var session_type = req.body.session_type;
  var started_at = new Date();
  var status = 'ACTIVE';
  var title = req.body.title;
  var token_id = req.body.token_id;
  var user_name = req.body.user_name;
  var session_data = req.body.session_data;
  var session_id = req.body.session_id;
  var tokenUrl = req.body.tokenUrl;

  var data = {
    error: 1,
  };

  if (!!token_id) {
    var insert =
      "INSERT INTO publisher(id,crowns,password,role,session_type,started_at,status,title,token_id,user_name,session_data,session_id,token_url) Values (?,?,?,?,?,?,?,?,?,?,?,?,?);";
    var params = [id, crowns, password, role, session_type, started_at, status, title, token_id, user_name, session_data, session_id, tokenUrl];
    console.log(params);
    var postResponse = db
      .post(insert, params)
      .then(function () {
        console.log("Promise Resolved");
      })
      .catch(function (err) {
        console.log(err);
        console.log("Promise Rejected");
      });
    console.log(postResponse);
    if (postResponse) {
      data["error"] = 0;
      data["Publisher"] = "Publisher added Successfully";
    }
    res.json(data);
  } else {
    data["Publisher"] = "Please provide all required data";
    res.json(data);
  }
});

/* End stream */
router.put("/publisher/endStream/:id", async function (req, res) {
  var token_id = req.params.id;
  var uid = req.body.uid;
  var earned_crowns = req.body.earned_crowns;
  var ended_at = new Date();
  var status = "INACTIVE"

  var data = {
    error: 1,
  };

  if (!!token_id) {
    var insert =
      "UPDATE publisher SET earned_crowns=?,ended_at=?,status=? WHERE token_id=?;";
    var params = [earned_crowns, ended_at, status, token_id];
    console.log(params);
    var postResponse = db
      .post(insert, params)
      .then(function () {
        console.log("Promise Resolved");
      })
      .catch(function (err) {
        console.log(err);
        console.log("Promise Rejected");
      });
    console.log(postResponse);
    if (postResponse) {
      var query = "SELECT earned_pearls FROM earned_pearls WHERE id=?;";
      var params = [uid];
      var pearlsData = await db.post(query, params);
      var pearls = pearlsData["rows"];
      if (pearls.length === 1 && uid) {
        var existingPearls = pearls[0].earned_pearls;
        var total_pearls = `${parseInt(existingPearls) + parseInt(earned_crowns)}`;
        var pearlsUpdate = "Update earned_pearls SET earned_pearls=?,updated_at=? WHERE id=?;";
        var pearlsParams = [total_pearls, ended_at, uid];
        db.post(pearlsUpdate, pearlsParams);
      } else if (uid) {
        var pearlsInsert = "INSERT INTO earned_pearls(id,earned_pearls,updated_at) Values(?,?,?);";
        var pearlsParams = [uid, earned_crowns, ended_at];
        db.post(pearlsInsert, pearlsParams);
      }
      // var giftSelect = "SELECT user_id,crowns FROM user_gifts WHERE stream_token_id=? ALLOW FILTERING;"
      // var deleteGiftData = "DELETE FROM user_gifts WHERE stream_token_id=?";
      // var deleteGiftParams = [token_id];
      // db.post(deleteGiftData, deleteGiftParams);
      data["error"] = 0;
      data["publisher"] = "stream ended Successfully";
    }
    res.json(data);
  } else {
    data["publisher"] = "please provide all required data";
    res.json(data);
  }
});

/* Subscriber services */

/* Get Subscribers list for a video */

router.get("/subscribers/:id", async function (req, res, next) {
  var id = req.params.id;
  var query = "SELECT * FROM subscriber WHERE stream_token_id=? AND status='ACTIVE' ALLOW FILTERING;";
  var params = [id];
  var data = await db.post(query, params);
  res.json(data["rows"]);
});

router.post("/subscriber/add", async function (req, res) {
  var id = req.body.id;
  var role = 'SUBSCRIBER';
  var created_at = new Date();
  var status = 'ACTIVE';
  var stream_token_id = req.body.stream_token_id;
  var user_name = req.body.user_name;

  var data = {
    error: 1,
  };

  if (!!stream_token_id) {
    var insert =
      "INSERT INTO subscriber(id,role,started_at,status,stream_token_id,user_name) Values (?,?,?,?,?,?);";
    var params = [id, role, created_at, status, stream_token_id, user_name];
    console.log(params);
    var postResponse = db
      .post(insert, params)
      .then(function () {
        console.log("Promise Resolved");
      })
      .catch(function (err) {
        console.log(err);
        console.log("Promise Rejected");
      });
    console.log(postResponse);
    if (postResponse) {
      data["error"] = 0;
      data["Subscriber"] = "Subscriber added Successfully";
    }
    res.json(data);
  } else {
    data["Subscriber"] = "Please provide all required data";
    res.json(data);
  }
});

/* upadate crowns */
router.put("/subscriber/exitStream/:id", async function (req, res) {
  var id = req.params.id;
  var crowns_spent = req.body.crowns_spent;
  var stream_token_id = req.body.stream_token_id
  var ended_at = new Date();
  var status = "INACTIVE"

  var data = {
    error: 1,
  };

  if (!!id) {
    var query = "SELECT * FROM subscriber WHERE id=? AND stream_token_id=? ALLOW FILTERING;";
    var params = [id, stream_token_id];
    var subscribers = await db.post(query, params);
    var rec = subscribers["rows"];
    var started_at = rec[0].started_at;
    var insert =
      "UPDATE subscriber SET crowns_spent=?,ended_at=?,status=? WHERE started_at=? IF id=? AND stream_token_id=?;";
    var params = [crowns_spent, ended_at, status, started_at, id, stream_token_id];
    console.log(params);
    var postResponse = db
      .post(insert, params)
      .then(function () {
        console.log("Promise Resolved");
      })
      .catch(function (err) {
        console.log(err);
        console.log("Promise Rejected");
      });
    console.log(postResponse);
    if (postResponse) {
      data["error"] = 0;
      data["subscriber"] = "exit from stream Successfully";
    }
    res.json(data);
  } else {
    data["subscriber"] = "please provide all required data";
    res.json(data);
  }
});

/* Agent Services */

/* get Agent Data by id */
router.get("/agent/:id", async function (req, res, next) {
  var id = req.params.id;
  var query = "SELECT * FROM agent WHERE id=?;";
  var params = [id];
  var data = await db.post(query, params);
  res.json(data["rows"]);
});

/* Create an agent */
router.post("/agent/add", async function (req, res) {
  var name = req.body.name;
  var ic_number = req.body.ic_number;
  var company_name = req.body.company_name;
  var email = req.body.email;
  var mobile = req.body.mobile;
  var address = req.body.address;
  var gender = req.body.gender;
  var created_date = new Date();
  var status = 'ACTIVE';
  const Uuid = require("cassandra-driver").types.Uuid;
  const id = Uuid.random();
  const uid = id.toString();

  var data = {
    error: 1,
  };

  if (!!created_date) {
    var insert =
      "INSERT INTO agent(id,name,ic_number,company_name,email,mobile,address,gender,created_at,status) Values (?,?,?,?,?,?,?,?,?,?);";
    var params = [uid, name, ic_number, company_name, email, mobile, address, gender, created_date, status];
    console.log(params);
    var postResponse = db
      .post(insert, params)
      .then(function () {
        console.log("Promise Resolved");
      })
      .catch(function (err) {
        console.log(err);
        console.log("Promise Rejected");
      });
    console.log(postResponse);
    if (postResponse) {
      data["error"] = 0;
      data["agent"] = "agent added Successfully";
    }
    res.json({ id: uid });
  } else {
    data["agent"] = "Please provide all required data";
    res.json(data);
  }
});

/* update an agent */
router.put("/agent/:id", async function (req, res) {
  var id = req.params.id;
  var name = req.body.name;
  var ic_number = req.body.ic_number;
  var company_name = req.body.company_name;
  var email = req.body.email;
  var mobile = req.body.mobile;
  var address = req.body.address;
  var gender = req.body.gender;
  var modified_at = new Date();
  var status = 'ACTIVE';

  var data = {
    error: 1,
  };

  if (!!modified_at) {
    var insert =
      "UPDATE agent SET name=?,ic_number=?,company_name=?,email=?,mobile=?,address=?,gender=?,modified_at=?,status=? WHERE id=?;";
    var params = [name, ic_number, company_name, email, mobile, address, gender, modified_at, status, id];
    console.log(params);
    var postResponse = db
      .post(insert, params)
      .then(function () {
        console.log("Promise Resolved");
      })
      .catch(function (err) {
        console.log(err);
        console.log("Promise Rejected");
      });
    console.log(postResponse);
    if (postResponse) {
      data["error"] = 0;
      data["agent"] = "agent updated Successfully";
    }
    res.json(data);
  } else {
    data["agent"] = "Please provide all required data";
    res.json(data);
  }
});


/* get user icon by id */
router.get("/user_icon/:id", async function (req, res, next) {
  var id = req.params.id;
  var query = "SELECT * FROM user_icon WHERE id=?;";
  var params = [id];
  var data = await db.post(query, params);
  res.json(data["rows"]);
});

/* Create an user icon */
router.post("/user_icon/add", async function (req, res) {
  var image = req.body.image;
  var id = req.body.id;
  var status = req.body.status;
  var created_date = new Date();

  var data = {
    error: 1,
  };

  if (!!created_date) {
    var insert =
      "INSERT INTO user_icon(id,image, status, created_date) Values (?,?,?,?);";
    var params = [id, image, status, created_date];
    console.log(params);
    var postResponse = db
      .post(insert, params)
      .then(function () {
        console.log("Promise Resolved");
      })
      .catch(function (err) {
        console.log(err);
        console.log("Promise Rejected");
      });
    console.log(postResponse);
    if (postResponse) {
      data["error"] = 0;
      data["icon"] = "Icon added Successfully";
    }
    res.json({ id: id });
  } else {
    data["icon"] = "Please provide all required data";
    res.json(data);
  }
});

/* update an agent */
router.put("/user_icon/:id", async function (req, res) {
  var id = req.params.id;
  var image = req.body.image;
  var status = req.body.status;
  var modified_at = new Date();
  var status = 'ACTIVE';

  var data = {
    error: 1,
  };

  if (!!modified_at) {
    var insert =
      "UPDATE user_icon SET image=?,status=?,updated_date=? WHERE id=?;";
    var params = [image, status, modified_at, id];
    console.log(params);
    var postResponse = db
      .post(insert, params)
      .then(function () {
        console.log("Promise Resolved");
      })
      .catch(function (err) {
        console.log(err);
        console.log("Promise Rejected");
      });
    console.log(postResponse);
    if (postResponse) {
      data["error"] = 0;
      data["icon"] = "icon updated Successfully";
    }
    res.json(data);
  } else {
    data["icon"] = "Please provide all required data";
    res.json(data);
  }
});


router.post("/user_gifted/:id", async function (req, res) {
  var id = req.params.id;
  var stream_tokenid = req.body.stream_tokenid;
  var crowns = req.body.crowns;
  var query = "SELECT * FROM user_gifts WHERE user_id=? AND stream_token_id=?;";
  var params = [id, stream_tokenid];
  var db_records = await db.post(query, params);
  var records = db_records["rows"];

  var data = {
    error: 1,
  };

  if (records.length === 1) {
    var totalCrowns = `${parseInt(records[0].crowns) + parseInt(crowns)}`;
    if (totalCrowns) {
      var insert =
        "UPDATE user_gifts SET crowns=? WHERE user_id=? and stream_token_id = ?;";
      var params = [totalCrowns, id, stream_tokenid];
      console.log(params);
      var postResponse = db
        .post(insert, params)
        .then(function () {
          console.log("Promise Resolved");
        })
        .catch(function (err) {
          console.log(err);
          console.log("Promise Rejected");
        });
      console.log(postResponse);
      if (postResponse) {
        data["error"] = 0;
        data["gifts"] = "gifted crowns updated Successfully";
      }
      res.json(data);
    } else {
      data["gifts"] = "Please provide all required data";
      res.json(data);
    }
  } else {
    if (!!id) {
      var insert =
        "INSERT INTO user_gifts(user_id,stream_token_id, crowns) Values (?,?,?);";
      var params = [id, stream_tokenid, crowns];
      console.log(params);
      var postResponse = db
        .post(insert, params)
        .then(function () {
          console.log("Promise Resolved");
        })
        .catch(function (err) {
          console.log(err);
          console.log("Promise Rejected");
        });
      console.log(postResponse);
      if (postResponse) {
        data["error"] = 0;
        data["gifted"] = "gifted crowns added to streamer Successfully";
      }
      res.json({ id: id });
    } else {
      data["gifted"] = "Please provide all required data";
      res.json(data);
    }
  }
});

router.get("/earned_crowns_active/:id", async function (req, res, next) {
  var id = req.params.id;
  earned_pearls = await getActiveStreamCrowns(id);
  res.json({ "totalCrowns": earned_pearls });
});

async function getActiveStreamCrowns(id) {
  var query = "SELECT crowns FROM user_gifts WHERE stream_token_id=? ALLOW FILTERING;";
  var params = [id];
  var data = await db.post(query, params);
  var crowns = data["rows"];
  var pearls = 0;
  if (crowns.length > 1) {
    var totalCrowns = crowns.reduce((accumulator, current) => accumulator + parseInt(current.crowns), 0);
    var query = "SELECT crown_type,conversion_rate FROM crown_to_pearl";
    var params = [id];
    var conversionMaster = await db.post(query, params);
    var conversionMaster = conversionMaster["rows"];
    conversionMaster.sort((a, b) => (parseInt(a.crown_type) > parseInt(b.crown_type)) ? 1 :
      ((parseInt(b.crown_type) > parseInt(a.crown_type)) ? -1 : 0));
    for (let i = 0; i < conversionMaster.length; i++) {
      if (!(conversionMaster[i].crown_type <= totalCrowns) || i + 1 === conversionMaster.length) {
        pearls = totalCrowns * conversionMaster[i].conversion_rate;
        break;
      }
    };
  }
  return pearls;
}

router.get("/earned_pearls/:id", async function (req, res, next) {
  var id = req.params.id;
  var query = "SELECT earned_pearls FROM earned_pearls WHERE id=?;";
  var params = [id];
  var data = await db.post(query, params);
  var pearls = data["rows"];
  if (pearls.length === 1) {
    var totalPearls = pearls[0].earned_pearls;
    res.json({ "userPearls": totalPearls });
  } else {
    res.json({ "userPearls": "0" });
  }
});

router.get("/send_email", async function (req, res, next) {
  console.log('in email call');
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: '',
      pass: ''
    }
  });

  var mailOptions = {
    from: 'ppavankumar5795@gmail.com',
    to: 'ppavankumar5795@gmail.com',
    subject: 'RatuLive: Your request to become Agent is approved.',
    text: 'Agent Code is XXXXXX'
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
      res.json({success: "email sent"});
    }
  });
});

module.exports = router;

