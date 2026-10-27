const { Router } = require("express");
const mycontroller = require('../services/gruposServices');

const router = Router();

router.get('/', (req, res) => mycontroller.get(req, res));

// ROTA ADICIONAL PARA PEGAR TODOS OS GRUPOS COM SEUS MEMBROS:
router.get('/comMembros', (req, res) => mycontroller.comMembros(req, res));

// ROTA ADICIONAL PARA PEGAR TODOS OS GRUPOS DE UM USUÁRIO:
router.get('/todosgruposusuario/:criado_por', (req, res) => mycontroller.todosgruposusuario(req, res));

// ROTA PARA SABER QUANTOS GRUPO EXISTEM:
router.get('/totalGrupos', (req, res) => mycontroller.totalGrupos(req, res));

// ROTA PARA SABER QUANTOS GRUPOS ATIVOS O USUÁRIO POSSUI:
router.get('/gruposAtivosUsuario/:id_usuario', (req, res) => mycontroller.gruposAtivosUsuario(req, res));

// ROTA PARA PEGAR MEMBROS DE UM GRUPO
router.get('/membros/:id', (req, res) => mycontroller.membrosDoGrupo(req, res));

router.get('/:id', (req, res) => mycontroller.getByid(req, res)); // rota genérica sempre por último
router.post('/', (req, res) => mycontroller.post(req, res));
router.put('/:id', (req, res) => mycontroller.put(req, res));
router.delete('/:id', (req, res) => mycontroller.erase(req, res));


module.exports = router;
