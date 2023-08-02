import express from "express";
import { v4 } from "uuid";

const app = express();

app.use(express.json());

const users = [];

const verificarEmail = function (req, res, next) {
  const email = req.body.email;

  const user = users.find((user) => user.email === email);

  if (user) {
    res.status(404);
    res.send({ error: "Email já cadastrado" });
  }

  next();
};

//Criar rota para criação de conta
app.post("/cadastro", verificarEmail, (req, res) => {
  const nome = req.body.nome;
  const email = req.body.email;
  const senha = req.body.senha;

  const user = { id: v4(), nome, email, senha, recados: [] };
  users.push(user);
  res.status(201);
  res.send({ mensagem: "Conta cadastrada com sucesso", user });
});

//Criar rota para login de usuario
app.post("/login", (req, res) => {
  const email = req.body.email;
  const senha = req.body.senha;

  const user = users.find(
    (user) => user.email === email && user.senha === senha
  );

  if (!user) {
    res.status(404);
    res.send({ error: "Email ou senha incorretos" });
  }

  res.status(200);
  res.send({ mensagem: "Logado com sucesso", user });
});

//Criar rota para criacao de recado
app.post("/recado/:id", (req, res) => {
  const id = req.params.id;
  const titulo = req.body.titulo;
  const descricao = req.body.descricao;

  const recado = { id: v4(), titulo, descricao };

  const user = users.find((user) => user.id === id);

  if (!user) {
    res.status(404);
    res.send({ error: "Usuario não encontrado" });
  }

  user.recados.push(recado);
  res.status(201);
  res.send({ mensagem: "Recado criado com sucesso", recado });
});

//Criar rota para listar todos recados
app.get("/recados/:id", (req, res) => {
  const id = req.params.id;

  const user = users.find((user) => user.id === id);

  if (!user) {
    res.status(404);
    res.send({ error: "Usuario não encontrado" });
  }

  res.status(200);
  res.send({ mensagem: "Recados encontrados", recados: user.recados });
});

//Criar rota para listar somento 1 recado pelo ID
app.get("/recados/:idUser/:idRecado", (req, res) => {
  const idUser = req.params.idUser;
  const idRecado = req.params.idRecado;

  const user = users.find((user) => user.id === idUser);
  if (!user) {
    res.status(404);
    res.send({ error: "Usuario não encontrado" });
  }

  const recado = user.recados.find((recado) => recado.id === idRecado);
  if (!recado) {
    res.status(404);
    res.send({ error: "Recado não encontrado" });
  }

  res.status(200);
  res.send({ mensagem: "Recado encontrado", recado });
});

//Criar rota para editar recado pelo ID
app.put("/recados/:idUser/:idRecado", (req, res) => {
  const idUser = req.params.idUser;
  const idRecado = req.params.idRecado;
  const titulo = req.body.titulo;
  const descricao = req.body.descricao;

  const user = users.find((user) => user.id === idUser);
  if (!user) {
    res.status(404);
    res.send({ error: "Usuario não encontrado" });
  }

  const recado = user.recados.find((recado) => recado.id === idRecado);
  if (!recado) {
    res.status(404);
    res.send({ error: "Recado não encontrado" });
  }

  recado.titulo = titulo || recado.titulo;
  recado.descricao = descricao || recado.descricao;
  res.status(200);
  res.send({ mensagem: "Recado alterado", recado });
});

//Criar rota para deletar recado pelo ID
app.delete("/recados/:idUser/:idRecado", (req, res) => {
  const idUser = req.params.idUser;
  const idRecado = req.params.idRecado;

  const user = users.find((user) => user.id === idUser);
  if (!user) {
    res.status(404);
    res.send({ error: "Usuario não encontrado" });
  }

  const recado = user.recados.find((recado) => recado.id === idRecado);
  if (!recado) {
    res.status(404);
    res.send({ error: "Recado não encontrado" });
  }

  const indexRecado = user.recados.findIndex(
    (recado) => recado.id === idRecado
  );
  user.recados.splice(indexRecado, 1);
  res.status(200);
  res.send({ mensagem: "Recado deletado", recados: user.recados });
});

app.get("/", (req, res) => {
  res.send("Aplicação rodando");
});

app.listen(3000, () => {
  console.log("Aplicação rodando na porta http://localhost:3000");
});