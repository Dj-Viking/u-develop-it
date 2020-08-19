const express = require('express');
const router = express.Router();

//routing the api to candidatesRoutes
router.use(require('./candidateRoutes.js'));

//routing the api to partyRoutes
router.use(require('./partyRoutes.js'));

//routing the api to voterRoutes
router.use(require('./voterRoutes.js'));

//routing the api to voteRoutes
router.use(require('./voteRoutes.js'));

module.exports = router;