import axios from "axios";
import React, { useState } from "react";
import { ModalT, ProductT } from "../../types";
import Modal from "./Modal";
interface Props {
    modalToOpen: ModalT;
    setModalToOpen: (modalToOpen: ModalT) => void;
    setProducts: (products: ProductT[]) => void;
}
function AddProductModal({ modalToOpen, setModalToOpen, setProducts }: Props) {
    const [product, setProduct] = useState("");
    const [amount, setAmount] = useState(1);
    const [cost, setCost] = useState(0);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const token = localStorage.getItem("token");
        axios
            .post(
                "http://localhost:8080/api/products",
                {
                    product,
                    amount,
                    cost,
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            )
            .then(function ({ data }) {
                setProducts(data.products);
                setModalToOpen(null);
                setProduct(" ");
                setAmount(0);
                setCost(0);
            })
            .catch(function (error) {
                console.log(error);
            });
    };
    return (
        <Modal
            isOpen={modalToOpen === "AddProduct"}
            close={() => setModalToOpen(null)}
        >
            <div className="is-flex is-justify-content-center">
                <form onSubmit={handleSubmit}>
                    <label className="label is-flex pr-2" htmlFor="username">
                        Product
                        <input
                            type="text"
                            name="username"
                            required
                            value={product}
                            onChange={(event) => setProduct(event.target.value)}
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
                    <label className="label is-flex pr-2 my-4" htmlFor="amount">
                        Cost
                        <input
                            type="number"
                            name="amount"
                            step={"any"}
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
                        Add
                    </button>
                </form>
            </div>
        </Modal>
    );
}

export default AddProductModal;
