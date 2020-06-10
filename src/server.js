const express= require('express');
const axios = require('axios')

const server= express();


server.use(express.static("public"));

server.use(express.urlencoded({extended: true}))




const ytkey= 'AIzaSyAZXCvJRJIgbJyn1f-gRp3dW4E23oruE7A'



const nunjucks = require('nunjucks')
nunjucks.configure("src/views", {
    express: server,
    noCache: true
});


server.get('/', (req, res)=>{

    const request =axios.get(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&order=viewCount&pageToken=CAoQAA&q=ok%20dog&type=video&key=AIzaSyAZXCvJRJIgbJyn1f-gRp3dW4E23oruE7A`)
    .then(function(response){
        console.log(response.data.nextPageToken);
        for(var i = 1; i<=10; i++){           
            console.log(response.data.items[i]);
        }
        
        
        
    })

    return res.render("index.html")
  
       
    
})

server.listen(3000)