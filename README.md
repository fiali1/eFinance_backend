# e-Finance
Aplicação-exemplo Node.js/Express CRUD com Firestore como database.

Gerencie gastos e renda com uma listagem de registros e apresentação do balanço.

### Libs: 
* **Server:** Express 
* **Encryption:** Bcrypt
* **Validação:** Yup
* **Autenticação básica:** Jsonwebtoken
### Routes: 
* **/login**
  * POST | _Gera access token_
* **/users**
  * POST | _Cria um novo usuário_
  * **/:username**
    * GET | _Retorna os dados de <username>_
    * PUT | _Atualiza os dados de <username>_
    * DELETE | _Deleta o usuário <username> e seus registros_
  * **/verify**
    * POST | _Verifica se um username está disponível para cadastro_
* **/entries**
  * POST | _Cria um novo registro para um usuário_
  * GET | _Retorna todos os registros de um usuário_
  * **/:id**
    * GET | _Retorna um registro de um usuário pelo seu id_
    * PUT | _Atualiza um registro de um usuário pelo seu id_
    * DELETE | _Delete um registro de um usuário pelo seu id_

<br>
<hr>
<br>

### **Frontend repo:** https://github.com/fiali1/eFinance_frontend

### **Firebase Hosting com backend Heroku:** https://e-finance-6a22e.web.app/