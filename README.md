# e-Finance
A sample Node.js/Express CRUD application with Firestore as database.

Manage your expenses and income with entries listing and balance output.

### Libs: 
* **Server:** Express 
* **Encryption:** Bcrypt
* **Validation:** Yup
* **Basic auth:** Jsonwebtoken
### Routes: 
* **/login**
  * POST | _Generates access token_
* **/users**
  * POST | _Creates a new user_
  * **/:username**
    * GET | _Returns \<username> data_
    * PUT | _Updates \<username> data_
    * DELETE | _Deletes \<username> data, also deleting its entries_
  * **/verify**
    * POST | _Verifies if specified username is available for register_
* **/entries**
  * POST | _Creates a new entry for a user_
  * GET | _Returns all entries from a user_
  * **/:id**
    * GET | _Returns an entry from a user by its id_
    * PUT | _Updates an entry from a user by its id_
    * DELETE | _Deletes an entry from a user_

<br>
<hr>
<br>

### Frontend repo: https://github.com/fiali1/eFinance_frontend
