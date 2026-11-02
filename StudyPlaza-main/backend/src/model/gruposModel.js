import { db } from "../databases/DatabaseContext.js";
import * as sqlutils from "../utils/sqlTextos.js";

export const tableName = "grupos";

export async function Get(req, res) {
  try {
    const results = await db.execute(`SELECT * FROM ${tableName} ORDER BY id`);
    return { message: "Success", data: results[0] };
  } catch (error) {
    console.log(error);
    return { message: "error", Error: error.message };
  }
}

export async function GettotalGrupos(req, res) {
  try {
    const results = await db.execute(`SELECT COUNT(*) as total_grupos FROM ${tableName} WHERE actived = 1 ORDER BY id`);
    return { message: "Success", data: results[0] };
  } catch (error) {
    console.log(error);
    return { message: "error", Error: error.message };
  }
}

export async function GetById(id) {
  try {
    const results = await db.execute(
      `SELECT * FROM ${tableName} WHERE id = ? ORDER BY id `,
      [id],
    );
    return { message: "Success", data: results[0] };
  } catch (error) {
    return { message: "error", Error: error.message };
  }
}

export async function GetByGruposDoUser(id) {
  try {
    const results = await db.execute(
      ` SELECT 
          g.name,
          g.iduser AS criado_pelo,
          g.created_by,
          g.actived
      FROM ${tableName} g
      WHERE g.iduser = ?
      GROUP BY g.id
      ORDER BY g.id DESC
    `,
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
    const sqlTexto = `INSERT INTO ${tableName} ( ${sqlFields} )  VALUES ( ${sqlParms} )`;
    console.log(`grupos :${sqlTexto}`);

    const results = await db.execute(sqlTexto, sqlValuesParms);
    
    return { message: "Success", data: results };
  } catch (error) {
    return { message: "error", Error: error.message };
  }
}

export async function Post_old(data) {
  try {
    const payload = data;
    sqlutils.extrair_dados(payload);
    const sqlFields = sqlutils.gerar_sqlFields();
    const sqlParms = sqlutils.gerar_sqlParams();
    const sqlValuesParms = sqlutils.listParms();
    const sqlTexto = `INSERT INTO ${tableName} ( ${sqlFields} )  VALUES ( ${sqlParms} )`;
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
