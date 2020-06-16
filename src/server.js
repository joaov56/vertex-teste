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
  console.log(req.body);
  console.log(search);

  const request = axios
    .get(
      // `https://www.googleapis.com/youtube/v3/search?part=id,snippet&q=${search}&key=AIzaSyCS65b-b2oEcoNm0UrshftNAlG-cYlHztA`
      `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&order=viewCount&pageToken=CAoQAA&q=${search}&type=video&key=AIzaSyCS65b-b2oEcoNm0UrshftNAlG-cYlHztA`
    )
    .then(function (response) {
      const snippets = response.data.items.map((item) => ({
        id: item.id.videoId,
        snippet: {
          title: item.snippet.title,
          description: item.snippet.description,
          thumbnails: item.snippet.thumbnails.medium.url,
        },
      }));

      return res.render("search-results.html", { videos: snippets });
    })
    .catch((error) => {
      console.log(error);
    });
});

server.listen(3000);
