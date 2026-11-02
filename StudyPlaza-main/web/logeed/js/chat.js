const express = require("express");             // framework HTTP
const { createServer } = require("http");       // servidor HTTP nativo do Node
const { Server } = require("socket.io");        // Socket.IO para WebSocket/fallbacks
const path = require("path");                   // utilitário para caminhos de arquivos

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);              // instancia o servidor Socket.IO ligado ao httpServer

// Manipula eventos de conexão WebSocket
io.on("connection", (socket) => {
  console.log("A user connected " + socket.id);

  // 1. O 'join' agora é assíncrono (async) pois vai buscar dados no banco
  socket.on("join", async (userData) => {
    socket.username = userData.username || "Anônimo";
    socket.id_usuario = userData.id_usuario;
    socket.id_grupo = userData.id_grupo;
    
    console.log(`Usuário ${socket.username} entrou no Grupo: ${socket.id_grupo}`);

    // --- PUXAR MENSAGENS DO BANCO ---
    try {
      // Faz um GET na sua API passando o ID do grupo atual
      // Ajuste a URL abaixo de acordo com a porta/rota real da sua API
      const response = await fetch(`http://localhost:3500/api/mensagens/conversasGrupo/${socket.id_grupo}`);
      
      if (response.ok) {
        const historico = await response.json();
        
        // Envia o histórico de mensagens APENAS para o usuário que acabou de entrar
        socket.emit("chat history", historico);
      } else {
        console.error("Erro ao buscar histórico da API:", await response.text());
      }
    } catch (error) {
      console.error("Erro de conexão ao buscar histórico:", error.message);
    }
  });

  // 2. Escuta o envio de novas mensagens (Mantém igual ao passo anterior)
  socket.on("chat message", async (msg) => {
    const data = {
      id: socket.id,
      username: socket.username,
      msg: msg
    };

    // Envia em tempo real para todos no chat
    io.emit("chat message", data);

    // Salva no banco de dados em segundo plano
    const dadosParaSalvar = {
      id_grupo: socket.id_grupo,
      id_usuario: socket.id_usuario,
      mensagem: data.msg,
      data_envio: new Date()
    };

    try {
      await fetch("http://localhost:3500/api/mensagens", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dadosParaSalvar)
      });
    } catch (error) {
      console.error("Erro ao salvar mensagem:", error.message);
    }
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected " + socket.id);
  });
});

// Serve arquivos estáticos a partir da pasta pai do arquivo atual (ajuste conforme sua estrutura)
app.use('/css', express.static(path.join(__dirname, '../../css')));
app.use('/js', express.static(path.join(__dirname, '../../js')));
app.use('/js', express.static(__dirname));
app.use('/img', express.static(path.join(__dirname, '../../img')));

app.use('/logeed', express.static(path.join(__dirname, '../')));

// Rota raiz que envia index.html (útil ao abrir http://localhost:9000)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, '../..', '/logeed/homeChat.html'));
});


// Em ambientes reais utilize process.env.PORT e logging mais robusto.
httpServer.listen(9000, () => {
  console.log("Server is listening on port 9000");
});