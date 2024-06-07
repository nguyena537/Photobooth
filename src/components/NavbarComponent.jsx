import React, {useState, useEffect} from 'react'
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';
import Navbar from 'react-bootstrap/Navbar';
import Modal from 'react-bootstrap/Modal';

export default function NavbarComponent({ currentPage }) {
    const [showLogout, setShowLogout] = useState(false);

    function handleLogout() {
        setShowLogout(false);
        sessionStorage.clear();
        window.location.href = "/";
    }

    useEffect(() => {
      const now = new Date();
      if (sessionStorage.getItem('token') == null) {
        window.location.href = "/";
        return;
      } else if (now.getTime() > parseInt(sessionStorage.getItem('expiry_date'))) {
        sessionStorage.clear();
        window.location.href = "/";
        return;
      }
    }, []);

    return (
        <>
        <Navbar expand="lg" className="bg-body-tertiary">
        <Container>
            <Navbar.Brand href="/profile">Photobooth</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
                <Nav.Link href="/profile" style={{ fontWeight: currentPage == "profile" && "bold" }}>Your Profile</Nav.Link>
                <Nav.Link href="/posts" style={{ fontWeight: currentPage == "posts" && "bold" }}>Posts</Nav.Link>
            </Nav>
            </Navbar.Collapse>
            <Button onClick={() => setShowLogout(true)}>Logout</Button>
        </Container>
        </Navbar>

        <Modal show={showLogout} onHide={() => setShowLogout(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Log Out</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you would like to log out?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowLogout(false)}>
            Close
          </Button>
          <Button variant="danger" onClick={handleLogout}>
            Log Out
          </Button>
        </Modal.Footer>
      </Modal>
        </>
        
        
    );
}