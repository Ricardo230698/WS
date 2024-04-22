/**
 * CustomViewController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const ZohoAPIService = require("../services/ZohoAPIService");

module.exports = {
  async getCustomViewById(req, res) {
    const customViewId = req.params.customViewId;
    const moduleApiName = req.params.module;
    const authToken = req.headers.authorization;

    console.log(customViewId, moduleApiName, authToken);

    try {
        const customView = await ZohoAPIService.getCustomViewById(customViewId, moduleApiName, authToken);
        return res.json(customView.custom_views[0].fields);
    } catch (error) {
        console.error('Error fetching custom view by ID: ', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

};