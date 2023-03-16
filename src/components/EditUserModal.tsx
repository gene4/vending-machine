import axios from "axios";
import { useCallback, useState } from "react";
import { ModalT, UserT } from "../../types";
import { updateUser } from "../api";
import Modal from "./Modal";

interface Props {
    modalToOpen: ModalT;
    setModalToOpen: (modalToOpen: ModalT) => void;
    setUser: (user: UserT) => void;
    user: UserT;
}

function EditUserModal({ modalToOpen, setModalToOpen, setUser, user }: Props) {
    const [username, setUsername] = useState(user.username);
    const [password, setPassword] = useState(user.password);
    const [isUserChanged, setIsUserChanged] = useState(false);

    const handleSubmit = useCallback(
        (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();

            if (username === user.username && password === user.password) {
                setModalToOpen(null);
                return;
            }

            updateUser(username, password)
                .then(({ data }) => {
                    setIsUserChanged(true);
                    setUser(data);
                })
                .catch((error) => {
                    console.log(error);
                });
        },
        [
            password,
            setModalToOpen,
            setUser,
            user.password,
            user.username,
            username,
        ]
    );

    const handleClose = () => {
        setModalToOpen(null);
        setIsUserChanged(false);
    };

    return (
        <Modal
            isOpen={modalToOpen === "EditUser"}
            close={() => setModalToOpen(null)}
        >
            <div className="is-flex is-justify-content-center">
                <form onSubmit={handleSubmit}>
                    {isUserChanged ? (
                        <h2 className="subtitle">
                            Your details were change successfully!
                        </h2>
                    ) : (
                        <>
                            <label
                                className="label is-flex pr-2"
                                htmlFor="username"
                            >
                                Username
                                <input
                                    type="text"
                                    name="username"
                                    value={username}
                                    onChange={(event) =>
                                        setUsername(event.target.value)
                                    }
                                    className="input ml-3"
                                />
                            </label>

                            <label
                                className="label is-flex pr-2 my-4"
                                htmlFor="password"
                            >
                                Password
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Type new password..."
                                    onChange={(event) =>
                                        setPassword(event.target.value)
                                    }
                                    className="input ml-3"
                                />
                            </label>
                        </>
                    )}
                    {isUserChanged ? (
                        <button
                            onClick={handleClose}
                            className="button is-primary mt-5"
                            type="button"
                        >
                            Close
                        </button>
                    ) : (
                        <>
                            <button
                                onClick={() => setModalToOpen(null)}
                                className="button is-danger mt-5"
                                type="button"
                            >
                                Cancel
                            </button>
                            <button
                                className="button is-primary mt-5  ml-5"
                                type="submit"
                            >
                                Update
                            </button>
                        </>
                    )}
                </form>
            </div>
        </Modal>
    );
}

export default EditUserModal;
