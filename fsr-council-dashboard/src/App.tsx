import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { Budget } from "./pages/Budget";
import { Meetings } from "./pages/Meetings";
import { NoticeDetail, Notices } from "./pages/Notices";
import { Overview } from "./pages/Overview";
import { Suggestions } from "./pages/Suggestions";
import { StoreProvider } from "./store";

export default function App() {
  return (
    <StoreProvider>
      <HashRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Overview />} />
            <Route path="/notices" element={<Notices />} />
            <Route path="/notices/:id" element={<NoticeDetail />} />
            <Route path="/suggestions" element={<Suggestions />} />
            <Route path="/budget" element={<Budget />} />
            <Route path="/meetings" element={<Meetings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </HashRouter>
    </StoreProvider>
  );
}
