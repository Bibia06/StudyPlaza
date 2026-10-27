const { conectar, desconectar } = require('../database/config');

const tableName = "usuarios_grupos";

const get = async (req, resp) => {
  const connection = await conectar();
  try {
    const [rows, fields] = await connection.execute(`SELECT * FROM ${tableName} order by id_usuario desc`);
    resp.status(201).send(rows);
  } catch (err) {
    console.error('Erro ao executar a consulta:', err);
  } finally {
    desconectar(connection);
  }
}

// 2. rota  = GETbyid == select * from tabela where id = ?id == Read
const getByid = async (req, resp) => {
  const idValue = req.params.id;
  const connection = await conectar();
  try {
    const [rows, fields] = await connection.execute(`SELECT * FROM ${tableName} WHERE id_usuario = ${idValue}`);
    resp.send(rows);
  } catch (err) {
    console.error('Erro ao executar a consulta:', err);
  } finally {
    desconectar(connection);
  }
}

// 3.rota  = POST
const post = async (req, res) => {
  const dataPayload = req.body;
  const campos = Object.keys(dataPayload);
  const valores = Object.values(dataPayload);
  let comando = '';
  const connection = await conectar();
  try {
    comando = `INSERT INTO ${tableName} (${campos.join(', ')}) VALUES ("${valores.join('", "')}")`;
    const result = await connection.execute(comando);
    res.status(201).send(result);
  } catch (error) {
    res.status(401).send({ 'message': error.message, 'sucess': 'error' });
  } finally {
    desconectar(connection);
  }
}

// 4.rota  = PUT = UPDATE
async function put(req, res) {
  // const { titulo, cargaHoraria, professores_id } = req.body ;
  const id = req.params.id;
  const dataPayload = req.body;
  const campos = Object.keys(dataPayload);
  const valores = Object.values(dataPayload);
  let comando = '';

  const connection = await conectar();
  try {

    let comando = '';
    comando = `UPDATE ${tableName} SET `;
    comando += campos.map((campo, i) => `${campo} = "${valores[i]}"`).join(', ');
    comando += ` WHERE id_usuario = ${id}`;
    const result = await connection.execute(comando);
    res.status(202).send(result);
  } catch (error) {
    res.status(401).send({ 'message': error.message, 'sucess': 'error' });
  } finally {
    desconectar(connection);

  }
}

// 4.rota  = DELETE
const erase = async (req, res) => {
  const id = req.params.id;
  const id_grupo = req.params.id_grupo;

  const connection = await conectar();
  try {    
    const result = await connection.execute(`DELETE FROM ${tableName} WHERE id_grupo = ${id_grupo} AND id_usuario = ${id}`);
    res.status(204).send(result);
  } catch (error) {
    res.status(508).send({ "message": "Erro executar a solicitação!", sucess: false })
  } finally {
    desconectar(connection);
  }
}

// ======================================
// TODOS OS GRUPOS QUE USUARIO PARTICIPA
// ======================================

const todosgruposusuarioparticipa = async (req, res) => {

  const idValue = req.params.id;
  const connection = await conectar();
  try {
    const [rows] = await connection.execute(`
          SELECT
              g.id,
              g.nome,
              g.descricao,
              g.ativo,
              ug.papel,
              COUNT(ug2.id_usuario) AS membros
          FROM usuarios_grupos ug
          INNER JOIN grupos g
              ON g.id = ug.id_grupo
          LEFT JOIN usuarios_grupos ug2
              ON ug2.id_grupo = g.id
          WHERE ug.id_usuario = ?
          GROUP BY g.id
          ORDER BY g.nome
      `, [idValue]);
    res.status(200).json(rows);
  } catch (err) {
    console.error('Erro ao executar a consulta:', err);
  } finally {
    desconectar(connection);
  }
}

const buscarPapelUsuario = async (req, res) => {

  const { id_usuario, id_grupo } = req.params;
  const connection = await conectar();

  try {

    const [rows] = await connection.execute(`
            SELECT papel
            FROM usuarios_grupos
            WHERE id_usuario = ?
            AND id_grupo = ?
        `, [id_usuario, id_grupo]);

    if (rows.length === 0) {
      return res.status(404).json({
        message: "Usuário não participa do grupo"
      });
    }

    res.status(200).json(rows[0]);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  } finally {
    desconectar(connection);
  }
};

module.exports = { get, getByid, erase, post, put, todosgruposusuarioparticipa, buscarPapelUsuario };