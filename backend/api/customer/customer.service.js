const Customer = require("../../Models/CustomerModel");
const multer = require('multer');
const path = require('path');
var kafka = require('../../kafka/client');
const fs = require('fs');
const aws = require('aws-sdk');
const config = require("../../config/configValue");


//Upload restaurant profile picture
const resstorage = multer.diskStorage({
    destination: path.join(__dirname, '..', '..') + '/public/uploads/users',
    filename: (req, file, cb) => {
      cb(null, 'restaurant' + req.params.id + "-" + Date.now() + path.extname(file.originalname));
    }
  });
  
  const resuploads = multer({
    storage: resstorage,
    limits: { fileSize: 1000000 },
  }).single("resimage");

module.exports = {
  
    getCustomerProfileDetails: (id, callBack) => {
        console.log("Inside get customer details service");

        const params = {
            data: id,
            path: 'get-customer-details'
        }

        kafka.make_request('customer', params, (error, result) => {
            if (error) {
                console.log(error);
                callBack(error);
            }
            console.log("Customer details", result);
            return callBack(null, result);
        });
        
        // Customer.findOne({ _id: id }, (error, result) => {
        // if (error) {
        //     callBack(error);
        // }
        // console.log("Customer Details:",result);
        // return callBack(null, result);
        // });
    },

    updateCustomerProfile: (data, callBack) => {
        console.log("Inside update customer profile service", data.user_id);
        var newData = {
            cust_name: data.cust_name,
            password: data.pwd,
            address: data.address,
            phone_number: data.phone_number,
            country: data.country,
            dob: data.dob,
            email_id: data.email_id,
            user_id: data.user_id
        }

        const params = {
            data: newData,
            path: 'update-customer-details'
        }

        kafka.make_request('customer', params, (error, results) => {
            if (error) {
                console.log("Error while updating customer details", error);
                callBack(error);
            }
            console.log("Result after updating customer details", results);
            return callBack(null, results);
        });

        // Customer.updateOne({ _id: data.user_id }, newData, { upsert: false }, (error, results) => {
        // if (error) {
        //     console.log("Error while updating restaurant details", error);
        //     callBack(error);
        // }
        // console.log("Result after updating restaurant details", results);
        // return callBack(null, results);
        // });
    },

    updateCustomerProfilePic(req, callBack) {
        console.log('In upload');

        aws.config.setPromisesDependency();
        aws.config.update({
            accessKeyId: config.s3AccessKey,
            secretAccessKey: config.s3SecretAccessKey,
            region: config.s3region
        });
        const s3 = new aws.S3();
        var params = {
            ACL: 'public-read',
            Bucket: config.s3BucketName,
            Body: fs.createReadStream(req.file.path),
            Key: `images/customer/${req.file.originalname}`
        };

        s3.upload(params, (err, data) => {

            if (err) {
                console.log('Error occured while trying to upload to S3 bucket', err);
            }

            if (data) {
                console.log("Got data", data);
                fs.unlinkSync(req.file.path);
                const locationUrl = data.Location;

                Customer.updateOne({ _id: req.body.id }, { cust_img: req.file.originalname }, (error, result) => {
                    if (error) {
                        console.log(error);
                    }
                    console.log("Result DATA upload file", locationUrl);
                    return callBack(null, { imageUrl: locationUrl });
                })
            }
        });
    }
  
    // updateCustomerProfilePic: (req, res, callBack) => {
    //     console.log("Inside update restaurant profile picture with data", req.params.id);
    //     // Customer.updateOne({ _id: data.id }, { profilePicURL: data.profilePicURL }, { upsert: false }, (error, results) => {
    //     //     if (error) {
    //     //         callBack(error);
    //     //     }
    //     //     return callBack(null, results);
    //     // });

    //     resuploads(req, res, function (err) {
    //         console.log("Inside update restaurant profile picture with data", req.params.id, req.file.filename);
    //         if (!err) {
    //             Customer.updateOne({ _id: req.params.id }, { res_image: req.file.filename }, { upsert: false }, (error, results) => {
    //                 if (error) {
    //                     console.log("Error uploading image", error);
    //                     callBack(error);
    //                 }
    //                 console.log("Result after uploading restaurant photo", results);
    //                 return callBack(null, results);
    //             });
    //         }
    //         else {
    //             console.log('Error Occured!');
    //         }
    //     })
    // }
}
