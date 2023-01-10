import { useState } from 'react';
import { Container, Nav, Navbar } from 'react-bootstrap';
import { BrowserRouter } from 'react-router-dom';
import './App.css';
import Shoping from './component/Shoping';

function App() { 

  return (
      <div>
        <BrowserRouter>
          <Navbar bg="dark" variant="dark">
            <Container>
              <Navbar.Brand href="#home">Shoping_Cart</Navbar.Brand>
              <Nav.Link id='totalNav' className='text-white'>0.00</Nav.Link>
            </Container>
          </Navbar>
          <Shoping />
        </BrowserRouter>
      </div>
  );
}

export default App;
