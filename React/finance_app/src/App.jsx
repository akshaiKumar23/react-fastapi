import { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import api from './api';

function App() {
  const [transactions, setTransactions] = useState([]);
  const [formData, setFormData] = useState({
    amount: "",
    category: "",
    description: "",
    is_income: false,
    date: ""
  });

  const fetchTransactions = async () => {
    const response = await api.get('/transactions');
    setTransactions(response.data);
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    await api.post('/transactions', formData);
    fetchTransactions();
    setFormData({
      amount: "",
      category: "",
      description: "",
      is_income: false,
      date: ""
    });
  };


  const handleDeleteTransaction = async (id) => {
    await api.delete(`/transactions/${id}`);
    fetchTransactions();
  };
  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand href="#home">Transaction Tracker</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
        </Container>
      </Navbar>

      <Container className="my-5">
        <Form onSubmit={handleFormSubmit}>
          <Form.Group className="mb-3" controlId="formAmount">
            <Form.Label>Amount</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter the amount"
              name="amount"
              value={formData.amount}
              onChange={handleInputChange}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formCategory">
            <Form.Label>Category</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter the category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formDescription">
            <Form.Label>Description</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter the description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formIncome">
            <Form.Check
              type="checkbox"
              label="Income?"
              name="is_income"
              checked={formData.is_income}
              onChange={handleInputChange}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formDate">
            <Form.Label>Date</Form.Label>
            <Form.Control
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
            />
          </Form.Group>

          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>

        <div className="mt-5">
          <h3>Transaction History</h3>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Amount</th>
                <th>Category</th>
                <th>Description</th>
                <th>Income</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td>{transaction.amount}</td>
                  <td>{transaction.category}</td>
                  <td>{transaction.description}</td>
                  <td>{transaction.is_income ? 'Yes' : 'No'}</td>
                  <td>{transaction.date}</td>
                  <td>
                    <Button
                      onClick={() => handleDeleteTransaction(transaction.id)}
                      variant="danger" size="sm">Delete</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </Container>
    </>
  );
}

export default App;
