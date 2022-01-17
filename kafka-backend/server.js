var connection =  new require('./kafka/Connection');

//topics files
var Customer = require('./services/customer.js');
var Restaurant = require('./services/restaurant.js');
var Menu = require('./services/menu.js');
var MenuSection = require('./services/menusection.js');
var Cart = require('./services/cart.js');
var Order = require('./services/order.js');



const { mongoDB} = require('./config/configValue');

const mongoose = require('mongoose');

var options = {
    useNewUrlParser: true,
    useUnifiedTopology: true
};

mongoose.connect(mongoDB, options, (err, res) => {
    if (err) {
        console.log(err);
        console.log(`MongoDB Connection Failed`);
    } else {
        console.log(`MongoDB Connected`);
    }
});


function handleTopicRequest(topic_name,fname){
    console.log("In kafka backend server file topic name:", topic_name);
    //var topic_name = 'root_topic';
    var consumer = connection.getConsumer(topic_name);
    var producer = connection.getProducer();
    console.log('server is running ');
    consumer.on('message', function (message) {
        console.log('message received for ' + topic_name +" ", fname);
        console.log(JSON.stringify(message.value));
        var data = JSON.parse(message.value);
        
        fname.handle_request(data.data, function(err,res){
            console.log('after handle'+res);
            var payloads = [
                { topic: data.replyTo,
                    messages:JSON.stringify({
                        correlationId:data.correlationId,
                        data : res
                    }),
                    partition : 0
                }
            ];
            producer.send(payloads, function(err, data){
                console.log(data);
            });
            return;
        });
        
    });
}
// Add your TOPICs here
//first argument is topic name
//second argument is a function that will handle this topic request
handleTopicRequest("customer",Customer);
handleTopicRequest("restaurant",Restaurant);
handleTopicRequest("menu",Menu);
handleTopicRequest("cart",Cart);
handleTopicRequest("menusection",MenuSection);
handleTopicRequest("order",Order);



