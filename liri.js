var fs = require("fs");
var keys = require("./keys.js");
var request = require("request");
var twitter = require("twitter");
var inquirer = require("inquirer");

var client = new twitter(keys.twitterKeys);
var SpotifyWebApi = require('node-spotify-api');

var spotify = new SpotifyWebApi(keys.spotifyKeys);
var a;
var b;


inquirer.prompt([
    {
        type: "list",
        message: "What Command Would You Like: ",
        choices: ["my-tweets", "spotify-this-song", "movie-this", "do-what-it-says"],
        name: "command"
    },
    {
        type: "input",
        message: "What Song/movie (Skip if u chose my-tweets or do-what-it-says): ",
        name: "choice"
    }
]).then(function(inquirerResponse){
    a = inquirerResponse.command;
    b = inquirerResponse.choice;
    console.log(" ");
    console.log(" ");
    console.log(" ");
    switchF();
});


function switchF(){
    switch(a){
        case "my-tweets":
            tweets();
            break;
        case "spotify-this-song":
            spotifyF();
            break;
        case "movie-this":
            movie();
            break;
        case "do-what-it-says":
            doWhat();
            break;
        default:
            appendF();
            }

}

function tweets(){
    client.get("statuses/user_timeline",{screen_name: "@lord_fluffy99", count: 20}, function(error,tweets,response){
        var myTweets = JSON.parse(response.body);
        //console.log(myTweets);
        for(var i = 0; i < 20; i++){
            console.log(myTweets[i].created_at);
            console.log(myTweets[i].text);
        }
    })
    appendF();
}

function spotifyF(){
    if(b === ""){
        b = "The Sign";
    }
    spotify.search({type: 'track', query: b}, function(error,data){
        console.log("Artist: " + data.tracks.items[0].artists[0].name);
        console.log("Song Name: " + data.tracks.items[0].name);
        console.log("Preview Link: " + data.tracks.items[0].preview_url);
        console.log("Album: " + data.tracks.items[0].album.name);
    })
    appendF();
}

function movie(){
    if( b === ""){
        b = "Mr. Nobody";
    }
    var queryUrl = "http://www.omdbapi.com/?apikey=40e9cece&t=" + b;
    request(queryUrl, function(error, response, body){
        var movieInfo = JSON.parse(body);
        console.log("Title: " + movieInfo.Title);
        console.log("Year of Release: " + movieInfo.Year);
        console.log("IMDBRating: " + movieInfo.imdbRated);
        console.log("Rotten Tomatoes Rating: " + movieInfo.Ratings[1].value);
        console.log("Country Produced: " + movieInfo.Country);
        console.log("Language: " + movieInfo.Language);
        console.log("Plot: " + movieInfo.Plot);
        console.log("Actors: " + movieInfo.Actors);
    })
    appendF();
}

function doWhat(){
    fs.readFile("random.txt", "utf8", function(error, data){
        var dataArr = data.split(",", 2);
        a = dataArr[0];
        b = dataArr[1];
        switchF();
    })
    appendF();
}
function appendF(){
    if( a !== "" ){
        fs.appendFile("log.txt", a + " - " + b + ", ", function(err) {
            if(err){
                console.log(err);
            }
        })
    }else{
        console.log("there was no command given");
    }
}