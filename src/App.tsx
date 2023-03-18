import { useCallback, useEffect, useState } from "react";
import { ModalT, ProductT, UserT } from "../types";
import "./App.css";
import Signin from "./components/Signin";
import Signup from "./components/Signup";
import { Route, Routes, useNavigate } from "react-router-dom";
import Products from "./components/Products";
import EditUserModal from "./components/EditUserModal";
import DeleteUserModal from "./components/DeleteUserModal";
import AddProductModal from "./components/AddProductModal";
import DepositModal from "./components/DepositModal";
import { getUser } from "./api";

function App() {
    const [ready, setReady] = useState(() => !localStorage.getItem("token"));
    const [user, setUser] = useState<UserT | undefined>();
    const [products, setProducts] = useState<ProductT[] | undefined>();
    const [modalToOpen, setModalToOpen] = useState<ModalT>(null);

    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (token) {
            getUser()
                .then(({ data }) => {
                    setUser(data.user);
                    navigate("/products");
                })
                .catch((error) => {
                    // console.log(error);
                })
                .finally(() => {
                    setReady(true);
                });
        }
    }, [navigate]);

    const handleSignOut = useCallback(() => {
        localStorage.removeItem("token");
        setUser(undefined);
        navigate("/");
    }, [navigate]);

    if (!ready) {
        return <h1>Loading...</h1>;
    }
    return (
        <div className="App">
            {user && (
                <header className="is-flex py-3 px-4 is-justify-content-space-between is-align-items-center box">
                    <div className="is-flex media">
                        <b>{user.username}</b>
                        <p className="mx-1">({user.role})</p>
                        {user.role === "buyer" && (
                            <p>
                                <b className="ml-2">Deposit:</b> {user.deposit}¢
                            </p>
                        )}
                    </div>
                    <div>
                        {user.role === "seller" && (
                            <button
                                onClick={() => setModalToOpen("AddProduct")}
                                className="button is-warning"
                            >
                                Add product
                            </button>
                        )}
                        {user.role === "buyer" && (
                            <button
                                onClick={() => setModalToOpen("Deposit")}
                                className="button is-warning"
                            >
                                Deposit
                            </button>
                        )}
                        <button
                            onClick={() => setModalToOpen("EditUser")}
                            className="button is-link mx-3"
                        >
                            Edit profile
                        </button>
                        <button
                            onClick={() => setModalToOpen("DeleteUser")}
                            className="button is-danger"
                        >
                            Delete profile
                        </button>
                        <button
                            onClick={handleSignOut}
                            className="button is-info ml-3"
                        >
                            Sign out
                        </button>
                    </div>
                </header>
            )}
            <Routes>
                <Route
                    path="/"
                    element={user ? null : <Signin setUser={setUser} />}
                />
                <Route path="/signup" element={<Signup setUser={setUser} />} />
                <Route
                    path="/products"
                    element={
                        <Products
                            products={products}
                            setProducts={setProducts}
                            setUser={setUser}
                            user={user}
                            modalToOpen={modalToOpen}
                            setModalToOpen={setModalToOpen}
                        />
                    }
                />
            </Routes>

            {user && (
                <>
                    <EditUserModal
                        setModalToOpen={setModalToOpen}
                        modalToOpen={modalToOpen}
                        setUser={setUser}
                        user={user}
                    />
                    <DeleteUserModal
                        setModalToOpen={setModalToOpen}
                        modalToOpen={modalToOpen}
                        setUser={setUser}
                    />
                    <DepositModal
                        setModalToOpen={setModalToOpen}
                        modalToOpen={modalToOpen}
                        setUser={setUser}
                        userDepositValue={user.deposit}
                    />
                </>
            )}
            {products && (
                <AddProductModal
                    modalToOpen={modalToOpen}
                    setModalToOpen={setModalToOpen}
                    setProducts={setProducts}
                    products={products}
                />
            )}
        </div>
    );
}

export default App;
