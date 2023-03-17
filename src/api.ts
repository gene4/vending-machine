import axios from "axios";

export const signup = (newUser: {
    username: string;
    password: string;
    role: string;
}) => {
    return axios.post("http://localhost:8080/api/signup", {
        newUser,
    });
};

export const signin = (username: string, password: string) => {
    return axios.post("http://localhost:8080/api/signin", {
        username,
        password,
    });
};

export const getUser = () => {
    const token = localStorage.getItem("token");
    return axios.get("http://localhost:8080/api/user", {
        headers: { Authorization: `Bearer ${token}` },
    });
};

export const updateUser = (username: string, password: string) => {
    const token = localStorage.getItem("token");
    return axios.put(
        `http://localhost:8080/api/user`,
        {
            username,
            password,
        },
        {
            headers: { Authorization: `Bearer ${token}` },
        }
    );
};

export const deleteUser = () => {
    const token = localStorage.getItem("token");
    return axios.delete("http://localhost:8080/api/user", {
        headers: { Authorization: `Bearer ${token}` },
    });
};

export const deposit = (value: number) => {
    const token = localStorage.getItem("token");
    return axios.post(
        `http://localhost:8080/api/deposit`,
        {
            value,
        },
        {
            headers: { Authorization: `Bearer ${token}` },
        }
    );
};

export const resetDeposit = () => {
    const token = localStorage.getItem("token");
    console.log("token", token);

    return axios.delete("http://localhost:8080/api/resetDeposit", {
        headers: { Authorization: `Bearer ${token}` },
    });
};

export const getProducts = () => {
    const token = localStorage.getItem("token");
    return axios.get("http://localhost:8080/api/products", {
        headers: { Authorization: `Bearer ${token}` },
    });
};

export const addProduct = (product: string, amount: number, cost: number) => {
    const token = localStorage.getItem("token");
    return axios.post(
        "http://localhost:8080/api/products",
        {
            product,
            amount,
            cost,
        },
        {
            headers: { Authorization: `Bearer ${token}` },
        }
    );
};

export const updateProduct = (
    id: string,
    product: string,
    amount: number,
    cost: number
) => {
    const token = localStorage.getItem("token");
    return axios.put(
        `http://localhost:8080/api/product/${id}`,
        {
            product,
            amount,
            cost,
        },
        {
            headers: { Authorization: `Bearer ${token}` },
        }
    );
};

export const deleteProduct = (productId: string) => {
    const token = localStorage.getItem("token");
    return axios.delete(`http://localhost:8080/api/product/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
};

export const buyProduct = (id: string, amount: number) => {
    const token = localStorage.getItem("token");
    return axios.post(
        `http://localhost:8080/api/buy/${id}`,
        {
            amount,
        },
        {
            headers: { Authorization: `Bearer ${token}` },
        }
    );
};
