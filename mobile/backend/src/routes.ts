import { Router, Request, Response } from "express";
import pool from "./database";
import bcrypt from "bcrypt";

const router = Router();

router.post(
  "/login",
  async (req: Request, res: Response): Promise<any> => {
    try {
      const { email, senha } = req.body;

      const [rows]: any = await pool.query(
        "SELECT * FROM usuarios WHERE email = ?",
        [email]
      );

      if (rows.length === 0) {
        return res.status(401).json({
          sucesso: false,
          mensagem: "Usuário não encontrado",
        });
      }

      const usuario = rows[0];

      const senhaValida = await bcrypt.compare(
        senha,
        usuario.senha
      );

      if (!senhaValida) {
        return res.status(401).json({
          sucesso: false,
          mensagem: "Senha inválida"
        });
      }

      return res.json({
        sucesso: true,
        usuario: {
          id: usuario.id,
          nome: usuario.nome,
          email: usuario.email,
          tipo_usuario: usuario.tipo_usuario,
        },
      });

    } catch (error) {
      console.log(error);

      return res.status(500).json({
        sucesso: false,
        mensagem: "Erro no servidor",
      });
    }
  }
);

router.get("/cursos", async (req, res) => {
  const [rows]: any = await pool.query(
    "SELECT * FROM cursos"
  );

  res.json(rows);
});

router.get(
  "/usuarios/:id",
  async (req: Request, res: Response): Promise<any> => {
    try {
      const { id } = req.params;

      const [rows]: any = await pool.query(
        `
        SELECT
          id,
          nome,
          email,
          tipo_usuario
        FROM usuarios
        WHERE id = ?
        `,
        [id]
      );

      if (rows.length === 0) {
        return res.status(404).json({
          mensagem: "Usuário não encontrado",
        });
      }

      return res.json(rows[0]);
    } catch (error) {
      console.log(error);

      return res.status(500).json({
        mensagem: "Erro ao buscar usuário",
      });
    }
  }
);

router.put(
  "/usuarios/:id",
  async (req: Request, res: Response): Promise<any> => {
    try {
      const { id } = req.params;
      const { nome, email } = req.body;

      const [usuarioExistente]: any = await pool.query(
        `
        SELECT id
        FROM usuarios
        WHERE email = ?
          AND id <> ?
        `,
        [email, id]
      );

      if (usuarioExistente.length > 0) {
        return res.status(400).json({
          sucesso: false,
          mensagem: "E-mail já está em uso",
        });
      }

      await pool.query(
        `
        UPDATE usuarios
        SET
          nome = ?,
          email = ?
        WHERE id = ?
        `,
        [nome, email, id]
      );

      return res.json({
        sucesso: true,
        mensagem: "Perfil atualizado com sucesso",
      });

    } catch (error) {
      console.log(error);

      return res.status(500).json({
        sucesso: false,
        mensagem: "Erro ao atualizar perfil",
      });
    }
  }
);

router.post(
  "/inscricoes",
  async (req: Request, res: Response): Promise<any> => {
    try {

      const {
        id_usuario,
        id_curso
      } = req.body;

      await pool.query(
        `
        INSERT INTO inscricoes
        (
          id_usuario,
          id_curso
        )
        VALUES (?, ?)
        `,
        [
          id_usuario,
          id_curso
        ]
      );

      return res.json({
        sucesso: true,
        mensagem: "Inscrição realizada com sucesso"
      });

    } catch (error) {

      console.log(error);

      return res.status(500).json({
        sucesso: false,
        mensagem: "Erro ao realizar inscrição"
      });

    }
  }
);

router.get(
  "/meusCursos/:id_usuario",
  async (req: Request, res: Response): Promise<any> => {
    try {

      const { id_usuario } = req.params;

      const [rows]: any = await pool.query(
        `
        SELECT
          i.id as id_inscricao,
          c.id,
          c.titulo,
          c.descricao,
          c.plataforma,
          c.modalidade,
          c.duracao_semestres
        FROM inscricoes i
        INNER JOIN cursos c
          ON c.id = i.id_curso
        WHERE i.id_usuario = ?
        `,
        [id_usuario]
      );

      return res.json(rows);

    } catch (error) {

      console.log(error);

      return res.status(500).json({
        mensagem: "Erro ao buscar cursos"
      });

    }
  }
);

router.delete(
  "/inscricoes/:id",
  async (req: Request, res: Response): Promise<any> => {

    try {

      const { id } = req.params;

      await pool.query(
        `
        DELETE FROM inscricoes
        WHERE id = ?
        `,
        [id]
      );

      return res.json({
        sucesso: true
      });

    } catch (error) {

      console.log(error);

      return res.status(500).json({
        sucesso: false
      });

    }

  }
);


router.get("/grupos", async (req: Request, res: Response): Promise<any> => {
  try {
    const [rows]: any = await pool.query(`
      SELECT 
        g.id,
        g.nome,
        g.descricao,
        g.idioma,
        g.privado,
        g.criado_por,
        u.nome AS criador,
        COUNT(ug.id_usuario) AS total_membros
      FROM grupos g
      LEFT JOIN usuarios u ON g.criado_por = u.id
      LEFT JOIN usuarios_grupos ug ON ug.id_grupo = g.id
      WHERE g.ativo = 1
      GROUP BY g.id
      ORDER BY g.id DESC
    `);

    return res.json(rows);
  } catch (error) {
    console.log("Erro ao buscar grupos:", error);
    return res.status(500).json({ mensagem: "Erro ao buscar grupos." });
  }
});

// 2. CRIAR UM NOVO GRUPO
router.post("/grupos", async (req: Request, res: Response): Promise<any> => {
  try {
    const { nome, descricao, idioma, privado, criado_por } = req.body;

    if (!nome || !criado_por) {
      return res.status(400).json({ mensagem: "Nome e criador são obrigatórios." });
    }

    // Insere o grupo
    const [result]: any = await pool.query(
      `
      INSERT INTO grupos (nome, descricao, idioma, privado, criado_por)
      VALUES (?, ?, ?, ?, ?)
      `,
      [nome, descricao, idioma || 'português', privado ? 1 : 0, criado_por]
    );

    const id_grupo = result.insertId;

    // Coloca o criador dentro da tabela de membros
    await pool.query(
      `
      INSERT INTO usuarios_grupos (id_usuario, id_grupo, papel)
      VALUES (?, ?, 'admin')
      `,
      [criado_por, id_grupo]
    );

    return res.json({ sucesso: true, id: id_grupo });
  } catch (error) {
    console.log("Erro ao criar grupo:", error);
    return res.status(500).json({ mensagem: "Erro ao criar grupo." });
  }
});

// 3. PARTICIPAR DE UM GRUPO
// PARTICIPAR DE UM GRUPO
router.post("/grupos/participar", async (req: Request, res: Response): Promise<any> => {
  try {
    const { id_usuario, id_grupo } = req.body;

    if (!id_usuario || !id_grupo) {
      return res.status(400).json({ mensagem: "Usuário e grupo são obrigatórios." });
    }

    // 1. Verifica se o usuário é o criador do grupo
    const [grupo]: any = await pool.query(
      `SELECT criado_por FROM grupos WHERE id = ?`,
      [id_grupo]
    );

    if (grupo.length > 0 && grupo[0].criado_por === Number(id_usuario)) {
      return res.status(400).json({
        mensagem: "Você é o criador deste grupo e já faz parte dele!",
      });
    }

    // 2. Tenta inserir na tabela pivô
    await pool.query(
      `
      INSERT INTO usuarios_grupos (id_usuario, id_grupo, papel)
      VALUES (?, ?, 'membro')
      `,
      [id_usuario, id_grupo]
    );

    return res.json({ sucesso: true, mensagem: "Entrou no grupo com sucesso!" });
  } catch (error: any) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ mensagem: "Você já faz parte deste grupo." });
    }
    console.log("Erro ao participar:", error);
    return res.status(500).json({ mensagem: "Erro ao entrar no grupo." });
  }
});

// EXCLUIR GRUPO
router.delete("/grupos/:id", async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const { id_usuario } = req.body; // Passado no body ou via headers/token

    if (!id_usuario) {
      return res.status(400).json({ mensagem: "Usuário é obrigatório." });
    }

    // 1. Verifica se o grupo existe e se o usuário é o criador
    const [grupo]: any = await pool.query(
      `SELECT criado_por FROM grupos WHERE id = ?`,
      [id]
    );

    if (grupo.length === 0) {
      return res.status(404).json({ mensagem: "Grupo não encontrado." });
    }

    if (grupo[0].criado_por !== Number(id_usuario)) {
      return res.status(403).json({
        mensagem: "Apenas o criador do grupo pode excluí-lo.",
      });
    }

    // 2. Remove primeiro as relações na tabela pivô (membros do grupo)
    await pool.query(`DELETE FROM usuarios_grupos WHERE id_grupo = ?`, [id]);

    // 3. Deleta o grupo da tabela principal
    await pool.query(`DELETE FROM grupos WHERE id = ?`, [id]);

    return res.json({ sucesso: true, mensagem: "Grupo excluído com sucesso!" });
  } catch (error: any) {
    console.log("Erro ao excluir grupo:", error);
    return res.status(500).json({ mensagem: "Erro ao excluir o grupo." });
  }
});


router.post(
  "/register",
  async (req: Request, res: Response): Promise<any> => {

    try {

      const {
        nome,
        email,
        senha,
        tipo_usuario
      } = req.body;

      const [usuarioExistente]: any =
        await pool.query(
          "SELECT id FROM usuarios WHERE email = ?",
          [email]
        );

      if (usuarioExistente.length > 0) {

        return res.status(400).json({
          sucesso: false,
          mensagem: "E-mail já cadastrado"
        });

      }
      const senhaHash = await bcrypt.hash(senha, 10);
      await pool.query(
        `
        INSERT INTO usuarios
        (
          nome,
          email,
          senha,
          tipo_usuario
        )
        VALUES (?, ?, ?, ?)
        `,
        [
          nome,
          email,
          senhaHash,
          tipo_usuario
        ]
      );

      return res.json({
        sucesso: true,
        mensagem: "Usuário cadastrado com sucesso"
      });

    } catch (error) {

      console.log(error);

      return res.status(500).json({
        sucesso: false,
        mensagem: "Erro ao cadastrar usuário"
      });

    }

  }
);

export default router;