import { Container } from "react-bootstrap";
import "./header.css";

export default function Header() {
    return (
        <Container>
            <header className="main">
                <h1 className="mt-4">{import.meta.env.VITE_TITLE}</h1>
                <h3 className="mt-3">{import.meta.env.VITE_SUBTITLE}</h3>
                <hr />
            </header>
        </Container>
    );
}
