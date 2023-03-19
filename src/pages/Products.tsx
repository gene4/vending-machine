import { useCallback, useEffect, useState } from "react";
import { ModalT, ProductT, UserT } from "../../types";
import { useNavigate } from "react-router-dom";
import DeleteProductModal from "../components/DeleteProductModal";
import { deleteProduct, getProducts } from "../api";
import EditProductModal from "../components/EditProductModal";
import BuyProductModal from "../components/BuyProductModal";

interface Props {
    products: ProductT[] | undefined;
    setProducts: (products: ProductT[]) => void;
    setModalToOpen: (modal: ModalT) => void;
    setUser: (user: UserT) => void;
    modalToOpen: ModalT;
    user: UserT | undefined;
}

function Products({
    products,
    setProducts,
    user,
    setUser,
    setModalToOpen,
    modalToOpen,
}: Props) {
    const [selectedProduct, setSelectedProduct] = useState<
        ProductT | undefined
    >();
    const [selectedAmount, setSelectedAmount] = useState(1);
    const navigate = useNavigate();

    useEffect(() => {
        getProducts()
            .then(({ data }) => {
                setProducts(data);
            })
            .catch((error) => {
                // console.log(error);
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
                            <p className="product-emoji">
                                {product.productName}
                            </p>

                            {user.role === "seller" ? (
                                <p>{product.amountAvailable} left</p>
                            ) : (
                                <div className="is-flex is-justify-content-space-evenly is-align-items-center">
                                    <p>Amount</p>
                                    <div className="select is-small is-link is-rounded my-3">
                                        <select
                                            onChange={(event) =>
                                                setSelectedAmount(
                                                    parseInt(event.target.value)
                                                )
                                            }
                                        >
                                            {Array(product.amountAvailable)
                                                .fill(0)
                                                .map((_, index) => (
                                                    <option
                                                        value={index + 1}
                                                        key={index + 1}
                                                    >
                                                        {index + 1}
                                                    </option>
                                                ))}
                                        </select>
                                    </div>
                                </div>
                            )}

                            {user.role === "buyer" ? (
                                <button
                                    onClick={() =>
                                        handleClick(product, "BuyProduct")
                                    }
                                    className="button mt-2 is-rounded is-small is-light is-link is-fullwidth"
                                >
                                    Buy
                                </button>
                            ) : (
                                <>
                                    <p className="my-1"> {product.cost}$</p>
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
                <>
                    <EditProductModal
                        setModalToOpen={setModalToOpen}
                        modalToOpen={modalToOpen}
                        product={selectedProduct}
                        setProducts={setProducts}
                    />
                    {products && (
                        <BuyProductModal
                            setModalToOpen={setModalToOpen}
                            modalToOpen={modalToOpen}
                            product={selectedProduct}
                            setProducts={setProducts}
                            amount={selectedAmount}
                            setUser={setUser}
                        />
                    )}
                </>
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
