## Injeção de Ramais

Sistema para facilitar criação de ramais em servidores Linux através de conexões SSH.

## 📖 Sobre

O projeto foi desenvolvido para facilitar o processo de criação de ramais em servidores de telefonia, eliminando a necessidade de editar arquivos manualmente.

A aplicação estabelece uma conexão SSH com o servidor, realiza a autenticação e executa as alterações necessárias nos arquivos de configuração de forma automática.

---

## ✨ Funcionalidades

- Conexão SSH segura
- Autenticação por usuário e senha
- Leitura de arquivos remotos
- Inserção automática de novos ramais
- Atualização de configurações existentes
- Interface web para envio das informações

---

## 🛠 Tecnologias

### Front-end

- HTML
- CSS
- JavaScript

### Back-end

- Node.js
- Express
- SSH2

---

## 🏗 Arquitetura

```
Usuário
   │
   ▼
Front-end
   │
   ▼
Express API
   │
   ▼
SSH2
   │
   ▼
Servidor Linux
   │
   ▼
Arquivo de configuração
```

---

## ⚙️ Fluxo da aplicação

1. O usuário preenche os dados do ramal.
2. O front-end envia uma requisição para a API.
3. O servidor Node estabelece conexão SSH.
4. O arquivo remoto é lido.
5. O novo ramal é inserido.
6. O arquivo é salvo.
7. O serviço é atualizado.
8. A resposta é enviada ao usuário.

---

## 📷 Demonstração

<img width="1099" height="847" alt="image" src="https://github.com/user-attachments/assets/3b502b68-5222-43f4-8190-5e68b94aa20b" />

---

## 📌 Aprendizados

Durante este projeto foram praticados conceitos como:

- Node.js
- Express
- Comunicação Cliente/Servidor
- SSH
- Manipulação de arquivos remotos
- Programação assíncrona
- APIs REST
- Estruturação de projetos

---

## 💡 Desafios

Durante o desenvolvimento, alguns desafios foram enfrentados:

- Inserir texto em posições específicas de arquivos remotos.
- Manipular conexões SSH de forma assíncrona.
- Garantir que a aplicação não corrompesse os arquivos de configuração.

---

## 👨‍💻 Autor

Leonardo
