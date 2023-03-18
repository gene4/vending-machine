import React, { useCallback, useState } from "react";
import { ModalT, UserT } from "../../types";
import { deposit, resetDeposit } from "../api";
import Modal from "./Modal";

interface Props {
    modalToOpen: ModalT;
    setModalToOpen: (modalToOpen: ModalT) => void;
    setUser: (user: UserT) => void;
    userDepositValue: number;
}

const values = [5, 10, 20, 50, 100];
const defaultValue = values[0];

function DepositModal({
    modalToOpen,
    setModalToOpen,
    setUser,
    userDepositValue,
}: Props) {
    const [selectedValue, setSelectedValue] = useState(defaultValue);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = useCallback(
        (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();

            setIsSubmitting(true);
            deposit(selectedValue)
                .then(({ data }) => {
                    setUser(data);
                })
                .catch((error) => {
                    console.log(error);
                })
                .finally(() => {
                    setIsSubmitting(false);
                });
        },
        [selectedValue, setUser]
    );

    const handleReset = useCallback(() => {
        resetDeposit()
            .then(({ data }) => {
                setUser(data);
            })
            .catch((error) => {
                console.log(error);
            })
            .finally(() => {
                setIsSubmitting(false);
            });
    }, [setUser]);

    const handleClose = useCallback(() => {
        setModalToOpen(null);
        setSelectedValue(defaultValue);
    }, [setModalToOpen]);

    return (
        <Modal
            isOpen={modalToOpen === "Deposit"}
            close={() => setModalToOpen(null)}
        >
            <h2 className="subtitle">Current deposit: {userDepositValue}¢</h2>
            <form className="p-0" onSubmit={handleSubmit}>
                <div className="is-flex is-justify-content-center">
                    {values.map((value) => (
                        <label
                            key={value}
                            className="ml-5 mb-3 is-block"
                            htmlFor="value"
                        >
                            {value}¢
                            <input
                                type="radio"
                                name="value"
                                value={value}
                                checked={value === selectedValue}
                                onChange={() => setSelectedValue(value)}
                                className="radio mx-2"
                            />
                        </label>
                    ))}
                </div>
                <div className="is-flex is-justify-content-center">
                    <button
                        onClick={handleClose}
                        className="button is-warning mt-3"
                        type="button"
                    >
                        Close
                    </button>
                    <button
                        onClick={handleReset}
                        className="button is-link mt-3 mx-5"
                        type="button"
                    >
                        Reset
                    </button>
                    <button
                        disabled={isSubmitting}
                        className="button is-primary mt-3"
                        type="submit"
                    >
                        Deposit
                    </button>
                </div>
            </form>
        </Modal>
    );
}

export default DepositModal;
