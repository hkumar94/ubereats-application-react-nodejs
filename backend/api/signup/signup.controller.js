const {
    signup,
} = require("./customersignup.service");

module.exports = {
    signup: (req, res) => {
        body = req.body
        signup(body, (err, results) => {
            if (err) {
                console.log(err);
                return;
            }
            return res.json({
                success: 1,
                data: results
            });
        });
    }
}