import React, { useEffect, useState } from "react";
import { useIndexedDB } from "react-indexed-db-hook";
import extractErrorMessage from "../lib/utils/extractErrorMessage";
import { Alert, Button, Col, Container, Form, Row } from "react-bootstrap";

const Root = () => {
  const { add, getByIndex } = useIndexedDB("registrations");
  const [error, setError] = useState<string | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(true);
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    if (status) {
      const timerFunc = setTimeout(() => {
        setStatus(null);
      }, 5000);

      return () => clearTimeout(timerFunc);
    }
  }, [status]);

  const handleEnter = (event: any) => {
    if (event.keyCode === 13) {
      const form = event.target.form;
      const index = Array.prototype.indexOf.call(form, event.target);
      form.elements[index + 1].focus();
      event.preventDefault();
    }
  };

  const handleFirstNameChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFirstName(event.target.value);
  };

  const handleLastNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLastName(event.target.value);
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handlePhoneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(event.target.value);
  };

  const handleReset = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setPhone("");
    setSubscribed(true);
    setError(null);
    setStatus(null);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!firstName || !lastName || !email || !phone) {
      setError("All fields are required");
      return;
    }

    if (phone.replace(/[^0-9a-z]/gi, "").length < 10) {
      setError("Phone number must be at least 10 digits");
      return;
    }

    const phoneFound = await getByIndex("phone", phone);
    if (phoneFound) {
      setError("Phone already registered");
      return;
    }

    const emailFound = await getByIndex("email", email);
    if (emailFound) {
      setError("Email already registered");
      return;
    }

    setError(null);
    try {
      const record = {
        date: new Date().toISOString(),
        firstName,
        lastName,
        email,
        phone,
        subscribed: subscribed ? "YES" : "NO",
      };
      await add(record);
      setFirstName("");
      setLastName("");
      setEmail("");
      setPhone("");
      setSubscribed(true);
      setStatus("Registration successful. Thank you!");
    } catch (err) {
      console.error(err);
      setError(extractErrorMessage(err));
    }
  };

  const disabled = !firstName || !lastName || !email || !phone;

  return (
    <Container fluid style={{ height: "100%" }}>
      <Row style={{ height: "100%" }}>
        <Col sm="4" style={{ backgroundColor: "#F6F6F6", height: "100%" }}>
          <div
            style={{
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img src="/logo.jpeg" style={{ width: 350 }}></img>
          </div>
        </Col>
        <Col sm="8" style={{ padding: "20px 40px" }}>
          <div
            style={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <h2>Register to win a Hand-Made Charcuterie board</h2>
            <div>
              Please enter your name, email and phone number to register.
            </div>
            <div style={{ height: 50 }}></div>
            <div>
              {error && <Alert variant={"warning"}>{error}</Alert>}
              <form onSubmit={handleSubmit}>
                {!status && (
                  <>
                    <Form.Group as={Row} className="mb-3">
                      <Form.Label
                        column
                        sm="2"
                        style={{ whiteSpace: "nowrap" }}
                      >
                        First Name
                      </Form.Label>
                      <Col sm="10">
                        <Form.Control
                          type="text"
                          id="firstName"
                          name="firstName"
                          value={firstName}
                          onChange={handleFirstNameChange}
                          style={{ width: 300 }}
                          autoCapitalize="words"
                          onKeyDown={handleEnter}
                        />
                      </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3">
                      <Form.Label
                        column
                        sm="2"
                        style={{ whiteSpace: "nowrap" }}
                      >
                        Last Name
                      </Form.Label>
                      <Col sm="10">
                        <Form.Control
                          type="text"
                          id="lastName"
                          name="lastName"
                          value={lastName}
                          onChange={handleLastNameChange}
                          style={{ width: 300 }}
                          autoCapitalize="words"
                          onKeyDown={handleEnter}
                        />
                      </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3">
                      <Form.Label column sm="2">
                        Email
                      </Form.Label>
                      <Col sm="10">
                        <Form.Control
                          type="email"
                          id="email"
                          name="email"
                          value={email}
                          onChange={handleEmailChange}
                          style={{ width: 400 }}
                          onKeyDown={handleEnter}
                        />
                      </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3">
                      <Form.Label column sm="2">
                        Phone
                      </Form.Label>
                      <Col sm="10">
                        <Form.Control
                          type="phone"
                          id="phone"
                          name="phone"
                          value={phone}
                          onChange={handlePhoneChange}
                          style={{ width: 300 }}
                          onKeyDown={handleEnter}
                        />
                      </Col>
                    </Form.Group>
                    <div
                      style={{
                        display: "flex",
                        alignContent: "center",
                        paddingLeft: 120,
                      }}
                    >
                      <Form.Check
                        defaultChecked={subscribed}
                        onClick={() => setSubscribed(!subscribed)}
                        type="checkbox"
                        id="subscribe"
                      />
                      <span style={{ padding: "6px 14px" }}>
                        Keep me updated on availability of Sausages and Salamis
                      </span>
                    </div>
                  </>
                )}
                <div style={{ height: 40 }}></div>
                {status && <Alert variant={"success"}>{status}</Alert>}
                {!status && (
                  <>
                    <Button type="submit" variant="primary" disabled={disabled}>
                      Register
                    </Button>
                    <Button type="reset" variant="Light" onClick={handleReset}>
                      Reset
                    </Button>
                  </>
                )}
              </form>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Root;
