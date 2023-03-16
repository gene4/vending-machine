import axios from "axios";
import { useState } from "react";
import { ModalT, UserT } from "../../types";
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

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log("user.id", user.id);

        axios
            .put(`http://localhost:8080/api/user/${user.id}`, {
                username,
                password,
            })
            .then(function ({ data }) {
                setUser(data);
                setModalToOpen(null);
            })
            .catch(function (error) {
                console.log(error);
            });
    };

    return (
        <Modal
            isOpen={modalToOpen === "EditUser"}
            close={() => setModalToOpen(null)}
        >
            <div className="is-flex is-justify-content-center">
                <form onSubmit={handleSubmit}>
                    <label className="label is-flex pr-2" htmlFor="username">
                        Username
                        <input
                            type="text"
                            name="username"
                            required
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
                            value={password}
                            required
                            onChange={(event) =>
                                setPassword(event.target.value)
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
                        className="button is-primary mt-5  ml-5"
                        type="submit"
                    >
                        Update
                    </button>
                </form>
            </div>
        </Modal>
    );
}

export default EditUserModal;
