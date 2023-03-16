import axios from "axios";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ModalT, UserT } from "../../types";
import { deleteUser } from "../api";
import Modal from "./Modal";

interface Props {
    modalToOpen: ModalT;
    setModalToOpen: (modalToOpen: ModalT) => void;
    setUser: (user: UserT | undefined) => void;
}

function DeleteUserModal({
    modalToOpen,
    setModalToOpen,

    setUser,
}: Props) {
    const navigate = useNavigate();

    const handleDelete = useCallback(() => {
        deleteUser()
            .then(() => {
                setUser(undefined);
                setModalToOpen(null);
                localStorage.removeItem("token");
                navigate("/");
            })
            .catch((error) => {
                console.log(error);
            });
    }, [navigate, setModalToOpen, setUser]);

    return (
        <Modal
            isOpen={modalToOpen === "DeleteUser"}
            close={() => setModalToOpen(null)}
        >
            <h1 className="subtitle">
                Are you absolutely sure you want to delete this user?!
            </h1>
            <div className="is-flex is-justify-content-center">
                <button
                    onClick={() => setModalToOpen(null)}
                    className="button is-primary mt-3"
                    type="button"
                >
                    Cancel
                </button>
                <button
                    onClick={handleDelete}
                    className="button is-danger mt-3  ml-5"
                    type="submit"
                >
                    Delete
                </button>
            </div>
        </Modal>
    );
}

export default DeleteUserModal;
