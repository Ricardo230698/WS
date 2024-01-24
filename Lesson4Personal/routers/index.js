const express = require('express');
const router = express.Router();

router.use('/contacts', require('./contacts'));
router.use('/', require('./swagger'));

// routes.use(
//     '/',
//     (docData = (req, res) => {
//       let docData = {
//         documentationURL: 'https://nathanbirch.github.io/nathan-byui-api-docs',
//       };
//       res.send(docData);
//     })
// );

module.exports = router;
// export default router;