const request = require("supertest");
const baseURL = "http://localhost:8080";
const jwt = require("jsonwebtoken");

describe("POST /api/buy/:id", () => {
    const user = {
        id: "dd879625-29b7-45cc-bdd8-e4d5aadb32b4",
        deposit: 100,
    };

    let testProduct;
    let amountToBuy = { amount: 1 };

    beforeAll(async () => {
        // Insert a test product
        user.role = "seller";
        const response = await request(baseURL)
            .post("/api/products")
            .send({
                amount: 5,
                cost: 20,
                product: "🍌",
            })
            .set("Authorization", `Bearer ${jwt.sign(user, "secret")}`);
        testProduct = response.body;

        // Deposit money
        user.role = "buyer";
        await request(baseURL)
            .post("/api/deposit")
            .send({ value: 100 })
            .set("Authorization", `Bearer ${jwt.sign(user, "secret")}`);
    });

    it("should return Unauthorized because the user doesn't have a buyer role", async () => {
        user.role = "seller";
        const response = await request(baseURL)
            .post(`/api/buy/${testProduct.id}`)
            .set("Authorization", `Bearer ${jwt.sign(user, "secret")}`);

        expect(response.statusCode).toBe(401);
        expect(response.res.text).toBe("Unauthorized role");
    });

    it("should return a receipt with the product bought, total cost and change", async () => {
        user.role = "buyer";
        const response = await request(baseURL)
            .post(`/api/buy/${testProduct.id}`)
            .send(amountToBuy)
            .set("Authorization", `Bearer ${jwt.sign(user, "secret")}`);

        testProduct.amountAvailable -= amountToBuy.amount;
        const receipt = response.body.receipt;

        expect(response.statusCode).toBe(200);
        expect(receipt.product).toStrictEqual(testProduct);
        expect(receipt.total).toBe(testProduct.cost * amountToBuy.amount);
        expect(receipt.change).toStrictEqual([50, 20, 10]);
    });

    it("should return that the product doesn't exist", async () => {
        const response = await request(baseURL)
            .post(`/api/buy/non-existing-id`)
            .send(amountToBuy)
            .set("Authorization", `Bearer ${jwt.sign(user, "secret")}`);

        expect(response.statusCode).toBe(400);
        expect(response.res.text).toBe("Cannot find product");
    });

    it("should return that the amount of products to buy isn't available", async () => {
        const response = await request(baseURL)
            .post(`/api/buy/${testProduct.id}`)
            .send({ amount: 200 })
            .set("Authorization", `Bearer ${jwt.sign(user, "secret")}`);

        expect(response.statusCode).toBe(401);
        expect(response.res.text).toBe(
            `Only ${testProduct.amountAvailable} are available for this product`
        );
    });

    it("should return that user doesn't have enough money", async () => {
        // Reset deposit
        const res = await request(baseURL)
            .delete(`/api/resetDeposit`)
            .set("Authorization", `Bearer ${jwt.sign(user, "secret")}`);
        console.log("res.body", res);

        const response = await request(baseURL)
            .post(`/api/buy/${testProduct.id}`)
            .send(amountToBuy)
            .set("Authorization", `Bearer ${jwt.sign(user, "secret")}`);

        expect(response.statusCode).toBe(401);
        expect(response.res.text).toBe(
            "You don't have enough money for this purchase"
        );
    });

    afterAll(async () => {
        // Remove a test product
        user.role = "seller";
        await request(baseURL)
            .delete(`/api/product/${testProduct.id}`)
            .set("Authorization", `Bearer ${jwt.sign(user, "secret")}`);
    });
});
