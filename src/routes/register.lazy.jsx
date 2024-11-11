import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { useState, useEffect } from "react";
import { register } from "../service/auth";

export const Route = createLazyFileRoute("/register")({
  component: Register,
});

function Register() {
  const navigate = useNavigate();

  const { token } = useSelector((state) => state.auth);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profilePicture, setProfilePicture] = useState(undefined);
  useEffect(() => {
    if (token) {
      // redirect to home
      navigate({ to: "/" });
    }
  }, [token, navigate]);
  const onSubmit = async (e) => {
    e.preventDefault();
    if (password != confirmPassword) {
      alert("Passwords do not match");
    }
    // hit API here
    const request = {
      name,
      email,
      password,
      profilePicture,
    };
    const result = await register(request);
    if (result.success) {
      // localStorage.setItem("token", result.data.data.token);
      console.log(result);
      alert(result.data.message);
      navigate({ to: "/login" });
      return;
    }

    alert(result.errors);
  };
  return (
    <div className="d-flex justify-content-center align-items-center vh-100 ">
      <div style={{ maxWidth: "650px", width: "100%" }}>
        <Card className="shadow-lg">
          <Card.Header className="text-center bg-success text-white fs-4 fw-bold">
            Register
          </Card.Header>
          <Card.Body className="p-4">
            <Card.Title className="text-center fs-5 mb-4">
              Create Your Account
            </Card.Title>
            <Form onSubmit={onSubmit}>
              {/* Name */}
              <Form.Group as={Row} className="mb-3" controlId="formName">
                <Form.Label column sm="4" className="fw-semibold">
                  Name
                </Form.Label>
                <Col sm="8">
                  <Form.Control
                    type="text"
                    placeholder="Enter name"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                    }}
                  />
                </Col>
              </Form.Group>

              {/* Email */}
              <Form.Group as={Row} className="mb-3" controlId="formEmail">
                <Form.Label column sm="4" className="fw-semibold">
                  Email
                </Form.Label>
                <Col sm="8">
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

              {/* Password */}
              <Form.Group as={Row} className="mb-3" controlId="formPassword">
                <Form.Label column sm="4" className="fw-semibold">
                  Password
                </Form.Label>
                <Col sm="8">
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

              {/* Confirm Password */}
              <Form.Group
                as={Row}
                className="mb-4"
                controlId="formConfirmPassword"
              >
                <Form.Label column sm="4" className="fw-semibold">
                  Confirm Password
                </Form.Label>
                <Col sm="8">
                  <Form.Control
                    type="password"
                    placeholder="Confirm password"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                    }}
                  />
                </Col>
              </Form.Group>

              {/* Profile Picture */}
              <Form.Group
                as={Row}
                className="mb-4"
                controlId="formProfilePicture"
              >
                <Form.Label column sm="4" className="fw-semibold">
                  Profile Picture
                </Form.Label>
                <Col sm="8">
                  <Form.Control
                    type="file"
                    placeholder="Choose File"
                    required
                    onChange={(e) => {
                      setProfilePicture(e.target.files[0]);
                    }}
                    accept=".jpg , .png"
                  />
                </Col>
              </Form.Group>

              {/* Register Button */}
              <Button variant="success" type="submit" className="w-100 fw-bold">
                Register
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}
