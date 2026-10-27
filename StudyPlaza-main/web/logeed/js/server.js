const express = require('express');
const session = require('express-session');
const app = express();
const port = 3000;



app.use(express.urlencoded({ extended: true }));

app.use(express.json())

// Configuração da Sessão
 app.use(session({
    secret: 'uma_chave_secreta_muito_segura', // Use variáveis de ambiente no futuro!
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Mude para true se estiver usando HTTPS
}));

app.post('/login', async (req, res) =>{
    const {email, password } = req.body;

    try {
        const respostaDaApi = await fetch('http://localhost:3500/api/auth', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({email, password})
        });

        const dados = await respostaDaApi.json();

        console.log(dados)
        if (respostaDaApi.ok) {
            req.session.usuarioLogado = true;
            req.session.email = email;

            console.log('Deu certo')


            res.redirect('/painel');
        } else {

            res.status(401).send('Acesso negado: ${dados.mensagem || "Credenciais inválidas"}. <a href="/Login"> Tentar novamente</a>')
        }

    }catch (erro){
        console.error("Erro ao conectar com a API:", erro);
        res.status(500).send('Erro interno: O servidor não conseguiu falar com a API.');
    }
})

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})