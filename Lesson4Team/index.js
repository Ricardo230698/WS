// En este projecto ya tengo todo practicamente funcionando, lo único que debo arreglar es lo siguiente:
// En la UI de la documentación (http://localhost:8080/api-docs/), estoy recibiendo errores cuando le doy a...
// "try it out". Pero ya descubrí cuál es el error: Si veo el documento de la documentación (swagger.json) veo que...
// cuando se autogeneró la documentación de API, en los parámetros de la ruta para actualizar (PUT), está pidiendo...
// actualizar por medio de un ID que se recibe por la ruta (url), lo cual no tiene sentido, ya que en ningún lado...
// me está dando la oportunidad para poner los nuevos datos... Debo corregir eso, tengo que fijarme en el codigo del...
// controlador, en la función de actualizar (UPDATE), ya q ahí que es el problema (si lo comparo con la función CREATE)...

// Actualización: EL PROJECTO ESTÁ FUNCIONANDO, EN LA UI (EN LA RUTA DE UPDATE) DEBO PONER EL ID DE MUCHOS NÚMEROS EN ...
// ... VEZ DEL CORTO (AUNQUE AÚN ASÍ NO ENTIENDO BIEN EL PROPÓSITO DE AQUELLO, PORQUE NO ACTUALIZA NADA, TALVEZ SOLO ...
// ... ESTÁ BIEN PARA FINES DE EJEMPLO Y YA).

// Actualización: PROBLEMA SOLUCIONADO TOTALMENTE

const express = require('express');
const cors = require('cors');
const app = express();

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

app
  .use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
  .use(cors())
  .use(express.json())
  .use(express.urlencoded({ extended: true }))
  .use('/', require('./routes'));

const db = require('./models');
db.mongoose
  .connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to the database!');
  })
  .catch((err) => {
    console.log('Cannot connect to the database!', err);
    process.exit();
  });

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
