const express = require("express");
const axios = require("axios");

const server = express();

server.use(express.json());

server.use(express.static("public"));

server.use(express.urlencoded({ extended: true }));

const ytkey = "AIzaSyAZXCvJRJIgbJyn1f-gRp3dW4E23oruE7A";

const nunjucks = require("nunjucks");
nunjucks.configure("src/views", {
  express: server,
  noCache: true,
});

server.get("/", async (req, res) => {
  return res.render("index.html");
});

server.post("/send", (req, res) => {
  const search = req.body.search;

  const request = axios
    .get(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&order=viewCount&pageToken=CAoQAA&q=${search}&type=video&key=AIzaSyD5-SoOtrMC7q1klw3aNIOtfgROYvLImHk`
    )
    .then(function (response) {
      const search = req.body.search;
      const nextToken = response.data.nextPageToken;
      const snippets = response.data.items.map((item) => ({
        id: item.id.videoId,
        snippet: {
          title: item.snippet.title,
          description: item.snippet.description,
          thumbnails: item.snippet.thumbnails.medium.url,
        },
      }));

      return res.render("search-results.html", {
        videos: snippets,
        nextToken: nextToken,
        search: search,
      });
    })
    .catch((error) => {
      console.log(error);
    });
});

server.get("/next/:token/:search", (req, res) => {
  const token = req.params.token;
  const search = req.params.search;

  const request = axios
    .get(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&order=viewCount&pageToken=${token}&q=${search}&type=video&key=AIzaSyD5-SoOtrMC7q1klw3aNIOtfgROYvLImHk`
    )
    .then(function (response) {
      const search = req.body.search;
      const nextToken = response.data.nextPageToken;
      const snippets = response.data.items.map((item) => ({
        id: item.id.videoId,
        snippet: {
          title: item.snippet.title,
          description: item.snippet.description,
          thumbnails: item.snippet.thumbnails.medium.url,
        },
      }));

      return res.render("search-results.html", {
        videos: snippets,
        nextToken: nextToken,
        search: search,
      });
    })
    .catch((error) => {
      console.log(error);
    });
});

server.get("/details/:id", (req, res) => {
  const { id } = req.params;

  axios
    .get(
      `https://www.googleapis.com/youtube/v3/videos?id=${id}&part=snippet,statistics&key=AIzaSyD5-SoOtrMC7q1klw3aNIOtfgROYvLImHk`
    )
    .then(function (response) {
      const snippets = {
        title: response.data.items[0].snippet.title,
        description: response.data.items[0].snippet.description,
        view: response.data.items[0].statistics.viewCount,
        like: response.data.items[0].statistics.likeCount,
        deslike: response.data.items[0].statistics.dislikeCount,
        id: response.data.items[0].id,
        embed: `https://www.youtube.com/embed/${id}`,
      };

      return res.render("details.html", { detail: snippets });
    });
});
server.listen(3000);
