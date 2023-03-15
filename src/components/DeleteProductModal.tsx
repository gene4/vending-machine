import { ModalT } from "../../types";

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
        <div
            className={`modal ${
                modalToOpen === "DeleteProduct" && "is-active"
            }`}
        >
            <div
                onClick={() => setModalToOpen(null)}
                className="modal-background"
            />

            <div className="modal-content box">
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
            </div>
        </div>
    );
}

export default DeleteProductModal;
