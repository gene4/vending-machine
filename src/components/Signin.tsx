import { useState } from "react";
import axios from "axios";
import { UserT } from "../../types";
import { Link, useNavigate } from "react-router-dom";

interface Props {
    setUser: (user: UserT) => void;
}

function Signin({ setUser }: Props) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        axios
            .post("http://localhost:8080/api/signin", {
                username,
                password,
            })
            .then(function ({ data }) {
                setUser(data.user);
                localStorage.setItem("token", data.token);
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
                    className="input ml-3"
                />
            </label>

            <label className="label is-flex pr-2 my-4" htmlFor="password">
                Password
                <input
                    type="password"
                    name="password"
                    required
                    onChange={(event) => setPassword(event.target.value)}
                    className="input ml-3"
                />
            </label>
            <p>
                Dont have an account? <Link to={"/signup"}>signup here!</Link>
            </p>
            <button className="button is-primary mt-5" type="submit">
                Sign in
            </button>
        </form>
    );
}

export default Signin;
