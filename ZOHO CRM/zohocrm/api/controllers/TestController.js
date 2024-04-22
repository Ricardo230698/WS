/**
 * TestController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
    async unblockEmails(moduleApiName, ids, authToken) {
        try {
            // Prepare the input JSON for unblocking emails
            const inputJSON = {
                "unblock_fields": ["Email"],
                "ids": ids
            };
    
            // Make the POST request to unblock emails
            await axios.post(`https://www.zohoapis.com/crm/v6/${moduleApiName}/actions/unblock_email`, inputJSON, {
                headers: {
                    'Authorization': `Zoho-oauthtoken ${authToken}`,
                    'Content-Type': 'application/json'
                }
            });
        } catch (error) {
            console.error('Error unblocking emails: ', error);
            throw error;
        }
    }

};

