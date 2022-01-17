const Restaurant = require("../../Models/RestaurantModel");
const Menu = require("../../Models/MenuModel");

const multer = require('multer');
const path = require('path');
var kafka = require('../../kafka/client');
const fs = require('fs');
const aws = require('aws-sdk');
const config = require("../../config/configValue");

//Upload restaurant profile picture
const resstorage = multer.diskStorage({
    destination: path.join(__dirname, '..', '..') + '/public/uploads/restaurants',
    filename: (req, file, cb) => {
      cb(null, 'restaurant' + req.params.id + "-" + Date.now() + path.extname(file.originalname));
    }
  });
  
  const resuploads = multer({
    storage: resstorage,
    limits: { fileSize: 1000000 },
  }).single("resimage");

module.exports = {
  
    getRestaurantProfileDetails: (id, callBack) => {
        console.log("Inside get restaurant details service");
        // Restaurant.findOne({ _id: id }, (error, result) => {
        // if (error) {
        //     callBack(error);
        // }
        // console.log("Restaurant Details:",result);
        // return callBack(null, result);
        // });
        const params = {
            data: id,
            path: 'get-restaurant-details'
        }

        kafka.make_request('restaurant', params, (error, result) => {
            if (error) {
                console.log(error);
                callBack(error);
            }
            console.log("Restaurant details", result);
            return callBack(null, result);
        });
    },

    updateRestaurantProfile: (data, callBack) => {
        console.log("Inside update restaurant profile service", data.body);
        const params = {
            data: data.body,
            path: 'update-restaurant-profile'
        }

        kafka.make_request('restaurant', params, (error, result) => {
            if (error) {
                console.log(error);
                callBack(error);
            }
            console.log("Restaurant update profile details", result);
            return callBack(null, result);
        });
        // var newData = {
        //     resto_name: data.resto_name,
        //     resto_description: data.resto_description,
        //     password: data.pwd,
        //     address: data.address,
        //     zipcode: data.zipcode,
        //     phone_number: data.phone_number,
        //     timings: data.timings,
        //     delivery: data.delivery,
        //     favourite: data.favourite,
        //     country: data.country,
        //     dob: data.dob,
        //     email_id: data.email_id
        // }
        // Restaurant.updateOne({ _id: data.user_id }, newData, { upsert: false }, (error, results) => {
        // if (error) {
        //     console.log("Error while updating restaurant details", error);
        //     callBack(error);
        // }
        // console.log("Result after updating restaurant details", results);
        // return callBack(null, results);
        // });
    },
  
    // updateRestaurantProfilePic: (req, res, callBack) => {
    //     console.log("Inside update restaurant profile picture with data", req.params.id);
    //     // Restaurant.updateOne({ _id: data.id }, { profilePicURL: data.profilePicURL }, { upsert: false }, (error, results) => {
    //     //     if (error) {
    //     //         callBack(error);
    //     //     }
    //     //     return callBack(null, results);
    //     // });

    //     resuploads(req, res, function (err) {
    //         console.log("Inside update restaurant profile picture with data", req.params.id, req.file.filename);
    //         if (!err) {
    //             Restaurant.updateOne({ _id: req.params.id }, { res_image: req.file.filename }, { upsert: false }, (error, results) => {
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
    // },
    updateRestaurantProfilePic(req, callBack) {
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
            Key: `images/restaurant/${req.file.originalname}`
        };

        s3.upload(params, (err, data) => {

            if (err) {
                console.log('Error occured while trying to upload to S3 bucket', err);
            }

            if (data) {
                console.log("Got data", data);
                fs.unlinkSync(req.file.path);
                const locationUrl = data.Location;

                Restaurant.updateOne({ _id: req.body.id }, { res_image: req.file.originalname }, (error, result) => {
                    if (error) {
                        console.log(error);
                    }
                    console.log("Result DATA upload file", locationUrl);
                    return callBack(null, { imageUrl: locationUrl });
                })
            }
        });
    },

    restaurantSearch: (searchinput, callBack) => {
        console.log("Inside get restaurant details service with search input", searchinput);
        const params = {
            data: searchinput,
            path: 'restaurant-search'
        }

        kafka.make_request('restaurant', params, (error, result) => {
            if (error) {
                console.log(error);
                callBack(error);
            }
            console.log("Restaurant search details", result);
            return callBack(null, result);
        });

        // if(searchinput == "_") {
        //     console.log("Getting all restaurant details");
        //     Restaurant.find({}, (error, result) => {
        //         if (error) {
        //             callBack(error);
        //         }
        //         console.log("Restaurant search result:",result);
        //         return callBack(null, result);
        //     });    

        // } else {
        //     let filter = {};
        //     filter = {
        //         '$or' : [ 
        //                 {resto_name: { "$regex": searchinput, "$options": "i" }},
        //                 {address: { "$regex": searchinput, "$options": "i" }}
        //             ]
        //     }
        //     console.log("filter", filter);
        //     Restaurant.find(filter, (error, result) => {
        //         if (error) {
        //             callBack(error);
        //         }
        //         console.log("Restaurant search result:",result);
        //         return callBack(null, result);
        //     });
        // }
    },
    restaurantDeliverySearch: (req, callBack) => {
        console.log("Inside get restaurant by filter service with search input");
        var searchinput =  req.body.searchInput;
        console.log("Delivery", req.body.delivery);
        console.log("Pickup", req.body.pickup);

        let filter = {};
        if (req.body.pickup == true) {
            filter =
            {
                '$and' : [
                    { 
                    '$or' : [ 
                        { resto_name: { "$regex": searchinput, "$options": "i" } },
                        { address: { "$regex": searchinput, "$options": "i" } }
                            ]
                    },
                    { delivery: { "$regex": "false", "$options": "i" }}
                ]
            }  
        } else if (req.body.delivery == true) {
            filter =
            {
                '$and' : [
                    { 
                    '$or' : [ 
                        { resto_name: { "$regex": searchinput, "$options": "i" } },
                        { address: { "$regex": searchinput, "$options": "i" } }
                            ]
                    },
                    { delivery: { "$regex": "true", "$options": "i" }}
                ]
            }  
        } else {
            filter = {
                '$or': [
                    { resto_name: { "$regex": searchinput, "$options": "i" } },
                    { address: { "$regex": searchinput, "$options": "i" } }
                ]
            }
        }
        console.log("filter resto", filter.resto_name);
        console.log("filter address", filter.address);

        Restaurant.find(filter, (error, result) => {
            if (error) {
                callBack(error);
            }
            console.log("Restaurant search result:", result);
            if (result.length == 0) {
                console.log("Inside restaurant search with item search");
                Menu.find({ item_name: { "$regex": searchinput, "$options": "i" } }, (error, data) => {
                    console.log("Restaurant search result with menu item:", data);
                   
                    Restaurant.find({_id: data[0].resto_id}, (error, reslt) => {
                        if (error) {
                            callBack(error);
                        }
                        console.log("item search reslt", reslt);
                        return callBack(null, reslt); 
                    });    
                                          
                });
            }
            return callBack(null, result);
        });

    }
}
