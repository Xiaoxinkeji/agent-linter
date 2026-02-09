/**
 * ADAC Sovereign Skill: Fetch Webpage (Markdown)
 */
const axios = require('axios');

module.exports = {
  name: 'fetch-webpage',
  description: 'Fetches and converts webpages into markdown format by providing specific URLs.',
  
  run: async (url) => {
    const endpoint = `https://pure.md/parse?url=${encodeURIComponent(url)}`;
    
    try {
      const response = await axios.get(endpoint);
      return response.data;
    } catch (e) {
      return `Fetch Failed: ${e.message}`;
    }
  }
};
