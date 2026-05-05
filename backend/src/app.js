const express = require("express");
const app = express();
const cors = require("cors");

const authRoutes = require('./routes/authRoutes')
const transacaoRoutes = require('./routes/transacaoRoutes')
const objetivoRoutes = require('./routes/objetivoRoutes')
const testRoutes = require('./routes/testRoutes');

app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes)
app.use('/transacoes', transacaoRoutes)
app.use('/objetivos', objetivoRoutes)
app.use('/test',testRoutes);

app.get("/", (req, res) => {
  res.status(200).json({ message: "API do AuraFinance rodando" });
});

app.get('/teste-direto', (req, res) => {
  res.send('FUNCIONOU DIRETO')
})

module.exports = app;