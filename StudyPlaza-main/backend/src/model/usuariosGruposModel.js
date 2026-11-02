import { db } from "../databases/DatabaseContext.js";
import * as sqlutils from "../utils/sqlTextos.js";

export const tableName = "usuariosgrupos";

export async function Get(req, res) {
  try {
    const results = await db.execute(
      `SELECT 
            ug.id,
            ug.idgrupo,
            ug.iduser,
            ug.created_at,
            u.name,
            ug.role
            FROM ${tableName} ug
            INNER JOIN users u ON (u.id = ug.iduser)
            INNER JOIN grupos g ON (g.id = ug.idgrupo)
            ORDER BY id`,
    );
    return { message: "Success", data: results[0] };
  } catch (error) {
    console.log(error);
    return { message: "error", Error: error.message };
  }
}

export async function GetByGruposTotalMembros(req, res) {
  try {
    const results = await db.execute(
      `SELECT
          g.name AS grupo,
          g.created_by AS data_criacao,
          u.name AS criador,
          COUNT(ug.iduser) AS quantMembros
        FROM ${tableName} ug
        INNER JOIN users u ON (u.id = ug.iduser)
        INNER JOIN grupos g ON (g.id = ug.idgrupo)
        GROUP BY g.name, g.created_by;`,
    );
    return { message: "Success", data: results[0] };
  } catch (error) {
    return { message: "error", Error: error.message };
  }
}

export async function GetById(id) {
  try {
    const results = await db.execute(
      `SELECT 
            ug.id,
            ug.idgrupo,
            ug.iduser,
            ug.created_at,
            u.name,
            ug.role
            FROM ${tableName} ug
            INNER JOIN users u ON (u.id = ug.iduser)
            INNER JOIN grupos g ON (g.id = ug.idgrupo)
            WHERE ug.id = ?
            ORDER BY id`,
      [id],
    );
    return { message: "Success", data: results[0] };
  } catch (error) {
    return { message: "error", Error: error.message };
  }
}

export async function GetByUser(id) {
  try {
    const results = await db.execute(
      `SELECT 
            ug.id,
            ug.idgrupo,
            ug.iduser,
            ug.created_at,
            u.name,
            ug.role
            FROM ${tableName} ug
            INNER JOIN users u ON (u.id = ug.iduser)
            INNER JOIN grupos g ON (g.id = ug.idgrupo)
            WHERE ug.iduser = ?
            ORDER BY id`,
      [id],
    );
    return { message: "Success", data: results[0] };
  } catch (error) {
    return { message: "error", Error: error.message };
  }
}

export async function GetByEmail(email) {
  try {
    const results = await db.execute(
      `SELECT 
            ug.id,
            ug.idgrupo,
            ug.iduser,
            ug.created_at,
            u.login,
            u.name,
            ug.role
            FROM ${tableName} ug
            INNER JOIN users u ON (u.id = ug.iduser)
            INNER JOIN grupos g ON (g.id = ug.idgrupo)
            WHERE login = ?
            ORDER BY id`,
      [email],
    );
    if (results[0].length === 0) {
      return { message: "error", Error: "resgistro não localizado" };
    }
    return { message: "Success", data: results[0] };
  } catch (error) {
    return { message: "error", Error: error.message };
  }
}

export async function GetByMembro(id) {
  try {
    const results = await db.execute(
      `SELECT 
            ug.id,
            ug.iduser,
            ug.created_at,
            u.name,
            u.login,
            ug.role
            FROM ${tableName} ug
            INNER JOIN users u ON (u.id = ug.iduser)
            WHERE ug.idgrupo = ?
            ORDER BY u.name`,
      [id],
    );
    return { message: "Success", data: results[0] };
  } catch (error) {
    return { message: "error", Error: error.message };
  }
}

export async function Delete(id) {
  try {
    const results = await db.execute(`DELETE FROM ${tableName} WHERE id = ?`, [
      id,
    ]);
    return { message: "Success", data: results };
  } catch (error) {
    return { message: "error", Error: error.message };
  }
}

export async function Post(data) {
  try {
    const payload = data;
    sqlutils.extrair_dados(payload);
    const sqlFields = sqlutils.gerar_sqlFields();
    const sqlParms = sqlutils.gerar_sqlParams();
    const sqlValuesParms = sqlutils.listParms();
    const sqlTexto = `INSERT INTO ${tableName} ( ${sqlFields} ) VALUES ( ${sqlParms} )`;
    console.log(sqlTexto);

    const results = await db.execute(sqlTexto, sqlValuesParms);
    return { message: "Success", data: results };
  } catch (error) {
    return { message: "error", Error: error.message };
  }
}

export async function Put(data, id) {
  try {
    sqlutils.extrair_dados(data);
    const sqlSets = sqlutils.gerar_sqlSets();
    const sqlValuesParms = sqlutils.listParms();
    sqlValuesParms.push(id);

    const results = await db.execute(
      `UPDATE ${tableName} SET ${sqlSets} WHERE id = ?`,
      sqlValuesParms,
    );
    return { message: "Success", data: results };
  } catch (error) {
    return { message: "error", Error: error.message };
  }
}
