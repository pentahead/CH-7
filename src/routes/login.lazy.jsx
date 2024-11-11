import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { useDispatch, useSelector } from "react-redux";
import { setToken } from "../redux/slices/auth";
import { login } from "../service/auth";

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
      // redirect to dashboard
      navigate({ to: "/" });
    }
  }, [navigate]);
  const onSubmit = async (e) => {
    e.preventDefault();
    // hit the login API
    // define req body
    const body = {
      email,
      password,
    };
    const result = await login(body);
    if (result.success) {
      dispatch(setToken(result.data.data.token));
      // localStorage.setItem("token", result.data.data.token);
      console.log(result);
      alert(result.data.message);

      //redirect to home
      navigate({ to: "/" });
      return;
    }

    alert(result.errors);
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 ">
      <div style={{ maxWidth: "650px", width: "100%" }}>
        {/* <h1>{password}</h1> */}
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
            </Form>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}
