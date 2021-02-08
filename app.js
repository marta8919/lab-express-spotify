require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:
app.get('/', (req, res, next)=> {
  res.render('index.hbs')
})

app.get("/artist-search", (req, res, next)=> {
  
  let searchArtist = req.query.artist

  spotifyApi.searchArtists(searchArtist)
    .then((data)=>{
        res.render('artist-search-results.hbs', {artists: data.body.artists.items})
        // console.log('The received data from the API: ', data.body.artists.items[0]);
    })
    .catch(()=>{
      console.log('THS IS NOT WORKING')
    })

})

app.get('/albums/:artistId', (req, res, next)=>{
  let id = req.params.artistId

  spotifyApi
    .getArtistAlbums(id)
      .then((data)=>{
          res.render('albums.hbs', {album: data.body.items})
          // console.log(data.body.items[0])
      })
      .catch((error)=>{
        next(error)
      })
})

app.get('/tracks/:albumId', (req, res, next)=>{

  let id = req.params.albumId

  spotifyApi.getAlbumTracks(id)
    .then((data)=>{
      console.log(data.body.items[0])
      res.render('tracks.hbs', {tracks: data.body.items})
    })
    .catch((err)=>{
      next(err)
    })
})

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));


