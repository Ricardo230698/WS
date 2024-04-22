module.exports = {


  friendlyName: 'Update one',


  description: 'Update a policy',


  inputs: {
    id: {
      description: 'Id of the  policy',
      type: 'string',
      required: true
    },
    Renewal_Stage_2: {
      description: 'Renewal stage of the policy',
      type: 'string',
      required: true 
    },
    Processor_Update: {
      description: 'Quote criteria of the policy',
      type: 'string',
      required: true
    },
    Premium: {
      description: 'AOP Premium',
      type: 'number',
      required: true
    }, 
    Premium_2: {
      description: 'Wind Premium',
      type: 'number',
      required: true
    }, 
    TRIA_Premium: {
      description: 'TRIA Premium',
      type: 'number',
      required: true
    },
    Other_Premium: {
      description: 'Other Premium',
      type: 'number',
      required: true
    },
    Policies_UW: {
      description: 'Underwriter',
      type: 'string',
      required: true
    }

  },


  exits: {
    notFound: {
      description: 'No policy with the specified ID was found in the database.',
      responseType: 'notFound'
    }
  },


  fn: async function (inputs) {

    var zocrmsdk = require('zocrmsdk');

    var oData = {
      // inputs
      data: [inputs],
      // send a empty list for not activate the workflows
      trigger: []
    }

    console.log(oData);

    var updatePolicy = {
      module: "Quotes", // name of the module
      body: oData // data to update
    }

    console.log(updatePolicy.body);
  
    var policyUpdated = await zocrmsdk.API.MODULES.put(updatePolicy);

    console.log(policyUpdated.body);

    // All done.
    return;

  }

};

  //actualizar:
  
  // renewal stage / API Name: "Renewal_Stage_2"
  // quote criteria / API Name: "Processor_Update"
  // premium:
     // AOP Premium / API Name: "Premium"
     // Wind Premium / API Name: "Premium_2"
     // TRIA Premium / API Name: "TRIA_Premium"
     // Other Premium / API Name: "Other_Premium"
  // premium de location:
    // AOP Premium / API Name: "AOP_Premium_2"
    // Wind Premium / API Name: "Wind_Premium_2	"
  // underwriter / API Name: "Policies_UW" (me pomgo a mi)