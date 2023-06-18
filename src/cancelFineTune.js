const axios = require('axios');

const cancelFineTuning = async () => {
  const fineTuningId = '';
  const apiKey = module.exports.OPENAI_API_KEY;

  try {
    const response = await axios.post(
      `https://api.openai.com/v1/fine-tunes/ft-HoBdpGZCA3VQTuLTQn7FlqNa/cancel`,
      {},
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`
        }
      }
    );

    console.log('Fine-tuning process canceled:', response.data);
  } catch (error) {
    console.error('Error canceling fine-tuning process:', error.response.data);
  }
};

cancelFineTuning();
