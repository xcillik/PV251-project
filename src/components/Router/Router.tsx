import { BrowserRouter, Route, Routes } from "react-router-dom";
import Index from "../../pages/Index/Index";
import NotFound from "../../pages/NotFound/NotFound";
import LayoutInjector from "../layout/LayoutInjector/LayoutInjector";

export default function Router() {
    return (
        <LayoutInjector>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </BrowserRouter>
        </LayoutInjector>
    );
}
