const request = require("supertest");
const baseURL = "http://localhost:8080";
const jwt = require("jsonwebtoken");

describe("POST /api/signup", () => {
    const user = {
        username: "test-user",
        password: "password",
        role: "seller",
    };

    it("should create a user and a token", async () => {
        const response = await request(baseURL)
            .post(`/api/signup`)
            .send(user)
            .set("Authorization", `Bearer ${jwt.sign(user, "secret")}`);
        expect(response.statusCode).toBe(200);
        expect(response.body.user.username).toBe(user.username);
        expect(response.body.token).toBeTruthy();
    });

    it("should return that username already exists", async () => {
        const response = await request(baseURL)
            .post(`/api/signup`)
            .send(user)
            .set("Authorization", `Bearer ${jwt.sign(user, "secret")}`);
        expect(response.statusCode).toBe(400);
        expect(response.res.text).toBe("This username already exists");
    });
});

describe("GET /api/user", () => {
    const user = {
        id: "dd879625-29b7-45cc-bdd8-e4d5aadb32b4",
    };
    it("should get the user", async () => {
        const response = await request(baseURL)
            .get(`/api/user`)
            .set("Authorization", `Bearer ${jwt.sign(user, "secret")}`);
        expect(response.statusCode).toBe(200);
        expect(response.body.user.id).toBe(user.id);
    });
});

describe("PUT /api/user", () => {
    const user = {
        id: "dd879625-29b7-45cc-bdd8-e4d5aadb32b4",
    };
    it("should get the user", async () => {
        const response = await request(baseURL)
            .put(`/api/user`)
            .send({ username: "new-user-name", password: "new-password" })
            .set("Authorization", `Bearer ${jwt.sign(user, "secret")}`);
        expect(response.statusCode).toBe(200);
        expect(response.body.username).toBe("new-user-name");
    });
});

describe("DELETE /api/user", () => {
    const userToDelete = {
        id: "dd879625-29b7-45cc-bdd8-e4d5aadb32b4",
    };
    it("should return users without the deleted user", async () => {
        const response = await request(baseURL)
            .delete(`/api/user`)
            .set("Authorization", `Bearer ${jwt.sign(userToDelete, "secret")}`);

        const updatedUsers = response.body.users;
        const checkForDeletedUser = updatedUsers.find(
            (user) => user.id === userToDelete.id
        );

        expect(response.statusCode).toBe(200);
        expect(checkForDeletedUser).toBeFalsy();
    });
});
