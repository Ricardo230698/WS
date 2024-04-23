/**
 * GetEmailsFromViewCustomViewController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const ZohoAPIService = require("../services/ZohoAPIService");
const axios = require('axios');

module.exports = {
  async getCustomViewById(req, res) {
    // Get the needed parameters to construct the request URL
    const viewId = req.params.viewId;
    const moduleApiName = req.params.module;
    const authToken = req.headers.authorization;
    const per_page = req.query.per_page;
    const page_token = req.query.page_token;
    const page = req.query.page;

    // Construct the request URL
    // `https://www.zohoapis.com/crm/v6/${moduleApiName}?cvid=${viewId}&fields=Email`
    const baseURL = 'https://www.zohoapis.com/crm/v6';
    let requestUrl = `${baseURL}/${moduleApiName}?cvid=${viewId}&fields=Email`;
    if (page) {
      requestUrl += `&page=${page}`;
    }
    if (per_page) {
      requestUrl += `&per_page=${per_page}`;
    }
    if (page_token) {
      requestUrl += `&page_token=${page_token}`;
    }

    console.log(viewId, moduleApiName, authToken);
    console.log(requestUrl);

    // Execute the function to get the records from the custom view
    try {
      const view = await ZohoAPIService.getView(requestUrl, {
        headers: {
          'Authorization': `Zoho-oauthtoken ${authToken}`
        }
      });

      console.log(view.data.data);
      console.log(view.data.info);

      // Save the records from the custom view to an array (but only their IDs)
      let ids = [];
      view.data.data.forEach(contact => {
          ids.push(contact.id);
      });
      console.log(ids);

      // Now, unblock emails for the retrieved IDs
      try {
        const zohoResponse = await axios.post("https://www.zohoapis.com/crm/v6/Contacts/actions/unblock_email", {
              "unblock_fields": [
                  "Email",
              ],
              "ids": ids
            }, {
              "headers": {
                Authorization: `Zoho-oauthtoken ${authToken}`
              }
            }
        )
        // Handle Zoho CRM API response
        if (zohoResponse.status === 200) {
          return res.ok({ message: 'Emails unblocked successfully' });
        } else if (zohoResponse.status === 400) {
        // Handle specific error cases
        // You may need to parse Zoho's error response for detailed error messages
        // For simplicity, I'm returning a generic error message
          return res.badRequest({ error: 'Failed to unblock emails. Please check your request.' });
        } else if (zohoResponse.status === 401) {
            return res.unauthorized({ error: 'Unauthorized. Authentication failed.' });
        } else if (zohoResponse.status === 404) {
            return res.notFound({ error: 'Zoho API endpoint not found.' });
        } else if (zohoResponse.status === 500) {
            return res.serverError({ error: 'Internal Server Error. Please contact support.' });
        } else {
            console.log(zohoResponse.data.data);
            return res.serverError({ error: 'Unexpected error occurred.' });
        }
      } catch (error) {
        // Handle unexpected errors
        sails.log.error('Error occurred:', error.response.data);
        return res.serverError({ error: 'An unexpected error occurred.' });          
      }
    } catch (error) {
      console.error('Error fetching custom view by ID: ', error.response);
    }
  }
};