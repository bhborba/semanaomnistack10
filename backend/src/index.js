const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const routes = require('./routes');
const { setupWebsocket } = require('./websocket')

const app = express();
const server = http.Server(app); 

setupWebsocket(server);

mongoose.connect('mongodb+srv://bolsolula:bolsolula@cluster0-6jear.mongodb.net/week10?retryWrites=true&w=majority',{
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

app.use(cors());
app.use(express.json());
app.use(routes);


// Médotods HTTP: GET, POST, PUT, DELETE

// Tipos de Parâmetros:

//Query Params: req.query (Filtros, ordenação, paginação, ...)
//Route Params: req.params (Identificar um recurso na alteração ou remoção)
//Body: req.body (Dados para criação ou alteração de um registro)


server.listen(3333);