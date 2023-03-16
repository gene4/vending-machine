import { useCallback, useEffect, useState } from "react";
import { ModalT, ProductT, UserT } from "../../types";
import { useNavigate } from "react-router-dom";
import DeleteProductModal from "./DeleteProductModal";
import { deleteProduct, getProducts } from "../api";

interface Props {
    products: ProductT[] | undefined;
    setProducts: (products: ProductT[]) => void;
    setModalToOpen: (modal: ModalT) => void;
    modalToOpen: ModalT;
    user: UserT | undefined;
}

function Products({
    products,
    setProducts,
    user,
    setModalToOpen,
    modalToOpen,
}: Props) {
    const [productId, setProductId] = useState<string>("");
    const navigate = useNavigate();

    useEffect(() => {
        getProducts()
            .then(({ data }) => {
                setProducts(data);
            })
            .catch((error) => {
                console.log(error);
                navigate("/");
            });
    }, [navigate, setProducts]);

    const handleProductDelete = useCallback(() => {
        deleteProduct(productId)
            .then(({ data }) => {
                setModalToOpen(null);
                setProducts(data.products);
            })
            .catch((error) => {
                console.log(error);
            });
    }, [productId, setModalToOpen, setProducts]);

    if (!user) {
        navigate("/");
        return null;
    }

    return (
        <>
            <div className="products-grid">
                {products &&
                    products.map((product) => (
                        <div key={product.id} className="product-container">
                            <div className="product-emoji">
                                {product.productName}
                            </div>
                            <p>{product.amountAvailable} left</p>
                            {user.role === "buyer" ? (
                                <button className="button mt-2 is-rounded is-small is-light is-link is-fullwidth">
                                    Buy {product.cost}$
                                </button>
                            ) : (
                                <>
                                    <p> {product.cost}$</p>
                                    {user.id === product.sellerId && (
                                        <span className="is-flex is-justify-content-space-around">
                                            <button className="button mt-2 is-small is-rounded is-light is-link">
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setProductId(product.id);
                                                    setModalToOpen(
                                                        "DeleteProduct"
                                                    );
                                                }}
                                                className="button mt-2 is-small is-light is-rounded  is-link"
                                            >
                                                Delete
                                            </button>
                                        </span>
                                    )}
                                </>
                            )}
                        </div>
                    ))}
            </div>
            <DeleteProductModal
                setModalToOpen={setModalToOpen}
                modalToOpen={modalToOpen}
                handleProductDelete={handleProductDelete}
            />
        </>
    );
}

export default Products;
