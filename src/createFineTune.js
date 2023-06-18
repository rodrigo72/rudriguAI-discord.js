const openai = require('./api.js');

async function createFineTune() {
    try {
        const response = await openai.createFineTune({
            training_file: 'file id',
            model: 'babbage',
        })
        console.log('response: ', response);
  } catch (err) {
        console.log('error: ', err.response.data.error);
  }
}

createFineTune();