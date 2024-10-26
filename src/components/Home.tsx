import React from "react";
import { Link } from "react-router-dom";

function Home() {
    return (
        <div>
            <h2>ホームページ</h2>
            <nav>
                <ul>
                    <li>
                        <Link to="/studio">Studio</Link>
                    </li>
                    <li>
                        <Link to="/warehouse">Warehouse</Link>
                    </li>
                </ul>
            </nav>
        </div>
    );
}

export default Home;
