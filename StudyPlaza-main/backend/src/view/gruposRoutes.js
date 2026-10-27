import { Router } from "express";
import * as mycontroller from "../controller/gruposController.js"

const pointName = mycontroller.getTableName() || 'grupos';

const endPoint = `/${pointName}`;

const router = Router();

router.get( `${endPoint}`, (req,res)=>{ mycontroller.Get(req,res) });
router.get( `${endPoint}/totalGrupos`, (req,res)=>{ mycontroller.GettotalGrupos(req,res) });
router.get( `${endPoint}/:id`, (req,res)=>{ mycontroller.GetById(req,res) });
router.get( `${endPoint}/theFromUser/:id`, (req,res)=>{ mycontroller.GetByGruposDoUser(req,res) });

router.delete( `${endPoint}/:id`, (req,res)=>{ mycontroller.Delete(req,res) });
router.post(`${endPoint}`,(req,res) => { mycontroller.Post(req,res)});
router.put(`${endPoint}/:id`, (req,res) => { mycontroller.Put(req,res)} );
export default router;