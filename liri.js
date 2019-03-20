/////////////////////////////
require('dotenv').config();
//Global Variables 
var keys = require('./keys.js');
var axios = require("axios");
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
//Movie Needs
var request = require("request");
//Do-What-It-Says Needs
var fs = require("fs");
//To take in User Input
var command = process.argv[2];
var input = process.argv[3];
var moment = require("moment");
////////////////////////////


// concert-this
// spotify-this-song
// movie-this
// do-what-it-says


//////////////////////////////////////
switch (command) {

  //Spotify Case
  case 'spotify-this-song':
    song(input);
    break;
  //Movie Case
  case 'movie-this':
    movie(input);
    break;
  //Bands in town
  case 'concert-this':
    bands(input);
    break;
  //Do What It Says Case
  case 'do-what-it-says':
    followDirections();
    break;
  //Default
  default:
    console.log(`I don't understand!`)
}



//creating the function song ()
function song(song = "The Sign Ace of Base") {
  //setting variable song to empty string

  console.log(`|--------------------|`);
  console.log(`Here's what I found about the song!`)
  spotify.search({ type: 'track', query: song }, function (error, data) {
    if (!error) {
      console.log(`Song: ${data.tracks.items[0].name}`);
      console.log(`Artist(s): ${data.tracks.items[0].artists[0].name}`);
      console.log(`Album: ${data.tracks.items[0].album.name}`);
      console.log(`Preview Link: ${data.tracks.items[0].external_urls.spotify}`);
      var songData = `\nUsed spotify-this-song to find: \nArtist: ${data.tracks.items[0].artists[0].name} \nSong Name: ${data.tracks.items[0].name} \nSpotify Preview Link: ${data.tracks.items[0].external_urls.spotify} \nAlbum: ${data.tracks.items[0].album.name}\n--------------------`
      fs.appendFile('log.txt', songData, function (error) {
        if (error) throw error;
      });
    }
  });
}

function movie(movie = "Mr. Nobody") {
  console.log(`|--------------------|`);
  axios.get("http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy").then(
    function (response) {

      console.log("The movie's title is: " + response.data.Title);
      console.log("Year the movie came out: " + response.
      data.Released);
      console.log("IMDB Rating of the movie: " + response.data.imdbRating);
      console.log("Rotten Tomatoes Rating of the movie: " + response.data.Ratings[1].Value);
      console.log("Country where the movie was produced: " + response.data.Country);
      console.log("Language of the movie: " + response.data.Language);
      console.log("Plot of the movie: " + response.data.Plot);
      console.log("Actors in the movie: " + response.data.Actors);
    }
  );
}


//   Name of the venue
// Venue location
// Date of the Event (use moment to format this as "MM/DD/YYYY")
function bands(bands = "Stevie") {
  axios.get("https://rest.bandsintown.com/artists/" + bands + "/events?app_id=codingbootcamp").then(
    function (response) {
      for (var i = 0; i < response.data.length; i++) {
        console.log(response.data[i].venue.name);
        console.log(response.data[i].venue.city);
        console.log(moment(response.data[i].datetime).format("MM/DD/YYYY"));
        console.log(`|--------------------|`);
      }
    }

  )
};

function followDirections() {
  fs.readFile ("random.txt", "utf-8", function(err, data){
    if (err) {
      console.log(err);
    }
    else {
      var dataArr = data.split(",")
      
      switch (dataArr[0]) {

        //Spotify Case
        case 'spotify-this-song':
          song(dataArr[1]);
          break;
        //Movie Case
        case 'movie-this':
          movie(dataArr[1]);
          break;
        //Bands in town
        case 'concert-this':
          bands(dataArr[1]);
          break;
        //Do What It Says Case
        case 'do-what-it-says':
          followDirections();
          break;
        //Default
        default:
          console.log(`I don't understand!`)
      }
    }
  })

}


