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

//   async getCustomViewById(customViewId, moduleApiName, authToken) {
//     try {
//       const response = await axios.get(`https://www.zohoapis.com/crm/v5/settings/custom_views/${customViewId}?module=${moduleApiName}`, {
//         headers: {
//           'Authorization': `Zoho-oauthtoken ${authToken}`
//         }
//       });

//       return response.data;
//     } catch (error) {
//       throw error.response.data;
//     }
//   },

  async getViewById(viewId, moduleApiName, authToken) {
    try {
      const response = await axios.get(`https://www.zohoapis.com/crm/v6/${moduleApiName}?cvid=${viewId}&fields=Email`, {
        headers: {
          'Authorization': `Zoho-oauthtoken ${authToken}`
        }
      });

      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }

};