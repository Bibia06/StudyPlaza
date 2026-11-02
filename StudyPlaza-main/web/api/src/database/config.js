const mysql = require("mysql2/promise");

const stringConnection =  {
       host: 'localhost',
       user: 'root',
       password: '',
       database: 'study_plaza',
       port: 3306
       } ;

async function conectar() {
    const connection = await mysql.createConnection(
       stringConnection
    );
     return connection;
   }

async function desconectar(connection) {
  connection.end();
}

module.exports = { conectar, desconectar }; 