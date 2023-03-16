import { ModalT } from "../../types";
import Modal from "./Modal";

interface Props {
    modalToOpen: ModalT;
    setModalToOpen: (modalToOpen: ModalT) => void;
    handleProductDelete: () => void;
}

function DeleteProductModal({
    modalToOpen,
    setModalToOpen,
    handleProductDelete,
}: Props) {
    return (
        <Modal
            isOpen={modalToOpen === "DeleteProduct"}
            close={() => setModalToOpen(null)}
        >
            <h1 className="subtitle">
                Are you absolutely sure you want to delete this product?!
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
                    onClick={handleProductDelete}
                    className="button is-primary mt-3  ml-5"
                    type="submit"
                >
                    Delete
                </button>
            </div>
        </Modal>
    );
}

export default DeleteProductModal;
