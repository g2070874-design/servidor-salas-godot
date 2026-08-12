const express = require('express');
const app = express();

app.use(express.json());

// Array para guardar as salas ativas na memória
let salas = [];

// Limpa salas antigas (com mais de 10 minutos) automaticamente
setInterval(() => {
    const agora = Date.now();
    salas = salas.filter(s => agora - s.criadaEm < 600000);
}, 60000);

// Endpoint para a Godot registrar uma nova sala
app.post('/criar_sala', (req, res) => {
    const { codigo, nome_host, ip } = req.body;
    
    if (!codigo) {
        return res.status(400).json({ erro: "Código é obrigatório" });
    }

    // Remove sala antiga do mesmo código se existir
    salas = salas.filter(s => s.codigo !== codigo);

    // Adiciona a nova sala
    salas.push({
        codigo: codigo,
        nome_host: nome_host || "Host Anônimo",
        ip: ip || "",
        criadaEm: Date.now()
    });

    console.log(`Nova sala criada: ${codigo}`);
    res.json({ status: "sucesso", mensagem: "Sala registrada!" });
});

// Endpoint para a Godot buscar todas as salas ativas
app.get('/salas', (req, res) => {
    res.json(salas);
});

// Porta padrão do servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor de salas rodando na porta ${PORT}`);
});
  
