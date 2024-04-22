module.exports = {

  friendlyName: 'Post',


  description: 'Post something.',


  inputs: {

  },

  exits: {

  },


  fn: async function (inputs) {

    // All done.

    var zocrmsdk = require('zocrmsdk');

    console.log("Hola mundo");

    var oData = {
      data: [{
        "name": 'Ricardo',
      }],
      trigger: []
    }
    var oInsertData = {
     
      module: "Contacts",
      body: oData
    }
    
    var oResponse = await zocrmsdk.API.MODULES.post(oInsertData)

    return ("Hola mundo 2");

  }


};
