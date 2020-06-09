const express= require('express');

const server= express();

server.get('/', ()=>{
    console.log("TO AQUI");
    
})

server.listen(3000)