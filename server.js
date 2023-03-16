const express = require("express");
const bcrypt = require("bcrypt");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const app = express();
const port = 8080;

let { users, products } = require("./data.ts");

// MIDDLEWARE

const verifyToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        const decoded = jwt.verify(token, "secret");
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({ message: "Invalid token" });
    }
};

const verifyRole = (roleToCheck) => (req, res, next) => {
    if (req.user.role === roleToCheck) {
        next();
    } else {
        return res.status(401).json({ message: "Unauthorized role" });
    }
};

app.use(express.json());
app.use(cors());

// USER ROUTES

app.post("/api/register", async (req, res) => {
    // Register new user
    const uuid = crypto.randomUUID();
    const { username, password, deposit, role } = req.body.newUser;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const user = {
            id: uuid,
            username,
            password: hashedPassword,
            deposit,
            role,
        };

        const token = jwt.sign({ id: user.id, role: user.role }, "secret", {
            expiresIn: "1h",
        });
        users.push(user);
        console.log(user);
        return res.json({ token, user });
    } catch {
        res.status(500).send();
    }
});

app.post("/api/signin", async (req, res) => {
    // Signin user
    const user = users.find((user) => user.username === req.body.username);
    if (user == null) {
        return res.status(400).send("Cannot find user");
    }
    try {
        if (await bcrypt.compare(req.body.password, user.password)) {
            const token = jwt.sign({ id: user.id, role: user.role }, "secret", {
                expiresIn: "1h",
            });
            return res.json({ token, user });
        } else {
            res.send("Problem with encrypting password");
        }
    } catch {
        res.status(500).send();
    }
});

app.get("/api/user/:id", verifyToken, async (req, res) => {
    // Get user
    const id = req.params.id;
    const user = users.find((user) => user.id === id);

    if (user == null) {
        return res.status(400).send("Cannot find user");
    }
    try {
        return res.json({ user });
    } catch {
        res.status(500).send();
    }
});

app.put("/api/user/:id", async (req, res) => {
    // Update user
    const { id } = req.params;
    const { username, password } = req.body;

    try {
        const userToUpdate = users.find((user) => user.id === id);
        if (userToUpdate) {
            userToUpdate.username = username;
            userToUpdate.password = password;

            users = users.map((user) => (user.id === id ? userToUpdate : user));
            res.send(userToUpdate);
        }
    } catch {
        res.status(500).send();
    }
});

app.delete("/api/user/:id", verifyToken, async (req, res) => {
    // Delete user
    const { id } = req.params;
    if (req.user.id !== id) {
        return res
            .status(401)
            .json({ message: "Only the user can delete their own account" });
    }
    try {
        users = users.filter((user) => user.id !== id);
        return res.json({ users });
    } catch {
        res.status(500).send();
    }
});

// PRODUCT ROUTES

app.get("/api/products", verifyToken, async (req, res) => {
    try {
        res.send(products);
    } catch {
        res.status(500).send();
    }
});

app.post(
    "/api/products",
    [verifyToken, verifyRole("seller")],
    async (req, res) => {
        const { product, cost, amount } = req.body;
        const uuid = crypto.randomUUID();
        const newProduct = {
            id: uuid,
            productName: product,
            amountAvailable: amount,
            cost,
            sellerId: req.user.id,
        };

        try {
            products.push(newProduct);
            console.log(newProduct);
            return res.json({ products });
        } catch {
            res.status(500).send();
        }
    }
);

app.delete("/api/product/:id", verifyToken, async (req, res) => {
    const { id } = req.params;
    const productToDelete = products.find((product) => product.id === id);

    if (req.user.id !== productToDelete.sellerId) {
        return res
            .status(401)
            .json({ message: "Only the seller of this product can delete it" });
    }

    try {
        products = products.filter((product) => product.id !== id);
        return res.json({ products });
    } catch {
        res.status(500).send();
    }
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
