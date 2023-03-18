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

type ReceiptT = {
    product: ProductT;
    total: number;
    change: number[];
};

function BuyProductModal({
    modalToOpen,
    setModalToOpen,
    setProducts,
    amount,
    product,
    setUser,
}: Props) {
    const [receipt, setReceipt] = useState<ReceiptT | undefined>();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const runBuyProduct = useCallback(() => {
        setIsLoading(true);

        buyProduct(product.id, amount)
            .then(({ data }) => {
                setReceipt(data.receipt);
                setProducts(data.products);
                setUser(data.user);
                setIsLoading(false);
            })
            .catch((error) => {
                console.log(error);
                setError(error.response.data);
                setIsLoading(false);
            });
    }, [amount, product.id, setProducts, setUser]);

    const handleClose = useCallback(() => {
        setModalToOpen(null);
        setReceipt(undefined);
        setIsLoading(false);
        setError("");
    }, [setModalToOpen]);

    return (
        <Modal isOpen={modalToOpen === "BuyProduct"} close={handleClose}>
            {receipt ? (
                <span>
                    <h2 className="title">Receipt ✅</h2>
                    <div className="is-flex is-justify-content-center is-align-items-center">
                        <p className="is-size-1 mr-5">
                            {receipt.product.productName}
                        </p>
                        <p> Total: {receipt.total}¢</p>
                    </div>
                    <div className="mb-3 is-flex is-justify-content-center">
                        Change:{" "}
                        {receipt.change.length !== 0
                            ? receipt.change.map((coin, index) => (
                                  <p key={index} className="coin">
                                      {coin}
                                  </p>
                              ))
                            : 0}
                    </div>
                </span>
            ) : (
                <span className="is-size-5">
                    <p className="is-size-1">{product.productName}</p>
                    <p>{`${product.cost}¢ x ${amount}`}</p>
                    <b className="mt-3"> Total: {product.cost * amount}¢</b>
                </span>
            )}
            <p className="has-text-danger mt-2"> {error}</p>
            <button
                onClick={handleClose}
                className="button is-warning mt-5"
                type="button"
            >
                Close
            </button>
            {!receipt && (
                <button
                    onClick={runBuyProduct}
                    className={`button is-primary mt-5 ml-5 ${
                        isLoading && "is-loading"
                    }`}
                    disabled={isLoading || !!error}
                    type="button"
                >
                    Buy
                </button>
            )}
        </Modal>
    );
}

export default BuyProductModal;
