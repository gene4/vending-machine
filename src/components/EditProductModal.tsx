import { useCallback, useState } from "react";
import { ModalT, ProductT } from "../../types";
import { updateProduct } from "../api";
import Modal from "./Modal";

interface Props {
    modalToOpen: ModalT;
    setModalToOpen: (modalToOpen: ModalT) => void;
    setProducts: (products: ProductT[]) => void;
    product: ProductT;
}

function EditProductModal({
    modalToOpen,
    setModalToOpen,
    setProducts,
    product,
}: Props) {
    const [productName, setProductName] = useState(product.productName);
    const [amount, setAmount] = useState(product.amountAvailable);
    const [cost, setCost] = useState(product.cost);

    const handleSubmit = useCallback(
        (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();

            if (
                productName === product.productName &&
                amount === product.amountAvailable &&
                cost === product.cost
            ) {
                setModalToOpen(null);
                return;
            }

            updateProduct(product.id, productName, amount, cost)
                .then(({ data }) => {
                    console.log(data);

                    setProducts(data.products);
                    setModalToOpen(null);
                })
                .catch((error) => {
                    console.log(error);
                });
        },
        [
            amount,
            cost,
            product.amountAvailable,
            product.cost,
            product.id,
            product.productName,
            productName,
            setModalToOpen,
            setProducts,
        ]
    );

    return (
        <Modal
            isOpen={modalToOpen === "EditProduct"}
            close={() => setModalToOpen(null)}
        >
            <div className="is-flex is-justify-content-center">
                <form onSubmit={handleSubmit}>
                    <label className="label is-flex pr-2" htmlFor="product">
                        Product
                        <input
                            type="text"
                            name="product"
                            required
                            value={productName}
                            onChange={(event) =>
                                setProductName(event.target.value)
                            }
                            className="input ml-3"
                        />
                    </label>

                    <label className="label is-flex pr-2 my-4" htmlFor="amount">
                        Amount
                        <input
                            type="number"
                            name="amount"
                            min={1}
                            value={amount}
                            required
                            onChange={(event) =>
                                setAmount(event.target.valueAsNumber)
                            }
                            className="input ml-3"
                        />
                    </label>
                    <label className="label is-flex pr-2 my-4" htmlFor="cost">
                        Cost
                        <input
                            type="number"
                            name="cost"
                            step={"any"}
                            min={0}
                            value={cost}
                            required
                            onChange={(event) =>
                                setCost(event.target.valueAsNumber)
                            }
                            className="input ml-3"
                        />
                    </label>

                    <button
                        onClick={() => setModalToOpen(null)}
                        className="button is-danger mt-5"
                        type="button"
                    >
                        Cancel
                    </button>
                    <button
                        className="button is-primary mt-5 ml-5"
                        type="submit"
                    >
                        Update
                    </button>
                </form>
            </div>
        </Modal>
    );
}

export default EditProductModal;
