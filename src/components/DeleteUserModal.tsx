import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ModalT, UserT } from "../../types";
import Modal from "./Modal";

interface Props {
    modalToOpen: ModalT;
    setModalToOpen: (modalToOpen: ModalT) => void;
    userId: string;
    setUser: (user: UserT | undefined) => void;
}

function DeleteUserModal({
    modalToOpen,
    setModalToOpen,
    userId,
    setUser,
}: Props) {
    const navigate = useNavigate();

    const handleDelete = () => {
        const token = localStorage.getItem("token");
        axios
            .delete(`http://localhost:8080/api/user/${userId}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then(() => {
                setUser(undefined);
                setModalToOpen(null);
                localStorage.removeItem("token");
                localStorage.removeItem("userId");
                navigate("/");
            })
            .catch((error) => {
                console.log(error);
            });
    };

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
