import React, { useState } from "react";
import axios from "../api";
import { useNavigate } from "react-router-dom";
import { Container, Form, Button } from "react-bootstrap";

function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("/auth/login", { email, password });
      localStorage.setItem("token", data.token);
      navigate("/chat");
    } catch (err) {
      alert("Invalid credentials");
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Form onSubmit={handleSubmit} className="w-50">
        <h2 className="text-center">Login</h2>
        <Form.Group>
          <Form.Label>Email</Form.Label>
          <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </Form.Group>
        <Form.Group>
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </Form.Group>
        <Button type="submit" className="w-100 mt-3">Login</Button>
      </Form>
    </Container>
  );
}

export default Auth;
