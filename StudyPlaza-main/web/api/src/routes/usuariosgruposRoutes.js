const { Router } = require("express");

const mycontroller = require('../services/usuariosgruposServices');

const router = Router();


// ROTA PARA PEGAR TODOS OS GRUPOS QUE O USUARIO PARTICIPA
router.get('/todosgruposusuarioparticipa/:id', (req, res) => mycontroller.todosgruposusuarioparticipa(req, res));

// ROTA PARA VERIFICAR O PAPEL DO USUÁRIO
router.get(
    '/papel/:id_usuario/:id_grupo',
    (req, res) => mycontroller.buscarPapelUsuario(req, res)
);

router.get(`/`, (req, res) => { mycontroller.get(req, res) });
router.get(`/:id`, (req, res) => { mycontroller.getByid(req, res) });
router.post(`/`, (req, res) => { mycontroller.post(req, res) });
router.put(`/:id`, (req, res) => { mycontroller.put(req, res); });
router.delete(`/:id_grupo/:id`, (req, res) => { mycontroller.erase(req, res); });

module.exports = router;
