import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom"

export default function NotFound() {
    return (
        <div>
            <Link to="/" className="text-decoration-none">
                <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
                Back to Home
            </Link>
            <div className="text-center">
                <h2 className="mt-3 mb-0">404</h2>
                <small>Page not Found.</small>
            </div>
            <p className="mt-4">
                The page you are looking for might have been removed, had its name changed or is temporarily unavailable.
            </p>
        </div>
    );
}
