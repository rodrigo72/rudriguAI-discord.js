const openai = require('./api.js')

async function createCompletion (model, prompt, stopword, limit) {
  try {
        const prompt_prepared = prompt + stopword;
        const response = await openai.createCompletion({
            model: model,
            prompt: prompt_prepared,
            max_tokens: limit
        })

        return response;
    } catch (err) {
        throw err;
    }
}

module.exports = createCompletion;