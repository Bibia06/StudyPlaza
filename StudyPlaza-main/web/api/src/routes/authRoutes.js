const { Router } = require("express") ;

const mycontroller = require('../services/authServices');

const router = Router();

router.post( `/` ,  (req,res) => { mycontroller.login( req,res ) } );


module.exports = router ;