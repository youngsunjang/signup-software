const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, "users.json");

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("views"));

// Load existing users
let users = [];
if (fs.existsSync(DATA_FILE)) {
  users = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
}

// Home page (Signup form)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

// // Original version: Signup: Create new user
// app.post("/signup", (req, res) => {
//   const { name, email } = req.body;
//   if (!name || !email) {
//     return res.send("Please enter both name and email.");
//   }

//   const newUser = { id: Date.now(), name, email };
//   users.push(newUser);
//   fs.writeFileSync(DATA_FILE, JSON.stringify(users, null, 2));

//   res.redirect("/users");
// });


// New version: 
app.post("/signup", (req, res) => {
  const { name, email, phone } = req.body;
  if (!name || !email || !phone) {
    return res.send("Please enter both name, email, and phone.");
  }

  const newUser = { id: Date.now(), name, email, phone };
  users.push(newUser);
  fs.writeFileSync(DATA_FILE, JSON.stringify(users, null, 2));

  res.redirect("/users");
});

// // Original version: User list view
// app.get("/users", (req, res) => {
//   let html = `
//   <h2>Registered Users</h2>
//   <table border="1" cellpadding="5">
//     <tr><th>ID</th><th>Name</th><th>Email</th><th>Action</th></tr>
//   `;

//   users.forEach(u => {
//     html += `
//       <tr>
//         <td>${u.id}</td>
//         <td>${u.name}</td>
//         <td>${u.email}</td>
//         <td>
//           <form action="/delete/${u.id}" method="POST" style="display:inline;">
//             <button type="submit">Delete</button>
//           </form>
//         </td>
//       </tr>
//     `;
//   });

//   html += `
//   </table>
//   <br><a href="/">Back to Signup</a>
//   `;
//   res.send(html);
// });

// New version: User list view
app.get("/users", (req, res) => {
  let html = `
  <h2>Registered Users</h2>
  <table border="1" cellpadding="5">
    <tr><th>ID</th><th>Name</th><th>Email</th><th>Phone</th><th>Action</th></tr>
  `;

  users.forEach(u => {
    html += `
      <tr>
        <td>${u.id}</td>
        <td>${u.name}</td>
        <td>${u.email}</td>
        <td>${u.phone || "-"}</td>
        <td>
          <form action="/delete/${u.id}" method="POST" style="display:inline;">
            <button type="submit">Delete</button>
          </form>
        </td>
      </tr>
    `;
  });

  html += `
  </table>
  <br><a href="/">Back to Signup</a>
  `;
  res.send(html);
});

// Delete user
app.post("/delete/:id", (req, res) => {
  const userId = parseInt(req.params.id);
  users = users.filter(u => u.id !== userId);
  fs.writeFileSync(DATA_FILE, JSON.stringify(users, null, 2));
  res.redirect("/users");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
