import React, { useCallback, useState } from "react";
import { ModalT, ProductT } from "../../types";
import { addProduct } from "../api";
import Modal from "./Modal";
interface Props {
    modalToOpen: ModalT;
    setModalToOpen: (modalToOpen: ModalT) => void;
    setProducts: (products: ProductT[]) => void;
    products: ProductT[];
}

const defaultValues = {
    product: "",
    amount: 1,
    cost: 0,
};
function AddProductModal({
    modalToOpen,
    setModalToOpen,
    setProducts,
    products,
}: Props) {
    const [product, setProduct] = useState(defaultValues.product);
    const [amount, setAmount] = useState(defaultValues.amount);
    const [cost, setCost] = useState(defaultValues.cost);

    const handleSubmit = useCallback(
        (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            addProduct(product, amount, cost)
                .then(({ data }) => {
                    setProducts([...products, data]);
                    setModalToOpen(null);

                    setProduct(defaultValues.product);
                    setAmount(defaultValues.amount);
                    setCost(defaultValues.cost);
                })
                .catch((error) => {
                    console.log(error);
                });
        },
        [amount, cost, product, products, setModalToOpen, setProducts]
    );
    return (
        <Modal
            isOpen={modalToOpen === "AddProduct"}
            close={() => setModalToOpen(null)}
        >
            <div className="is-flex is-justify-content-center">
                <form onSubmit={handleSubmit}>
                    <label
                        className="label is-flex is-align-items-center"
                        htmlFor="username"
                    >
                        Product
                        <input
                            type="text"
                            name="username"
                            required
                            value={product}
                            onChange={(event) => setProduct(event.target.value)}
                            className="input ml-5"
                        />
                    </label>

                    <label
                        className="label is-flex is-align-items-center my-4"
                        htmlFor="amount"
                    >
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
                            className="input ml-5"
                        />
                    </label>
                    <label
                        className="label is-flex is-align-items-center my-4"
                        htmlFor="cost"
                    >
                        Cost
                        <input
                            type="number"
                            name="cost"
                            step={5}
                            min={0}
                            value={cost}
                            required
                            onChange={(event) =>
                                setCost(event.target.valueAsNumber)
                            }
                            className="input ml-5"
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
                        Add
                    </button>
                </form>
            </div>
        </Modal>
    );
}

export default AddProductModal;
