export type ProductT = {
    id: string;
    amountAvailable: number;
    cost: number;
    productName: string;
    sellerId: string;
};

export type UserT = {
    id: string;
    username: string;
    password: string;
    deposit: number;
    role: "buyer" | "seller";
};

export type ModalT =
    | "EditUser"
    | "DeleteUser"
    | "AddProduct"
    | "DeleteProduct"
    | "Deposit"
    | "EditProduct"
    | "BuyProduct"
    | null;
