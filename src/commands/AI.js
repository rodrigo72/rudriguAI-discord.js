const User = require("../schemas/User.js");
const roles = require("../config/roles.js");
const limits = require("../config/limits.json");
const createCompletion = require("../createCompletion.js");
const processChoices = require("./processChoices.js");

module.exports = {
    name: "curie",
    description: "Gera uma resposta com o modelo curie",
    async execute (message, args, type, model, person) {
        const userID = message.author.id;
        let executeCommand = true;

        let userLimit;
        let tokenLimit;
        let modelIndex;

        switch (model) {
            case 'ada': {
                userLimit = limits.user.ada;
                tokenLimit = limits.token.ada;
                modelIndex = 0;
                break;
            }
            case 'curie': {
                userLimit = limits.user.curie;
                tokenLimit = limits.token.curie;
                modelIndex = 1;
                break;
            }
            case 'davinci': {
                userLimit = limits.user.davinci;
                tokenLimit = limits.token.davinci;
                modelIndex = 2;
                break;
            }
            default: {
                console.log(`Invalid model: ${model}`);
                return;
            }
        }

        try {

            const currentDate = new Date().setHours(0, 0, 0, 0);
            const user = await User.findOne({ userID });

            if (user) {

                const lastUpdatedDate = user.lastUpdated[modelIndex].setHours(0, 0, 0, 0);

                if (currentDate === lastUpdatedDate) {

                    if (user.usageCount[modelIndex] < userLimit || user.roles.LimitlessAI === roles.LimitlessAI) {
                        user.usageCount[modelIndex] = user.usageCount[modelIndex] + 1;
                        await user.save();
                    } else {
                        executeCommand = false;
                        message.channel.send(`Limite de uso do modelo *${model}* atingido. (${userLimit} por dia)`);
                    }

                } else {

                    user.usageCount[modelIndex] = 1;
                    user.lastUpdated[modelIndex] = currentDate;

                    await user.save();
                    console.log(`usageCount reset and incremented for user ${message.author.tag}`);
                }
            
            } else {
                let usageCountArr = [0, 0, 0];
                usageCountArr[modelIndex] = 1;
                await User.create({
                    userID: userID,
                    tag: message.author.tag,
                    usageCount: usageCountArr,
                })
                console.log(`New user ${message.author.tag} created`);
            }
        } catch (error) {
            executeCommand = false;
            console.log(`Error incrementing usageCount for user ${message.author.tag}:`, error);
        }

        if (executeCommand) {
            try {

                let result;
                let modelID;
                switch (model) {
                    case 'curie': {
                        modelID = process.env.CURIE_MODEL;
                        break;
                    }
                    case 'ada': {
                        if (person === 'rudrigu') {
                            console.log("rudrigu");
                            modelID = process.env.ADA_MODEL;
                        } else if (person === 'qara') {
                            console.log("qara");
                            modelID = process.env.ADA_MODEL_2;
                        } else if (person === 'bruno') {
                            console.log("bruno");
                            modelID = process.env.ADA_MODEL_3;
                        } else if (person === 'gonçalo') {
                            console.log("gonçalo");
                            modelID = process.env.ADA_MODEL_4;
                        } else if (person === 'miguel') { 
                            console.log("miguel");
                            modelID = process.env.ADA_MODEL_5;
                        } else if (person === 'sofia') {
                            console.log("sofia");
                            modelID = process.env.ADA_MODEL_6;
                        } else if (person === 'adriana') { 
                            console.log("adriana");
                            modelID = process.env.ADA_MODEL_7;
                        } else if (person === 'rui') {
                            console.log("rui");
                            modelID = process.env.ADA_MODEL_8;
                        } else if (person === 'mi') {
                            console.log("mi");
                            modelID = process.env.ADA_MODEL_9;
                        } else if (person === 'lcr') { 
                            console.log("lcr");
                            modelID = process.env.ADA_MODEL_10;
                        } else {
                            console.log("invalid person");
                            return;
                        }
                        break;
                    }
                    case 'davinci': {
                        modelID = process.env.DAVINCI_MODEL;
                        break;
                    }
                    default: {
                        console.log(`Invalid model: ${model}`);
                        return;
                    }
                }

                let personName = ''; 
                let stopword = '';
                if (person === 'qara') {
                    personName = '[qaraAI] ';
                    stopword = '\n\n###\n\n';
                } else if (person === 'bruno') {
                    personName = '[brunoAI] ';
                    stopword = ' ->';
                } else if (person === 'gonçalo') {
                    personName = '[gonçaloAI] ';
                    stopword = '\n\n###\n\n';
                } else if (person === 'miguel') {
                    personName = '[miguelAI] ';
                    stopword = '\n\n###\n\n';
                } else if (person === 'sofia') {
                    personName = '[sofiaAI] ';
                    stopword = '\n\n###\n\n';
                } else if (person === 'adriana') {
                    personName = '[adrianaAI] ';
                    stopword = ' ->';
                } else if (person === 'rui') {
                    personName = '[ruiAI] ';
                    stopword = '\n\n###\n\n';
                } else if (person === 'lcr') {
                    personName = '[lcrAI] ';
                    stopword = '\n\n###\n\n';
                } else if (person === 'mi') {
                    personName = '[miAI] ';
                    stopword = '\n\n###\n\n';
                } else {
                    personName = '[rudriguAI] ';
                    stopword = '\n\n###\n\n';
                }

                result = await createCompletion(modelID, args.join(" "), stopword, tokenLimit);
                const processedResult = processChoices(result.data.choices[0].text);

                switch (type) {
                    case 'complete': {
                        console.log('complete message sent');
                        message.reply(personName + processedResult);
                        break;
                    }
                    case 'normal': {
                        console.log('normal message sent');
                        message.reply(personName + processedResult.split('\n')[0]);
                        break;
                    }
                    default: {
                        console.log(`Invalid type: ${type}`);
                        return;
                    }
                }

            } catch (err) {
                console.error("Error creating completion: " + err);
                message.channel.send("someone tell rudrigu there is a problem with my AI");
            }
        }
    }
}