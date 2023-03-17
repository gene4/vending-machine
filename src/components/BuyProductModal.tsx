import { useCallback, useState } from "react";
import { ModalT, ProductT, UserT } from "../../types";
import { buyProduct } from "../api";
import Modal from "./Modal";

interface Props {
    modalToOpen: ModalT;
    setModalToOpen: (modalToOpen: ModalT) => void;
    setProducts: (products: ProductT[]) => void;
    amount: number;
    product: ProductT;
    setUser: (user: UserT) => void;
}

function BuyProductModal({
    modalToOpen,
    setModalToOpen,
    setProducts,
    amount,
    product,
    setUser,
}: Props) {
    const [purchaseStatus, setPurchaseStatus] = useState("waiting to start");
    const [error, setError] = useState("");

    const runBuyProduct = useCallback(() => {
        buyProduct(product.id, amount)
            .then(({ data }) => {
                const { product, total, change } = data.receipt;

                // setMessage(
                //     `Product:${
                //         product.productName
                //     } Total:${total}¢ Change:${change.map(
                //         (coin: number) => coin
                //     )} `
                // );
                console.log("user", data.user);

                setProducts(data.products);
                setUser(data.user);
            })
            .catch((error) => {
                console.log(error);
            });
    }, [amount, product.id, setProducts, setUser]);

    const handleClose = useCallback(() => {
        setModalToOpen(null);
        setError("");
    }, [setModalToOpen]);

    return (
        <Modal isOpen={modalToOpen === "BuyProduct"} close={handleClose}>
            <span className="is-size-5">
                <p>Product: {product.productName}</p>
                <p>Price: {product.cost}¢</p>
                <p>Amount: {amount}</p>
                <p> Total: {product.cost * amount}¢</p>
            </span>
            <p> {error}</p>
            <button
                onClick={handleClose}
                className="button is-warning mt-5 mr-5"
                type="button"
            >
                Close
            </button>
            <button
                onClick={runBuyProduct}
                className="button is-primary mt-5"
                type="button"
            >
                Buy
            </button>
        </Modal>
    );
}

export default BuyProductModal;
