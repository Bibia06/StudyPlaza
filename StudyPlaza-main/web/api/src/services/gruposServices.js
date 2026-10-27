const { conectar, desconectar } = require('../database/config');
const tableName = "grupos";

// ============================
// GET ALL
// ============================
const get = async (req, resp) => {
  const connection = await conectar();
  try {
    const [rows] = await connection.execute(
      `SELECT * FROM ${tableName} ORDER BY id DESC`
    );
    resp.status(200).send(rows);
  } catch (err) {
    console.error('Erro ao executar a consulta:', err);
    resp.status(500).send({ error: "Erro interno" });
  } finally {
    desconectar(connection);
  }
};

// ============================
// GET BY ID
// ============================
const getByid = async (req, resp) => {
  const idValue = req.params.id;
  const connection = await conectar();
  try {
    const [rows] = await connection.execute(
      `SELECT * FROM ${tableName} WHERE id = ?`,
      [idValue]
    );
    resp.status(200).send(rows);
  } catch (err) {
    console.error('Erro ao executar a consulta:', err);
    resp.status(500).send({ error: "Erro interno" });
  } finally {
    desconectar(connection);
  }
};

// ============================
// POST
// ============================
const post = async (req, res) => {
  const { nome, descricao, criado_por } = req.body;

  const connection = await conectar();
  try {
    const [result] = await connection.execute(
      `INSERT INTO ${tableName} (nome, descricao, criado_por) VALUES (?, ?, ?)`,
      [nome, descricao, criado_por]
    );

    const novoGrupoId = result.insertId;

    await connection.execute(
      `INSERT INTO usuarios_grupos (id_usuario, id_grupo, papel) VALUES (?, ?, ?)`,
      [criado_por, novoGrupoId, 'admin']
    );

    res.status(201).json({ sucesso: true, id: novoGrupoId });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message, sucess: false });
  } finally {
    desconectar(connection);
  }
};

// ============================
// PUT
// ============================
const put = async (req, res) => {
  const id = req.params.id;
  const dataPayload = req.body;

  const campos = Object.keys(dataPayload);
  const valores = Object.values(dataPayload);

  const connection = await conectar();
  try {
    const comando =
      `UPDATE ${tableName} SET ` +
      campos.map(campo => `${campo} = ?`).join(', ') +
      ` WHERE id = ?`;

    const result = await connection.execute(comando, [...valores, id]);

    res.status(200).send(result);
  } catch (error) {
    res.status(400).send({ message: error.message, sucess: false });
  } finally {
    desconectar(connection);
  }
};

// ============================
// DELETE
// ============================
const erase = async (req, res) => {
  const id = req.params.id;
  const connection = await conectar();

  try {
    await connection.execute(
      `DELETE FROM ${tableName} WHERE id = ?`,
      [id]
    );
    res.status(204).send();
  } catch (error) {
    res.status(500).send({ message: "Erro ao deletar", sucess: false });
  } finally {
    desconectar(connection);
  }
};

// ============================
// GRUPOS CRIADOS POR UM USUÁRIO
// ============================
const todosgruposusuario = async (req, resp) => {
  const idValue = req.params.criado_por;
  const connection = await conectar();

  try {
    const [rows] = await connection.execute(`
      SELECT 
          g.id,
          g.nome,
          g.descricao,
          g.privado,
          g.criado_por,
          g.data_criacao,
          g.ativo,
          COUNT(ug.id_usuario) AS membros
      FROM grupos g
      LEFT JOIN usuarios_grupos ug ON g.id = ug.id_grupo
      WHERE g.criado_por = ?
      GROUP BY g.id
      ORDER BY g.id DESC
    `, [idValue]);

    resp.status(200).send(rows);

  } catch (err) {
    console.error("Erro ao executar:", err);
    resp.status(500).send({ error: "Erro interno" });
  } finally {
    desconectar(connection);
  }
};

// ============================
// GRUPOS COM MEMBROS
// ============================
const comMembros = async (req, resp) => {
  const connection = await conectar();
  try {
    const [rows] = await connection.execute(`
      SELECT 
          g.id,
          g.nome,
          g.descricao,
          g.privado,
          g.criado_por,
          g.data_criacao,
          g.ativo,
          COUNT(ug.id_usuario) AS membros
      FROM grupos g
      LEFT JOIN usuarios_grupos ug ON g.id = ug.id_grupo
      GROUP BY g.id
      ORDER BY g.id DESC
    `);
    resp.status(200).send(rows);

  } catch (err) {
    console.error('Erro ao executar a consulta:', err);
    resp.status(500).send({ error: "Erro interno" });
  } finally {
    desconectar(connection);
  }
};

// ============================
// TOTAL DE GRUPOS
// ============================
const totalGrupos = async (req, resp) => {
  const connection = await conectar();
  try {
    const [rows] = await connection.execute(`
      SELECT COUNT(*) AS total_grupos FROM grupos WHERE ativo = 1;
    `);
    resp.status(200).send({ total: rows[0].total_grupos });

  } catch (err) {
    console.error(err);
    resp.status(500).send({ error: "Erro interno" });
  } finally {
    desconectar(connection);
  }
};

// ============================
// GRUPOS ATIVOS DO USUÁRIO
// ============================
const gruposAtivosUsuario = async (req, resp) => {
  const idUsuario = req.params.id_usuario;

  const connection = await conectar();
  try {
    const [rows] = await connection.execute(`
      SELECT 
        g.id,
        g.nome,
        g.ativo
      FROM grupos g
      JOIN usuarios_grupos ug ON ug.id_grupo = g.id
      WHERE ug.id_usuario = ?
      AND g.ativo = 1;
    `, [idUsuario]);

    resp.status(200).send({ total: rows.length, grupos: rows });

  } catch (err) {
    console.error("Erro ao buscar grupos ativos:", err);
    resp.status(500).send({ error: "Erro interno" });
  } finally {
    desconectar(connection);
  }
};

// ============================
// MEMBROS DE UM GRUPO
// ============================
const membrosDoGrupo = async (req, res) => {
  const grupoId = req.params.id;
  const connection = await conectar();

  try {
    const [rows] = await connection.execute(`
            SELECT u.id AS id_usuario, u.nome, u.email, ug.papel
            FROM usuarios_grupos ug
            JOIN usuarios u ON u.id = ug.id_usuario
            WHERE ug.id_grupo = ?
            ORDER BY u.nome
        `, [grupoId]);

    res.status(200).json(rows);
  } catch (error) {
    console.error("Erro ao buscar membros do grupo:", error);
    res.status(500).json({ message: "Erro ao buscar membros do grupo", sucess: false });
  } finally {
    desconectar(connection);
  }
};



module.exports = {
  get, getByid, erase, post, put,
  todosgruposusuario, comMembros,
  totalGrupos, gruposAtivosUsuario, membrosDoGrupo
};
