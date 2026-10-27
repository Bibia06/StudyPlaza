const { Router } = require("express") ;

const mycontroller = require('../services/mensagensServices');

const router = Router();

router.get(
    '/grupo/:grupoId',
    (req,res)=> mycontroller.getByGrupo(req,res)
);
router.get( `/` ,  (req,res) => { mycontroller.get( req,res ) } );
router.get( `/:id` , (req,res) => { mycontroller.getByid( req,res ) } );
router.post( `/` , (req,res) =>{ mycontroller.post( req,res ) } );
router.put( `/:id` , (req,res) => {  mycontroller.put(req,res); });
router.delete( `/:id`, (req,res) => { mycontroller.erase(req,res); });


module.exports = router ;
