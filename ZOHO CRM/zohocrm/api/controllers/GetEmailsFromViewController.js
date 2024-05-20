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
    const per_page = req.query.per_page; // This won't be much needed since we'll just get the default which is 200
    let page_token = req.query.page_token; // Waiting to be assigned a value after the end of each loop
    let page;

    // Construct the request URL
    const baseURL = 'https://www.zohoapis.com/crm/v6';
    let requestUrl;

    // Number of API calls per day
    // We'll get 1000 records per day
    const apiCalls = 5;

    // Define the variable that will be used to store the IDs from the response later
    let ids = [];

    // This FOR loop will use the getView service (axios) based on the number of 'apiCalls'
    for (let index = 0; index < apiCalls; index++) {      
      try {
        // Prepare the URL
        requestUrl = `${baseURL}/${moduleApiName}?cvid=${viewId}&fields=Email`;
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
        const view = await ZohoAPIService.getView(requestUrl, {
          headers: {
            'Authorization': `Zoho-oauthtoken ${authToken}`
          }
        });
    
        console.log(view.status);
        // console.log(view.data.data);
        console.log(view.data.info);
    
        // Save the records from the custom view to an array (but only their IDs)
        view.data.data.forEach(contact => {
            ids.push(contact.id);
        });

        // This is meant to happen at the end of each repetition
        // We'll aggin to the variable 'page_token' the value that we get from the response (view)
        page = null;
        page_token = view.data.info.next_page_token;
        console.log(page_token)

        // En la última repetición del FOR loop, se debe mandar el return en caso de éxito
        if (index === 4 && view.status === 200) {
          return { ids, page_token };
          // return res.ok({ message: 'Work done successfully' });
        }
      } catch (error) {
        // console.error('Error fetching custom view by ID: ', error.response);
        console.error('Error fetching custom view by ID: ', error.response);
        return res.serverError({ error: 'An unexpected error occurred.' });
      }
    }
    // Aquí termina el ciclo FOR
  },
  
  // A continuación, voy a crear una nueva funcion donde la primera cosa que haré será pasar la función getCustomViewById(req, res) y guardar el resultado en una variable, esperando que aquella función getCustomById me devuelva la lista de IDs ... y luego construir la logica para desbloquear aquellos emails
  async getEmailsAndUnblockThem(req, res) {
    let ids = await module.exports.getCustomViewById(req, res);

    // Importa el módulo csv-writer (para guardar la info de los emails que no pudieron ser desbloqueados en un file)
    const createCsvWriter = require('csv-writer').createObjectCsvWriter;
    
    // Array para poner la info que irá en el file mentioned right above
    let arrayForCSV = [];

    // Define la configuración para el escritor CSV
    const csvWriter = createCsvWriter({
      path: 'output2.csv', // Nombre del archivo CSV de salida
      header: [
        {id: 'id', title: 'ID'},
        {id: 'reason', title: 'Reason'},
        // Agrega aquí los encabezados para tus columnas de datos
      ]
    });

    // Divide the original array into two arrays of 500 items each
    const firstHalf = ids.ids.slice(0, 500);
    const secondHalf = ids.ids.slice(500);

    console.log(firstHalf);
    console.log(secondHalf);

    // Now, unblock emails for the retrieved IDs
    // We'll use a FOR loop to make 2 repetitions, or, in other words, two calls to the 'API unblock-email'
    // We have to make these 2 repetitions because we can pass up to 500 emails in a single API call and we're trying to unblock 1000 records daily.
    for (let index = 0; index < 2; index++) {
      // I will use 2 IF statements, each one with its own API call.
      // I have to do it this way because I only want to 'return' something in the 2nd (last) API call. Otherwise, if I were to 'return' something in the 1st API call, then, the FOR loop will stop and finish its execution

      // Para el primer bunch of emails:
      if (index == 0) {
        // ¡IMPORTANTE! --> Es importante entender la lógica que tiene esta API de Zoho CRM, para así comprender mejor cuándo se entrará al catch o, caso contrario, cuándo se ejecutará todo lo del try:
          // - Se ejecutará todo lo que se haya dentro del siguiente TRY cuando AL MENOS haya un email que se pueda desbloquear dentro del primer bunch que le pasamos. En ese caso, el CATCH se ignorará por completo
          // - Se ejecutará todo lo que se haya dentro del CATCH cuando TODOS los emails que pasamos en el primer bunch NO se puedan desbloquear por alguna u otra razón.
        try {
          const zohoResponse = await axios.post("https://www.zohoapis.com/crm/v6/Contacts/actions/unblock_email", {
                "unblock_fields": [
                    "Email",
                ],
                "ids": firstHalf
              }, {
                "headers": {
                  Authorization: `Zoho-oauthtoken ${req.headers.authorization}`
                }
              }
          )
          // -------------------------------------
          console.log(zohoResponse.data);
          zohoResponse.data.data.forEach(element => {
            console.log(element.details);
          });
          // -------------------------------------
          // Hacemos lo de a continuación para que  se muestre solo el ID y el mensaje de aquellos emails que por alguna u otra razón no pudieron ser desbloqueados
          zohoResponse.data.data.forEach(element => {
            // Es importante checar que 'json.path' existe dentro de 'element.details' ya que cuando un item (email) sí puede ser desbloqueado, tal no será el caso y tendremos un error.
            if(element.details.json_path) {
              let numero = element.details.json_path.match(/\d+/);
              sails.log.error('ID could not be unblocked:', firstHalf[parseInt(numero[0])], '- Reason:', element.message);
              // The following process is to save the info in the arrayForCSV array
              let lineForArray = { id: firstHalf[parseInt(numero[0])], reason: element.message };
              arrayForCSV.push(lineForArray);
            }
          });
        } catch (error) {
          error.response.data.data.forEach(element => {
            // Es importante checar que 'json.path' existe dentro de 'element.details' ya que cuando un item (email) sí puede ser desbloqueado, tal no será el caso y tendremos un error.
            if(element.details.json_path) {
              let numero = element.details.json_path.match(/\d+/);
              sails.log.error('ID could not be unblocked:', firstHalf[parseInt(numero[0])], '- Reason:', element.message);
              // The following process is to save the info in the arrayForCSV array
              let lineForArray = { id: firstHalf[parseInt(numero[0])], reason: element.message };
              arrayForCSV.push(lineForArray);
            }
          });
        }
      }

      // Para el segundo bunch of emails:
      if (index == 1) {
        // ¡IMPORTANTE! --> Es importante entender la lógica que tiene esta API de Zoho CRM, para así comprender mejor cuándo se entrará al catch o, caso contrario, cuándo se ejecutará todo lo del try:
          // - Se ejecutará todo lo que se haya dentro del siguiente TRY cuando AL MENOS haya un email que se pueda desbloquear dentro del segundo bunch que le pasamos. En ese caso, el CATCH se ignorará por completo
          // - Se ejecutará todo lo que se haya dentro del CATCH cuando TODOS los emails que pasamos en el segundo bunch NO se puedan desbloquear por alguna u otra razón.
        try {
          const zohoResponse = await axios.post("https://www.zohoapis.com/crm/v6/Contacts/actions/unblock_email", {
                "unblock_fields": [
                    "Email",
                ],
                "ids": secondHalf
              }, {
                "headers": {
                  Authorization: `Zoho-oauthtoken ${req.headers.authorization}`
                }
              }
          )
          // -------------------------------------
          console.log(zohoResponse.data);
          zohoResponse.data.data.forEach(element => {
            console.log(element.details);
          });
          // -------------------------------------
          // Hacemos lo de a continuación para que  se muestre solo el ID y el mensaje de aquellos emails que por alguna u otra razón no pudieron ser desbloqueados
          zohoResponse.data.data.forEach(element => {
            // Es importante checar que 'json.path' existe dentro de 'element.details' ya que cuando un item (email) sí puede ser desbloqueado, tal no será el caso y tendremos un error.
            if(element.details.json_path) {
              let numero = element.details.json_path.match(/\d+/);
              sails.log.error('ID could not be unblocked:', secondHalf[parseInt(numero[0])], '- Reason:', element.message);
              // The following process is to save the info in the arrayForCSV array
              let lineForArray = { id: secondHalf[parseInt(numero[0])], reason: element.message };
              arrayForCSV.push(lineForArray);
            }
          });
          // Aquí sí tiene sentido usar el return ya que después no queremos ejecutar nada más
          csvWriter
            .writeRecords(arrayForCSV)
            .then(() => console.log('CSV file written successfully'));
          console.log(ids.page_token);
          return res.ok({ message: 'The work has finished.' });
        } catch (error) {
          // Hacemos lo de a continuación para que  se muestre solo el ID y el mensaje de aquellos emails que por alguna u otra razón no pudieron ser desbloqueados
          error.response.data.data.forEach(element => {
            // Es importante checar que 'json.path' existe dentro de 'element.details' ya que cuando un item (email) sí puede ser desbloqueado, tal no será el caso y tendremos un error.
            if(element.details.json_path) {
              let numero = element.details.json_path.match(/\d+/);
              sails.log.error('ID could not be unblocked:', secondHalf[parseInt(numero[0])], '- Reason:', element.message);
              // The following process is to save the info in the arrayForCSV array
              let lineForArray = { id: secondHalf[parseInt(numero[0])], reason: element.message };
              arrayForCSV.push(lineForArray);
            }
          });
          csvWriter
            .writeRecords(arrayForCSV)
            .then(() => console.log('CSV file written successfully'));
          console.log(ids.page_token);
          // Aquí sí tiene sentido usar el return ya que después no queremos ejecutar nada más
          return res.serverError({ error: 'An unexpected error occurred.' });          
        }
      }
    }  
  }
};
