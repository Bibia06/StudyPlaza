const { conectar, desconectar } = require( '../database/config' );

const tableName = "cursos";

 const get = async ( req, resp ) => {
     const connection = await conectar();     
     try {
       const [rows, fields] = await connection.execute( `SELECT * FROM ${tableName} order by id desc`);
       resp.status(201).send( rows );       
     } catch (err) {
       console.error('Erro ao executar a consulta:', err);       
     } finally {
       desconectar( connection);
     }
}

// 2. rota  = GETbyid == select * from tabela where id = ?id == Read
const getByid = async ( req, resp ) => {
     const idValue = req.params.id;
     const connection = await conectar();     
     try {
       const [rows, fields] = await connection.execute( `SELECT * FROM ${tableName} WHERE id = ${idValue}` );
       resp.send( rows );
     } catch (err) {
       console.error('Erro ao executar a consulta:', err);       
     } finally {
       desconectar(connection);
     }
}

// 3.rota  = POST
const post = async (req,res) => {
    const dataPayload = req.body ;
    const campos = Object.keys(dataPayload); 
    const valores = Object.values(dataPayload);
    let comando = ''; 
    const connection = await conectar();
    try {
        comando = `INSERT INTO ${tableName} (${campos.join(', ')}) VALUES ("${valores.join('", "')}")`; 
        const result = await connection.execute( comando );
        res.status(201).send( result );
    } catch (error) {
        res.status(401).send({'message': error.message, 'sucess': 'error'});        
    } finally{
      desconectar(connection);
    }
}

// 4.rota  = PUT = UPDATE
async function put(req,res) {
    // const { titulo, cargaHoraria, professores_id } = req.body ;
    const id = req.params.id;
    const dataPayload = req.body ;
    const campos = Object.keys(dataPayload); 
    const valores = Object.values(dataPayload); 
    let comando = ''; 

    const connection = await conectar();
    try {

      let comando = ''; 
      comando = `UPDATE ${tableName} SET `;
      comando += campos.map((campo, i) => `${campo} = "${valores[i]}"`).join(', ');
      comando += ` WHERE id = ${id}`;
      const result = await connection.execute( comando );    
      res.status(202).send( result );
    } catch (error) {
        res.status(401).send({'message': error.message, 'sucess': 'error'});    
    } finally {
      desconectar(connection) ;

    }
}

// 4.rota  = DELETE
const erase = async (req,res) =>{
    const id = req.params.id;
    const connection = await conectar();
    try {      
      const result = await connection.execute(`DELETE FROM ${tableName} WHERE id = ${id}`);
      res.status(204).send( result );
    } catch(error) {
      res.status(508).send( {"message": "Erro executar a solicitação!" , sucess: false} )
    } finally {
      desconectar(connection);
    }
}

module.exports = { get, getByid, erase , post, put }