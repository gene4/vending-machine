import { useState } from "react";
import axios from "axios";
import { UserT } from "../../types";
import { useNavigate } from "react-router-dom";

interface Props {
    setUser: (user: UserT) => void;
}

function Signup({ setUser }: Props) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("seller");

    const navigate = useNavigate();

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const newUser = { username, password, role, deposit: 0 };

        axios
            .post("http://localhost:8080/api/register", {
                newUser,
            })
            .then(function (response) {
                setUser(response.data.user);
                localStorage.setItem("token", response.data.token);
                navigate("/products");
            })
            .catch(function (error) {
                console.log(error);
            });
    };

    return (
        <form className="box" onSubmit={handleSubmit}>
            <label className="label is-flex pr-2" htmlFor="username">
                Username
                <input
                    type="text"
                    name="username"
                    required
                    onChange={(event) => setUsername(event.target.value)}
                    className="input ml-5"
                />
            </label>

            <label className="label is-flex pr-2 my-4" htmlFor="password">
                Password
                <input
                    type="password"
                    name="password"
                    required
                    onChange={(event) => setPassword(event.target.value)}
                    className="input ml-5"
                />
            </label>
            <span className="is-flex mt-5">
                <label htmlFor="role">
                    Seller
                    <input
                        type="radio"
                        name="role"
                        value={"seller"}
                        checked={role === "seller"}
                        required
                        onChange={(event) => setRole(event.target.value)}
                        className="radio mx-1"
                    />
                </label>
                <label className="ml-5" htmlFor="role">
                    Buyer
                    <input
                        type="radio"
                        name="role"
                        value={"buyer"}
                        checked={role === "buyer"}
                        required
                        onChange={(event) => setRole(event.target.value)}
                        className="radio mx-1"
                    />
                </label>
            </span>
            <button className="button is-primary mt-5" type="submit">
                Sign up
            </button>
        </form>
    );
}

export default Signup;
