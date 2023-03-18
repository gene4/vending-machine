const express = require("express");
const bcrypt = require("bcrypt");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const app = express();
const port = 8080;

let { users, products, depositValues } = require("./data.ts");
const { giveBackChange } = require("./utils.js");

// MIDDLEWARE

const verifyToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).send("Unauthorized");
    }

    try {
        // TODO set up a secret for production
        const decoded = jwt.verify(token, "secret");
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).send("Invalid token");
    }
};

const verifyRole = (roleToCheck) => (req, res, next) => {
    if (req.user.role === roleToCheck) {
        next();
    } else {
        return res.status(401).send("Unauthorized role");
    }
};

app.use(express.json());
app.use(cors());

// USER ROUTES

app.post("/api/signup", async (req, res) => {
    // Register new user
    const uuid = crypto.randomUUID();
    const { username, password, role } = req.body.newUser;

    const checkIfUsernameExists = users.find(
        (user) => user.username === username
    );
    if (checkIfUsernameExists) {
        return res.status(400).send("This username already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = {
        id: uuid,
        username,
        password: hashedPassword,
        deposit: 0,
        role,
    };

    const token = jwt.sign(
        {
            id: user.id,
            role: user.role,
            username: user.username,
        },
        "secret",
        {
            expiresIn: "1h",
        }
    );

    users.push(user);

    try {
        return res.json({ token, user });
    } catch {
        res.status(500).send();
    }
});

app.post("/api/signin", async (req, res) => {
    // Signin user
    const { username, password } = req.body;
    const user = users.find((user) => user.username === username);
    if (user == null) {
        return res.status(400).send("Username or password are incorrect");
    }
    try {
        if (await bcrypt.compare(password, user.password)) {
            const token = jwt.sign(
                {
                    id: user.id,
                    role: user.role,
                    username: user.username,
                },
                "secret",
                {
                    expiresIn: "1h",
                }
            );
            return res.json({ token, user });
        } else {
            return res.status(400).send("Username or password are incorrect");
        }
    } catch {
        res.status(500).send();
    }
});

app.get("/api/user", verifyToken, async (req, res) => {
    // Get user
    const id = req.user.id;
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

app.put("/api/user", verifyToken, async (req, res) => {
    // Update user
    const { username, password } = req.body;

    const userToUpdate = users.find((user) => user.id === req.user.id);

    if (userToUpdate == null) {
        return res.status(400).send("Cannot find user");
    }

    // update only if username or password are different from the original value
    if (username !== req.user.username) {
        userToUpdate.username = username;
    }

    if (password !== req.user.password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        userToUpdate.password = hashedPassword;
    }

    try {
        res.send(userToUpdate);
    } catch {
        res.status(500).send();
    }
});

app.delete("/api/user", verifyToken, async (req, res) => {
    // Delete user
    const { id } = req.user;
    users = users.filter((user) => user.id !== id);

    try {
        return res.json({ users });
    } catch {
        res.status(500).send();
    }
});

app.post("/api/deposit", [verifyToken, verifyRole("buyer")], (req, res) => {
    const { value } = req.body;
    const userId = req.user.id;

    if (!depositValues.includes(value)) {
        return res
            .status(422)
            .send("This machine only expects 5¢, 10¢, 20¢, 50¢ or 100¢ coins");
    }

    const userToUpdate = users.find((user) => user.id === userId);
    userToUpdate.deposit += value;

    try {
        res.send(userToUpdate);
    } catch {
        res.status(500).send();
    }
});

app.delete(
    "/api/resetDeposit",
    [verifyToken, verifyRole("buyer")],
    (req, res) => {
        const userId = req.user.id;
        const userToUpdate = users.find((user) => user.id === userId);

        if (userToUpdate == null) {
            return res.status(400).send("Cannot find user");
        }

        userToUpdate.deposit = 0;

        try {
            res.send(userToUpdate);
        } catch {
            res.status(500).send();
        }
    }
);

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
        const { product, amount, cost } = req.body;
        const uuid = crypto.randomUUID();

        const newProduct = {
            id: uuid,
            productName: product,
            amountAvailable: amount,
            cost,
            sellerId: req.user.id,
        };
        products.push(newProduct);

        try {
            return res.send(newProduct);
        } catch {
            res.status(500).send();
        }
    }
);

app.delete("/api/product/:id", verifyToken, async (req, res) => {
    const { id } = req.params;
    const productToDelete = products.find((product) => product.id === id);

    if (productToDelete == null) {
        return res.status(400).send("Cannot find product");
    }

    if (req.user.id !== productToDelete.sellerId) {
        return res
            .status(401)
            .json("Only the seller of this product can delete it");
    }

    products = products.filter((product) => product.id !== id);

    try {
        return res.json({ products });
    } catch {
        res.status(500).send();
    }
});

app.put("/api/product/:id", verifyToken, async (req, res) => {
    const { id } = req.params;
    const { product, cost, amount } = req.body;
    const productToUpdate = products.find((product) => product.id === id);

    if (productToUpdate == null) {
        return res.status(400).send("Cannot find product");
    }

    if (req.user.id !== productToUpdate.sellerId) {
        return res
            .status(401)
            .json("Only the seller of this product can update it");
    }

    productToUpdate.productName = product;
    productToUpdate.cost = cost;
    productToUpdate.amountAvailable = amount;

    try {
        return res.json({ products });
    } catch {
        res.status(500).send();
    }
});

app.post(
    "/api/buy/:id",
    [verifyToken, verifyRole("buyer")],
    async (req, res) => {
        const { amount } = req.body;
        const { id } = req.params;
        const userId = req.user.id;

        const user = users.find((user) => user.id === userId);
        const productToBuy = products.find((product) => product.id === id);

        if (!productToBuy) {
            return res.status(400).send("Cannot find product");
        }
        // Check if product's amount is available
        if (productToBuy.amountAvailable < amount) {
            return res
                .status(401)
                .send(
                    `Only ${productToBuy.amountAvailable} are available for this product`
                );
        }

        // Check if the user have enough money
        if (user.deposit - productToBuy.cost * amount < 0) {
            return res
                .status(401)
                .send("You don't have enough money for this purchase");
        }

        // Update product's amount; if the left amount is 0, remove from list
        const leftAmount = productToBuy.amountAvailable - amount;
        productToBuy.amountAvailable = leftAmount;

        if (leftAmount === 0) {
            products = products.filter((product) => product.id !== id);
        }

        const receipt = {
            product: productToBuy,
            total: productToBuy.cost * amount,
            change: giveBackChange(user.deposit - productToBuy.cost * amount),
        };

        user.deposit -= productToBuy.cost * amount;

        try {
            return res.json({ receipt, products, user });
        } catch {
            res.status(500).send();
        }
    }
);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
