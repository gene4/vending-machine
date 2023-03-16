import React from "react";

interface Props {
    children: React.ReactNode;
    isOpen: boolean;
    close: () => void;
}

function Modal({ children, isOpen, close }: Props) {
    return (
        <div className={`modal ${isOpen && "is-active"}`}>
            <div onClick={close} className="modal-background" />

            <div className="modal-content box">{children}</div>
        </div>
    );
}

export default Modal;
