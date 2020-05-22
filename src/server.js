const express = require('express')
const bodyParser = require('body-parser')
const env = require('./.env.json')
const cors = require('cors')
const ig = require('instagram-scraping')
const redis = require("redis");
const client = redis.createClient(process.env.REDIS_URL);

client.on("error", function(error) {
  console.error(error);
});

const app = express()

/*                              App Declarations                            */
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

ig.scrapeUserPage(env.instagramProfile).then(result => {
    setResponse(result.medias);
}).catch(err => {console.log(err)});


/* Print result on screen and save on redis  */
function setResponse(data){   
    console.log(data[1].display_url)
    i = 0;
    data.forEach(function(url) {
        i++;
        console.log("{key: "+i+",", "url: "+url.display_url+"}")
        client.set(i, url.display_url);
    })
    startApp()
}

function startApp(){
    app.listen(env.port, () =>{console.log("Service is up and listen on port "+env.port)})
}