const express = require("express");
const bcrypt = require("bcrypt");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const app = express();
const port = 8080;

let users = [
    {
        id: "dd879625-29b7-45cc-bdd8-e4d5aadb32b4",
        username: "gene4",
        password:
            "$2b$10$.2sV6zq45fLei/Mebuy2l.gjToLzJqx2dZMF3nr1.poQHhOaahsXe",
        deposit: 0,
        role: "seller",
    },
];
let products = [
    {
        id: "1",
        amountAvailable: 2,
        cost: 10,
        productName: "🍊",
        sellerId: "dsjhfkjdsfh",
    },
    {
        id: "2",
        amountAvailable: 2,
        cost: 10,
        productName: "🧃",
        sellerId: "dsjhfkjdsfh",
    },
    {
        id: "3",
        amountAvailable: 2,
        cost: 10,
        productName: "🍫",
        sellerId: "dsjhfkjdsfh",
    },
    {
        id: "4",
        amountAvailable: 2,
        cost: 10,
        productName: "🍊",
        sellerId: "dsjhfkjdsfh",
    },
    {
        id: "5",
        amountAvailable: 2,
        cost: 10,
        productName: "🧃",
        sellerId: "dsjhfkjdsfh",
    },
    {
        id: "6",
        amountAvailable: 2,
        cost: 10,
        productName: "🍫",
        sellerId: "dsjhfkjdsfh",
    },
    {
        id: "7",
        amountAvailable: 2,
        cost: 10,
        productName: "🍊",
        sellerId: "dsjhfkjdsfh",
    },
    {
        id: "8",
        amountAvailable: 2,
        cost: 10,
        productName: "🧃",
        sellerId: "dsjhfkjdsfh",
    },
    {
        id: "9",
        amountAvailable: 2,
        cost: 10,
        productName: "🍫",
        sellerId: "dsjhfkjdsfh",
    },
    {
        id: "10",
        amountAvailable: 2,
        cost: 10,
        productName: "🍊",
        sellerId: "dsjhfkjdsfh",
    },
    {
        id: "11",
        amountAvailable: 2,
        cost: 10,
        productName: "🧃",
        sellerId: "dsjhfkjdsfh",
    },
    {
        id: "12",
        amountAvailable: 2,
        cost: 10,
        productName: "🍫",
        sellerId: "dsjhfkjdsfh",
    },
];

//middleware
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

app.use(express.json());
app.use(cors());
//routes

app.get("/api/users", async (req, res) => {
    res.send(users);
});

app.post("/api/register", async (req, res) => {
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

app.get("/api/products", verifyToken, async (req, res) => {
    try {
        res.send(products);
    } catch {
        res.status(500).send();
    }
});

app.post("/api/products", verifyToken, async (req, res) => {
    // make that only a "seller" user can post
    const { product, cost, amount } = req.body;
    const uuid = crypto.randomUUID();
    const newProduct = {
        id: uuid,
        productName: product,
        amountAvailable: amount,
        cost,
        sellerId: req.user.id,
    };

    if (req.user.role !== "seller") {
        return res
            .status(401)
            .json({ message: "Only sellers can sell products" });
    }

    try {
        products.push(newProduct);
        console.log(newProduct);
        return res.json({ products });
    } catch {
        res.status(500).send();
    }
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
