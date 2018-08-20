console.log("this is loded");
require("dotenv").config();

var Twit = require("twit"); // require twit
var Spotify = require("node-spotify-api"); // require spotify
var fs = require("fs");
var keys = require("./keys");// link the twitter keys file
var request = require("request");
var liriArgument = process.argv[2];
// create a arguments for Liri app
switch (liriArgument){
    case "my-tweets" : myTweets(); break;
    case "movie-this" : getMovie(); break;
    case "spotify-this-song" : getSong(); break;
    case "do-what-it-says" : doWhatItSays();break;

    default: console.log("\r\n" + "try typing one of the following command after'node index.js' : "+"\r\n" +
    "1. my-tweets 'any twitter name' " + "\r\n" + 
    "2. movie-this 'any movie name' " + "\r\n" + 
    "3. spotify-this-song 'any song' " + "\r\n");
};
// function start for searching tweets
function myTweets(){
var T = new Twit(keys);

var twitterUsername = process.argv[3];
if(!twitterUsername){
    twitterUserName = 'banana'; 
}

var params = { q: twitterUsername, count: 20 }

T.get('search/tweets', params, goData);

function goData(err, data, response) {
    var tweets = data.statuses;

    if(!err){
    for (var i = 0; i < 5; i++){

        var twitterResult = "@" + tweets[i].user.screen_name + ": " + tweets[i].text + "\r\n" + tweets[i].created_at + "\r\n" +
        "-------------------------------- " + i + " -------------------------------------" + "\r\n";
        console.log(twitterResult);
        console.log(tweets[i].text);
    }
        } else {
        console.log("Error " + err);
    return;
    }
  };
}

// omdbi function

function getMovie() {
var movie = process.argv[3];
if (!movie) {
    movie = "matrix";
}

var queryUrl = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&r=json&tomatoes=true&apikey=trilogy";

console.log(queryUrl);

request(queryUrl, function(error, response, body) {

    if(!error && response.statusCode === 200){
        var movieObject = JSON.parse(body);
       // console.log(movieObject);
        for (i =0; i < 5; i++) {

        
       var movieResults = 
        "------------------------------ begin ------------------------------" + "\r\n" +
        "Title: " + movieObject.Title+"\r\n"+
        "Year: " + movieObject.Year+"\r\n"+
        "Imdb Rating: " + movieObject.imdbRating+"\r\n"+
        "Rotten Tomatoes Rating: " + movieObject.tomatoRating+"\r\n"+
        "Country: " + movieObject.Country+"\r\n"+
        "Language: " + movieObject.Language+"\r\n"+
        "Plot: " + movieObject.Plot+"\r\n"+
        "Actors: " + movieObject.Actors+"\r\n"+
        "------------------------------ end ------------------------------" + "\r\n";
        console.log(movieResults);
        };

        // Append movie results to log.txt file 
        fs.appendFile('log.txt', movieResults, function(err){

            if(err) throw err;
        });
        console.log("Saved");
        logResults(response);
    } else {

            console.log("Error : " + error);
            return;

    };
});

};

//Function to log results from the other functions
function logResults(data){
    fs.appendFile("log.txt", data, function(err) {
      if (err)
          throw err;
    });
  };


  // spotify this song function

  function getSong() {
      var spotify = new Spotify({
        id: 'dcf96b8c9f1345a1ada7572c9b85257b',
        secret: 'e2ed8207966d4b858ba1201da8bb7ebf'
      });

      var songName = process.argv[3];
      if(!songName) {
          songName = "The Sign";
      };

      console.log(songName);

      //call back to spotify

      spotify.search({ type: 'track', query: songName}, function(err, data){
          console.log(data);
          if (err) {
              return console.log('Error occurred: ' + err);
          }
          for (i = 0; i < 5; i++){

          
            var songResult =
            "------------------------------ begin ------------------------------" + "\r\n" +
            "Artist: " + data.tracks.items[0].artists[0].name + "\r\n" +
            "Song name: " + data.tracks.items[0].name + "\r\n" +
            "Album Name: " + data.tracks.items[0].album.name + "\r\n" +
            "Preview Link: " + data.tracks.items[0].preview_url + "\r\n" +
            "------------------------------ end ------------------------------" + "\r\n";
            console.log(songResult); 
            
            //Creates a variable to save text into log.txt file
            var logSong = "Artist: " + data.tracks.items[0].artists[0].name + "\nSong name: " + data.tracks.items[0].name +
            "\nAlbum Name: " + data.tracks.items[0].album.name + "\nPreview Link: " + data.tracks.items[0].preview_url + "\n";
            
            //Appends text to log.txt file
            fs.appendFile('log.txt', logSong, function (err) {
            if (err) throw err;
            });
            
            logResults(data);
        };
      });
  };

  // Do What It Says function, uses the reads and writes module to access the random.txt file and do what's written in it
	function doWhatItSays() {
		fs.readFile("random.txt", "utf8", function(error, data){
			if (!error) {
				doWhatItSaysResults = data.split(",");
				getSong(doWhatItSaysResults[0], doWhatItSaysResults[1]);
			} else {
				console.log("Error occurred" + error);
			}
		});
	};