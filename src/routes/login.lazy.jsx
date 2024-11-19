import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { useDispatch, useSelector } from "react-redux";
import { setToken } from "../redux/slices/auth";
import { login, googleLoginApi } from "../service/auth";
import { useGoogleLogin } from "@react-oauth/google";
import { toast } from "react-toastify";

export const Route = createLazyFileRoute("/login")({
  component: Login,
});

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (token) {
      // Redirect ke dashboard jika token ada
      navigate({ to: "/" });
    }
  }, [token, navigate]);

  const onSubmit = async (e) => {
    e.preventDefault();
    const body = {
      email,
      password,
    };
    const result = await login(body);
    if (result.success) {
      dispatch(setToken(result.data.data.token));
      toast.success("Login successful!");
      navigate({ to: "/" });
      return;
    }
    toast.error("Login failed");
  };

  const googlelogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      console.log("Google", tokenResponse);
      const result = await googleLoginApi(tokenResponse);
      if (result.data.token) {
        dispatch(setToken(result.data.token));
        toast.success("Login successful!");
        navigate({ to: "/" });
      } else {
        toast.error(result.message || "Login failed");
      }
    },
  });

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div style={{ maxWidth: "650px", width: "100%" }}>
        <Card className="shadow-lg">
          <Card.Header className="text-center bg-primary text-white fs-4 fw-bold">
            Welcome Back!
          </Card.Header>
          <Card.Body className="p-4">
            <Card.Title className="text-center fs-5 mb-4">
              Login to Your Account
            </Card.Title>
            <Form onSubmit={onSubmit}>
              <Form.Group as={Row} className="mb-3" controlId="email">
                <Form.Label column sm="3" className="fw-semibold">
                  Email
                </Form.Label>
                <Col sm="9">
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                  />
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="mb-4" controlId="password">
                <Form.Label column sm="3" className="fw-semibold">
                  Password
                </Form.Label>
                <Col sm="9">
                  <Form.Control
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                    }}
                  />
                </Col>
              </Form.Group>
              <Button variant="primary" type="submit" className="w-100 fw-bold">
                Login
              </Button>
              <Button
                onClick={() => googlelogin()}
                variant="primary"
                className="w-100 fw-bold mt-4"
              >
                Login with Google
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}
