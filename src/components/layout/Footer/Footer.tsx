import { Container } from "react-bootstrap";

export default function Footer() {
    const year = import.meta.env.VITE_FOOTER_YEAR.replace(
        new RegExp("%YEAR%", "g"),
        new Date().getFullYear().toString()
    );

    return (
        <Container>
            <footer>
                <hr />
                <p className="text-center">Project for PV251 | Made by {import.meta.env.VITE_AUTHOR} (<a href={`mailto:${import.meta.env.VITE_CONTACT_MAIL}`}>{import.meta.env.VITE_CONTACT_MAIL}</a>) | {year}</p>
            </footer>
        </Container>
    );
}
