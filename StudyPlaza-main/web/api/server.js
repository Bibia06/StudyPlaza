const express = require("express") ;

const cors = require("cors") ;

const cursosRoutes = require('./src/routes/cursosRoutes');
const inscricoesRoutes = require('./src/routes/inscricoesRoutes');
const gruposRoutes = require('./src/routes/gruposRoutes');
const materiaisRoutes = require('./src/routes/materiaisRoutes');
const comentariosRoutes = require('./src/routes/comentariosRoutes');
const mensagensRoutes = require('./src/routes/mensagensRoutes');
const usuariosgruposRoutes = require('./src/routes/usuariosgruposRoutes');
const modelosRoutes = require('./src/routes/modelosRoutes');
const usersRoutes = require('./src/routes/usersRoutes')
const authRoutes  = require('./src/routes/authRoutes')

const Port = 3500 ;
const app = express() ;

// Middleware to parse JSON request bodies
app.use( express.json()) ;

app.use(cors());

// Middleware to parse URL-encoded request bodies
app.use(express.urlencoded({ extended: true }));

function testeServidor( req, resp){
   resp.send( {servidor: "localhost",
    status: "ok", databaseType: "mysql"
   } ) 
}

app.get('/servidor', (req,resp) => testeServidor(req, resp) );

app.use('/api/cursos', cursosRoutes );
app.use('/api/inscricoes', inscricoesRoutes );
app.use('/api/mensagens', mensagensRoutes );
app.use('/api/grupos', gruposRoutes );
app.use('/api/materiais', materiaisRoutes );
app.use('/api/modelos', modelosRoutes);
app.use('/api/usuarios', usersRoutes);
app.use('/api/usuarios_grupos', usuariosgruposRoutes );
app.use('/api/comentarios', comentariosRoutes );
app.use('/api/auth', authRoutes);


app.listen( Port , () => { console.log ( `servidor rodando na porta: ${Port} !`)});
