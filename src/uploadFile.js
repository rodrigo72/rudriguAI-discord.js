const openai = require('./api.js');
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'data', 'data_prepared.jsonl');

async function upload() {
  try {
        const response = await openai.createFile(
            fs.createReadStream(filePath),
            'fine-tune'
        );
        console.log('File ID: ', response.data.id)
    } catch (err) {
        console.log('err: ', err)
    }
}

upload();