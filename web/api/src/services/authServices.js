const { conectar, desconectar } = require('../database/config');
const bcrypt = require('bcrypt');

// Autenticação usando a tabela `usuarios` (campos: email, senha)
const login = async (req, resp) => {
  const connection = await conectar();

  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return resp.status(400).send({
        message: 'Email e senha são obrigatórios'
      });
    }

    const [rows] = await connection.execute(
      `SELECT * FROM usuarios WHERE email = ? LIMIT 1`,
      [email]
    );

    if (rows.length === 0) {
      return resp.status(401).send({
        message: 'Email ou senha inválidos'
      });
    }

    const usuario = rows[0];

    const senhaValida = await bcrypt.compare(
      senha,
      usuario.senha
    );

    if (!senhaValida) {
      return resp.status(401).send({
        message: 'Email ou senha inválidos'
      });
    }

    return resp.status(200).send({
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      tipo_usuario: usuario.tipo_usuario
    });

  } catch (err) {
    console.error(err);

    return resp.status(500).send({
      message: 'Erro interno do servidor'
    });

  } finally {
    desconectar(connection);
  }
};

module.exports = { login };