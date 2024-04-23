// api/services/ZohoAPIService.js

const axios = require('axios');

module.exports = {
  // async post(url, data, options = {}) {
  //   try {
  //     const response = await axios.post(url, data, options);
  //     return response;
  //   } catch (error) {
  //     throw error;
  //   }
  // },

  async getView(url, options) {
    try {
      const response = await axios.get(url, options);
      return response;
    } catch (error) {
      throw error;
    }
  }

};