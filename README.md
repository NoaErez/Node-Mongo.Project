# Users & Cards REST API (Node.js + Express + MongoDB)

This project is a **RESTful API** built with **Node.js, Express, and MongoDB (Mongoose)**.
It manages **users** and **business cards** with authentication, role-based authorization, validation, and error logging.

The system supports:

* **Regular Users**
* **Business Users** (who can create cards)
* **Admins** (who can manage users and delete any card)

---

## ⚙️ Setup Instructions

### 1. Clone Repository

```bash
git clone https://github.com/<your-username>/<your-repo>.git
cd <your-repo>
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables (`.env`)

```env
LOCAL_DB=mongodb://127.0.0.1:27017/myApp
ATLAS_DB=mongodb+srv://<user>:<pass>@cluster0.mongodb.net/myApp
PORT=8181
JWT_SECRET=superSecretKey123
NODE_ENV=development
```

### 4. Run the Server

Development (with nodemon):

```bash
npm run dev
```

Production:

```bash
npm start
```

Server will run on:
 `http://localhost:8181`

---

## 🛠️ Technologies Used

* **Node.js** + **Express.js**
* **MongoDB** + **Mongoose**
* **Joi** (validation)
* **JWT** (authentication)
* **bcryptjs** (password hashing)
* **morgan** (HTTP logging)
* **chalk** (console colors)
* **dotenv** (environment management)
* **fs / path** (file logging middleware)

---

## Example Flow

1. **Register user** → `POST /users`
2. **Login user** → `POST /users/login` → receive JWT
3. **Business user** creates a card → `POST /cards`
4. **Admin** can list users → `GET /users`
5. **Any user** can like a card → `PATCH /cards/:id`

---

Would you like me to also add a **section with ready-to-use cURL examples** (register, login, create card, etc.) so it’s super easy to test the API from terminal/Postman?
