import { useCallback, useEffect, useState } from "react";
import { ModalT, ProductT, UserT } from "../../types";
import { useNavigate } from "react-router-dom";
import DeleteProductModal from "./DeleteProductModal";
import { deleteProduct, getProducts } from "../api";
import EditProductModal from "./EditProductModal";

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
    const [selectedProduct, setSelectedProduct] = useState<
        ProductT | undefined
    >();
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
        selectedProduct &&
            deleteProduct(selectedProduct.id)
                .then(({ data }) => {
                    setModalToOpen(null);
                    setProducts(data.products);
                })
                .catch((error) => {
                    console.log(error);
                });
    }, [selectedProduct, setModalToOpen, setProducts]);

    const handleClick = useCallback(
        (product: ProductT, modal: ModalT) => {
            setSelectedProduct(product);
            setModalToOpen(modal);
        },
        [setModalToOpen]
    );

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
                                            <button
                                                onClick={() =>
                                                    handleClick(
                                                        product,
                                                        "EditProduct"
                                                    )
                                                }
                                                className="button mt-2 is-small is-rounded is-light is-link"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleClick(
                                                        product,
                                                        "DeleteProduct"
                                                    )
                                                }
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
            {selectedProduct && (
                <EditProductModal
                    setModalToOpen={setModalToOpen}
                    modalToOpen={modalToOpen}
                    product={selectedProduct}
                    setProducts={setProducts}
                />
            )}
            <DeleteProductModal
                setModalToOpen={setModalToOpen}
                modalToOpen={modalToOpen}
                handleProductDelete={handleProductDelete}
            />
        </>
    );
}

export default Products;
