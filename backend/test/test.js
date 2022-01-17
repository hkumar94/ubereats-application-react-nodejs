var assert = require('chai').assert;
var app = require('../index');

var chai = require('chai');
chai.use(require('chai-http'));
var expect = require('chai').expect;

var agent = require('chai').request.agent(app);


describe("UberEats", function () {
    describe('Customer Login Test', function () {

        it('Incorrect Password',() => {
            agent.post("/login/customer")
                .send({ email_id: "shradhayewale1@gmail.com", password: "password1234" })
                .then(function (res) {
                    expect(res.text).to.equal("INCORRECT_PASSWORD");
                })
                .catch(error => {
                    console.log(error);
                });
        });

        it('Invalid User', () => {
            agent.post("/login/customer")
                .send({ email_id: "user@sjsu.edu", password: "password1234" })
                .then(function (res) {
                    expect(res.text).to.equal("NO_USER");
                })
                .catch(error => {
                    console.log(error);
                });
        });

        it('Successful Login',() => {
            agent.post("/login/customer")
                .send({ email_id: "shradhayewale1@gmail.com", password: "1234" })
                .then(function (res) {
                    expect(res.status).to.equal(200);
                })
                .catch(error => {
                    console.log(error);
                });
        });
    });

    describe('Restaurant Login Test', function () {

        it('Incorrect Password',() => {
            agent.post("/login/restaurant")
                .send({ email_id: "shradhayewale1@gmail.com", password: "password1234" })
                .then(function (res) {
                    expect(res.text).to.equal("INCORRECT_PASSWORD");
                })
                .catch(error => {
                    console.log(error);
                });
        });

        it('Invalid User', () => {
            agent.post("/login/restaurant")
                .send({ email_id: "user@sjsu.edu", password: "password1234" })
                .then(function (res) {
                    expect(res.text).to.equal("NO_USER");
                })
                .catch(error => {
                    console.log(error);
                });
        });

        it('Successful Login',() => {
            agent.post("/login/restaurant")
                .send({ email_id: "shradhayewale1@gmail.com", password: "1234" })
                .then(function (res) {
                    expect(res.status).to.equal(200);
                })
                .catch(error => {
                    console.log(error);
                });
        });
    });

    describe('Customer Signup Test', () => {

        it('Customer Already Exists', () => {
            agent.post("/signup/customer")
                .send({ name: "Shradha", email_id: "shradhayewale1@gmail.com", password: "password", country:"India", dob: "2021-09-21"})
                .then(function (res) {
                    expect(res.text).to.equal("USER_EXISTS");
                })
                .catch(error => {
                    console.log(error);
                });
        });

        it('Successful Customer Signup', () => {
            agent.post("/signup/customer")
                .send({ name: "Shradha", email_id: "shradha123@sjsu.edu", password: "password", country:"India", dob: "2021-09-21"})
                .then(function (res) {
                    expect(res.status).to.equal(200);
                })
                .catch(error => {
                    console.log(error);
                });
        });
    });

    describe('Restaurant Signup Test', () => {

        it('Restaurant Account Already Exists', () => {
            agent.post("/signup/restaurant")
                .send({ name: "Restobar", email_id: "shradhayewale1@gmail.com", password: "password", location:"India"})
                .then(function (res) {
                    expect(res.text).to.equal("USER_EXISTS");
                })
                .catch(error => {
                    console.log(error);
                });
        });

        it('Successful Restaurant Account', () => {
            agent.post("/signup/restaurant")
                .send({ name: "Restobar", email_id: "shradha12@sjsu.edu", password: "password", location:"India"})
                .then(function (res) {
                    expect(res.status).to.equal(200);
                })
                .catch(error => {
                    console.log(error);
                });
        });
    });

    describe('Customer Profile Test', () => {

        it('Fetch Customer Name from user id',function () {
            agent.get("/profile/customer/14")
                .then(function (res) {
                    expect(JSON.parse(res.text).name).to.equal('SHRADHA ATMARAM YEWALE');
                })
                .catch(error => {
                    console.log(error);
                });
        });

    });

    describe('Restaurant Profile Test', () => {

        it('Fetch Restaurant Name from Owner user id',function () {
            agent.get("/profile/restaurant/5")
                .then(function (res) {
                    expect(JSON.parse(res.text).name).to.equal('Taco Bell');
                })
                .catch(error => {
                    console.log(error);
                });
        });

    });
});    
    