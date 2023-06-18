module.exports = {
    name: "help",
    description: "Lista de comandos",
    async execute (message, EmbedBuilder) {

        const curieDescription = `- **!curie** <text> - resposta curta (ou !c)\n- **!curie_complete** <text> - resposta completa (ou !cc)`;
        const adaDescription = `- **!ada** <text> - resposta curta (ou !a)\n- **!ada_complete** <text> - resposta completa (ou !ac)\n- **!ada_qara** <text> (ou !aq, !aqc) para usar o *qaraAI*`;
        const davinciDescription = `- **!davinci** <text> - resposta curta (ou !d)\n- **!davinci_complete** <text> - resposta completa (ou !dc)`;
        const description = curieDescription + '\n\n' + adaDescription;

        message.channel.send({
            embeds: [new EmbedBuilder()
                        .setColor('#404574')
                        .setTitle(`Comandos`)
                        .setDescription(description)],
        });
    }
}