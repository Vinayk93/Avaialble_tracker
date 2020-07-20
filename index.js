
let redis = require('redis');
let client = redis.createClient();

client.on("error", function(err) {
    assert(err instanceof Error);
    assert(err instanceof AbortError);
    assert(err instanceof AggregateError);
   
    // The set and get are aggregated in here
    assert.strictEqual(err.errors.length, 2);
    assert.strictEqual(err.code, "NR_CLOSED");
  });
  
let express = require('express');
var bodyParser = require('body-parser');

let app = express();
app.use(bodyParser.json());

app.get('/request_nearest_coordinates',(req,res)=>{
    console.log(req.query);
    const lat = (req.query.lat);
    const long = (req.query.long);
    const distance = req.query.distance || '1200'
    client.georadius('locations',lat,long,distance,'km','WITHDIST','WITHCOORD',(err,reply)=>{
        console.log(err,reply);
        if(err){
            res.send("Not able to fetch data");
        }else{
            [[
                "a","157.2222",
                ["2.00000256299972534","3.00000091215010656"]
            ]]
            let location = [];
            reply.forEach((r)=>{
                let data = {
                    user_id :r[0],
                    // distance: r[1],
                    lat: r[2][0],
                    long: r[2][1]
                };
                location.push(data);
            });
            res.send(location);
        }
    });
});

app.post('/send_coordinate/:user',(req,res)=>{
    console.log(req.body);
    console.log(req.path);
    console.log(req.params);
    if(typeof req.body === "string"){
        req.body = JSON.parse(req.body);
    }
    const lat = req.body.lat;
    const long = req.body.long;
    const user_id = req.params.user;
    client.geoadd('locations',lat,long,user_id,(err)=>{
        console.log(err);
        if(err){
            res.send("Not able to update");
        }
        res.send('Updated Successfully');
    })
});

// docs
app.get('/*',(req,res)=>{
    res.send(`
    <html>
    <body>
    <p>Available API</p>
    <p>GET request_nearest_coordinates</p>
    <p>POST send_coordinate/:user_id</p>
    <body>
    </html>
    `)
})
app.listen(5000);
