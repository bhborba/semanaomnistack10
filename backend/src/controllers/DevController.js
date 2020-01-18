const axios = require('axios');
const Dev = require('../models/Dev');
const parseStringAsArray = require('../utils/parseStrinAsArray');
const { findConnections, sendMessage } = require('../websocket');

module.exports = {
    async index(req,res){
        const devs = await Dev.find();

        return res.json(devs);
    },

    async store (req, res) {
        const { github_username, techs, latitude, longitude } = req.body;
    
        let dev = await Dev.findOne({ github_username });

        if (!dev){
            const apiResponse = await axios.get(`https://api.github.com/users/${github_username}`);
    
            const { name = login, avatar_url, bio  } = apiResponse.data;
        
            const techsArray = parseStringAsArray(techs);
        
            const location = {
                type: 'Point',
                coordinates: [longitude, latitude], 
            }
        
            dev =  await Dev.create({
                name, 
                avatar_url, 
                bio, 
                github_username,
                techs: techsArray,
                location,
            })

            //Filtrar as conexoes que estao no maximo ha 10km de distancia
            // e que o novo dev tenha pelo menos uma das tecnologias filtradas

            const sendSocketMessageTo = findConnections(
                { latitude, longitude },
                techsArray,
            )

            sendMessage(sendSocketMessageTo, 'new-dev', dev);
        }
    

        return res.json(dev);
    }
}