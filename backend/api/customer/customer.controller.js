const {

    getCustomerProfileDetails,
    updateCustomerProfile,
    updateCustomerProfilePic
 } = require("./customer.service");
  
  
  const { hashSync, genSaltSync, compareSync } = require("bcrypt");
  //const { sign } = require("jsonwebtoken");
  

  
  
  module.exports = {
      
    getCustomerProfileDetails: (req, res) => {
      const id = req.params.id;
     
      // kafka.make_request('student',data,(err, results) => {
      //     if (err) {
      //       console.log(err);
      //       return;
      //     }
      //       return res.json({
      //       success: 1,
      //       data: results
      //       });
      //   });
      getCustomerProfileDetails(id, (err, results) => {
        if (err) {
          console.log(err);
          return;
        }
        return res.json({
          success: 1,
          data: results
        });
      });
    },
  
  
    updateCustomerProfile: (req, res) => {
      const body = req.body;
      console.log("Update restaurant form data", body);
      updateCustomerProfile(body, (err, results) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            success: 0,
            message: "Database connection errror"
          });
        }
        return res.status(200).json({
          success: 1,
          data: results
        });
      });
    },
  
    updateCustomerProfilePic: (req, res) => {
      console.log("Inside updateCustomerProfilePic controller", req.body.id);
      updateCustomerProfilePic(req, (err, results) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            success: 0,
            message: "Database connection errror"
          });
        }
        console.log("upload profile pic", results);
        res.end(JSON.stringify(results));
      });
    }
}