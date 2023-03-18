const request = require("supertest");
const baseURL = "http://localhost:8080";
const jwt = require("jsonwebtoken");

describe("POST /api/deposit", () => {
    const user = {
        id: "dd879625-29b7-45cc-bdd8-e4d5aadb32b4",
        role: "buyer",
    };
    const amountToDeposit = { value: 50 };
    let initialAmount;

    beforeAll(async () => {
        const response = await request(baseURL)
            .get("/api/user")
            .set("Authorization", `Bearer ${jwt.sign(user, "secret")}`);

        initialAmount = response.body.user.deposit;
    });

    it("should add the amountToDeposit to initialAmount", async () => {
        const response = await request(baseURL)
            .post("/api/deposit")
            .send(amountToDeposit)
            .set("Authorization", `Bearer ${jwt.sign(user, "secret")}`);

        const updatedUser = response.body;
        expect(response.statusCode).toBe(200);
        expect(updatedUser.deposit).toBe(initialAmount + amountToDeposit.value);
    });

    it("should return that the amount isn't a valid value", async () => {
        amountToDeposit.value = 25;
        const response = await request(baseURL)
            .post("/api/deposit")
            .send(amountToDeposit)
            .set("Authorization", `Bearer ${jwt.sign(user, "secret")}`);

        expect(response.statusCode).toBe(422);
        expect(response.res.text).toBe(
            "This machine only expects 5¢, 10¢, 20¢, 50¢ or 100¢ coins"
        );
    });

    it("should return Unauthorized because the user doesn't have a buyer role", async () => {
        user.role = "seller";
        const response = await request(baseURL)
            .post("/api/deposit")
            .send(amountToDeposit)
            .set("Authorization", `Bearer ${jwt.sign(user, "secret")}`);

        expect(response.statusCode).toBe(401);
        expect(response.res.text).toBe("Unauthorized role");
    });
});
