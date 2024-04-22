/**
 * EmailController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
    async unblockEmail(req, res) {
      try {
        // Extract necessary data from the request
        const { module_api_name, record_id } = req.params;
        const { unblock_fields } = req.body;
  
        // Validate the input
        if (!module_api_name || !record_id || !unblock_fields) {
          return res.badRequest({ error: 'Missing required fields' });
        }
  
        // Validate the module_api_name
        const supportedModules = ['leads', 'accounts', 'contacts', 'deals', 'quotes', 'salesorders', 'purchaseorders', 'invoices', 'cases', 'custom'];
        if (!supportedModules.includes(module_api_name)) {
          return res.badRequest({ error: 'Invalid module name' });
        }
  
        // Construct the request URL
        const baseUrl = 'https://www.zohoapis.com/crm/v6';
        let requestUrl = `${baseUrl}/${module_api_name}`;
        if (record_id) {
          requestUrl += `/${record_id}`;
        }
        requestUrl += '/actions/unblock_email';

        console.log(requestUrl);
  
        // Make the request to Zoho CRM API
        const zohoResponse = await ZohoAPIService.post(requestUrl, {
          unblock_fields
        }, {
          headers: {
            Authorization: `Zoho-oauthtoken ${req.headers.authorization}`
          }
        });

        //console.log(zohoResponse.data)
  
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
          return res.serverError({ error: 'Unexpected error occurred.' });
        }
      } catch (error) {
        // Handle unexpected errors
        sails.log.error('Error occurred:', error.response.data);
        return res.serverError({ error: 'An unexpected error occurred.' });
      }
    }
     
};

