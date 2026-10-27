const { Router } = require("express") ;

const mycontroller = require('../services/usersService');

const router = Router();

router.get( `/` ,  (req,res) => { mycontroller.get( req,res ) } );
router.get( `/:id` , (req,res) => { mycontroller.getByid( req,res ) } );
router.post( `/` , (req,res) =>{ mycontroller.post( req,res ) } );
router.put( `/:id` , (req,res) => {  mycontroller.put(req,res); });
router.delete( `/:id`, (req,res) => { mycontroller.erase(req,res); });


module.exports = router ;
