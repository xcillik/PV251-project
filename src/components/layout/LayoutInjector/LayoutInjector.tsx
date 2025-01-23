import { Container } from "react-bootstrap";
import Footer from "../Footer/Footer";
import Header from "../Header/Header";

type Props = {
    children: React.ReactNode;
};

export default function LayoutInjector({ children }: Props) {
    return (
        <main>
            <Header />
            <Container className="pb-5">
                {children}
            </Container>
            <Footer />
        </main>
    );
}
