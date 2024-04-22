module.exports = {


  friendlyName: 'Get',


  description: 'Get policy by ID',


  inputs: {
    policyID: {
      description: 'The ID of the policy to look up.',
      // By declaring a numeric example, Sails will automatically respond with res.badRequest
      // if the policyId parameter is not a number.
      type: 'string',
      // By making the userId parameter required, Sails will automatically respond with
      // res.badRequest if it's left out.
      required: true
    }
  },

  exits: {
    notFound: {
      description: 'No user with the specified ID was found in the database.',
      responseType: 'notFound'
    }
  },


  fn: async function ({policyID}) {

    // All done.

    var zocrmsdk = require('zocrmsdk');

    // zocrmsdk.initialize();

    console.log("Hola mundo");

    var input = {};
    input.id = 	policyID // id: record-id
    input.module = 'Quotes';

    console.log(input);
    console.log(policyID);

    var response = await zocrmsdk.API.MODULES.get(input);

    console.log(response);

    return;

    // 1000.bf6e0c1201b4abd247eb037c39b5af59.6c7ece9930aa631e8d73c18c7f0c87c1
    // https://accounts.zoho.com/oauth/v2/token?refresh_token=1000.6e3d6a1a23362d9bda3c503eaca2c9e6.40ccef43a25303af56be043b40490ce6&client_id=1000.0S9NOIGLP6IFA1O3GH15Z4PQ463DSB&client_secret=a6b7d7a20f72516bb5801956a7cd5e48d9edb00c90&grant_type=refresh_token
  }

};