import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { Container } from "react-bootstrap";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NavigationBar from "../components/Navbar";
import { GoogleOAuthProvider } from "@react-oauth/google";

export const Route = createRootRoute({
  component: () => (
    <>
      <GoogleOAuthProvider 
        clientId={import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID}
      >
        {/* Navbar*/}
        <NavigationBar />

        <Container>
          <Outlet />
        </Container>
        <TanStackRouterDevtools />

        <ToastContainer theme="colored" />
      </GoogleOAuthProvider>
    </>
  ),
});
