const express= require('express');
const axios = require('axios')

const server= express();



server.use(express.json());

server.use(express.static("public"));

server.use(express.urlencoded({extended: true}))




const ytkey= 'AIzaSyAZXCvJRJIgbJyn1f-gRp3dW4E23oruE7A'



const nunjucks = require('nunjucks')
nunjucks.configure("src/views", {
    express: server,
    noCache: true
});


server.get('/', async (req, res)=>{

    return res.render("index.html") 
          
})


server.post('/send',  (req,res)=>{
    const search= req.body.search
    const request = axios.get(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&order=viewCount&pageToken=CAoQAA&q=${search}%20dog&type=video&key=AIzaSyCS65b-b2oEcoNm0UrshftNAlG-cYlHztA`)
    .then(function(response){
        
        const pageToken= response.data.nextPageToken; 
        
        for(var i = 1; i<=10; i++){           
            const title = [response.data.items[i].snippet.title]
             

            
            console.log(title[0]);
        }

        
        
        

    })
    .catch(error => {
        console.log(error)
      })

    
      console.log(request);
      
    

    return res.render('search-results.html', )


})

server.listen(3000)