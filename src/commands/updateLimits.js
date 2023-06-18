const limits = require('../config/limits.json');
const fs = require('fs');
const path = require('path');
const User = require('../schemas/User.js');
const roles = require('../config/roles.js');

module.exports = {
    name: "update limits",
    description: "Atualizar limites",
    async execute (message, args) {
        if (args.length !== 3) {
            message.channel.send("Argumentos insuficientes");
            return;
        }

        let model;
        if (args[0] === 'ada' || args[0] === 'a') {
            model = "ada";
        } else if (args[0] === 'curie' || args[0] === 'c') {
            model = "curie";
        } else if (args[0] === 'davinci' || args[0] === 'd') {
            model = "davinci";
        } else {
            message.channel.send("Modelo inválido");
            return;
        }

        const userID = message.author.id;
        const user = await User.findOne({ userID });
        if (!(user && user.roles.Admin === roles.Admin)) {
            message.channel.send("não");
            return;
        }

        try {
            if (args[1] === 'user' || args[1] === 'u') {
                limits.user[model] = parseInt(args[2]);
                message.channel.send(`User limit do modelo *${model}* atualizado para ${args[2]}`);
            } else if (args[1] === 'token' || args[1] === 't') {
                limits.token[model] = parseInt(args[2]);
                message.channel.send(`Token limit do modelo *${model}* atualizado para ${args[2]}`);
            }
        }
        catch (err) {
            console.log(err);
            message.channel.send("Argumentos inválidos");
            return;
        }

        try {
            fs.writeFile(path.join(__dirname, '..', 'config', 'limits.json'), JSON.stringify(limits, null, 2), (err) => {
              if (err) {
                console.error('Erro ao atualizar o ficheiro JSON:', err);
                message.channel.send("Erro ao atualizar o ficheiro JSON");
                return;
              }
              console.log('Ficheiro JSON atualizado com sucesso.');
            });
        } catch (err) {
            console.error('Erro ao atualizar os limites:', err);
            message.channel.send("pah, apanhei um erro qualquer");
        }

    }
}