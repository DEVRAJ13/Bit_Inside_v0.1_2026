import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Tabs from "./Tabs";
import { AuthLayout, ForgotPassword, Login, Register } from "./Auth";
import { AuthProvider } from "./auth/AuthContext";
import { GuestRoute, ProtectedRoute } from "./auth/guards";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Guest-only: logged-in users are redirected to "/" */}
          <Route element={<GuestRoute />}>
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
            </Route>
          </Route>

          {/* Protected: logged-out users are redirected to "/login" */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Tabs />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
