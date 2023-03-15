import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ModalT, UserT } from "../../types";

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
        axios
            .delete(`http://localhost:8080/api/user/${userId}`)
            .then(function () {
                setUser(undefined);
                setModalToOpen(null);
                navigate("/");
            })
            .catch(function (error) {
                console.log(error);
            });
    };

    return (
        <div className={`modal ${modalToOpen === "DeleteUser" && "is-active"}`}>
            <div
                onClick={() => setModalToOpen(null)}
                className="modal-background"
            />

            <div className="modal-content box">
                <h1 className="subtitle">
                    Are you absolutely sure you want to delete this user?!
                </h1>
                <div className="is-flex is-justify-content-center">
                    <button
                        onClick={() => setModalToOpen(null)}
                        className="button is-danger mt-3"
                        type="button"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleDelete}
                        className="button is-primary mt-3  ml-5"
                        type="submit"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}

export default DeleteUserModal;
