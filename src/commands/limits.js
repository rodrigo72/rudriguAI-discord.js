const fs = require('fs');
const path = require('path');

module.exports = {
    name: "limits",
    description: "Lista de limites",
    async execute (message, EmbedBuilder) {

        const limitsPath = path.join(__dirname, '..', 'config', 'limits.json');
        fs.readFile(limitsPath, 'utf8', (err, data) => {
            if (err) {
                message.channel.send("Erro ao ler limits.json");
                return;
            }

            try {
                const limits = JSON.parse(data);

                const adaLimit = "**Ada**\n" + "User limit: " + limits.user.ada + " | Token limit: " + limits.token.ada;
                const curieLimit = "**Curie**\n" + "User limit: " + limits.user.curie + " | Token limit: " + limits.token.curie;
                // const davinciLimit = "**Davinci**" + "User limit: " + limits.user.davinci + " | Token limit: " + limits.token.davinci;
                const limitsDescription = adaLimit + '\n\n' + curieLimit;

                message.channel.send({
                    embeds: [new EmbedBuilder()
                                .setColor('#404574')
                                .setTitle(`Limites`)
                                .setDescription(limitsDescription)],
                });
            }
            catch (err) {
                console.log(err);
                message.channel.send("pah, um erro qualquer. apanhei-o num catch");
                return;
            }
        });

    }
}