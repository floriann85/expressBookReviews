const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

// 1. First session
app.use("/customer", session({
    secret: "fingerprint_customer",
    resave: true,
    saveUninitialized: true
}));

// 2. Register customer routes
app.use("/customer", customer_routes);

// 3. Auth middleware AFTER the customer routes
app.use("/customer/auth/*", function auth(req, res, next) {
    if (req.session.authorization) {
        let token = req.session.authorization['accessToken'];

        jwt.verify(token, "access", (err, user) => {
            if (!err) {
                req.user = user;
                next();
            } else {
                return res.status(403).json({ message: "User not authenticated" });
            }
        });

    } else {
        return res.status(403).json({ message: "User not logged in" });
    }
});

// 4. General routes
app.use("/", genl_routes);

const PORT = 5000;
app.listen(PORT, () => console.log("Server is running"));
