import React, { useState, useEffect } from "react";
import "./App.css";
import ExpenseList from "./components/ExpenseList";
import ExpenseForm from "./components/ExpenseForm";
import Alert from "./components/Alert";

const { v4: uuid } = require("uuid");

// const initialExpenses = [
//   { id: uuid(), charge: "rent", amount: 1600 },
//   { id: uuid(), charge: "gym", amount: 60 },
//   { id: uuid(), charge: "car payment", amount: 600 },
// ];
const initialExpenses = localStorage.getItem("expenses")
  ? JSON.parse(localStorage.getItem("expenses"))
  : [];

function App() {
  // ********* state values ************
  // ********* all expenses, add expense ************
  const [expenses, setExpenses] = useState(initialExpenses);
  // single expense
  const [charge, setCharge] = useState("");
  // single amount
  const [amount, setAmount] = useState("");
  // alert
  const [alert, setAlert] = useState({ show: false });
  //edit
  const [edit, setEdit] = useState(false);
  // edit item
  const [id, setId] = useState(0);
  // ********* useEffect ************
  useEffect(() => {
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }, [expenses]);

  // ********* functionality ************
  const handleCharge = (e) => {
    setCharge(e.target.value);
  };
  const handleAmount = (e) => {
    setAmount(e.target.value);
  };
  //handle alert
  const handleAlert = ({ type, text }) => {
    setAlert({ show: true, type, text });
    setTimeout(() => {
      setAlert({ showAlert: false });
    }, 3000);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (charge !== "" && amount > 0) {
      if (edit) {
        let tempExpense = expenses.map((item) => {
          return item.id === id ? { ...item, charge, amount } : item;
        });
        setExpenses(tempExpense);
        setEdit(false);
        handleAlert({
          type: "success",
          text: `Item Edited`,
        });
      } else {
        const singleExpense = { id: uuid(), charge, amount };
        setExpenses([...expenses, singleExpense]);
      }
      handleAlert({ type: "success", text: "item added" });
      setCharge("");
      setAmount("");
    } else {
      handleAlert({
        type: "danger",
        text: `Charge cannot be empty value, and the amount of the value has to be bigger than zero.`,
      });
    }
  };
  // clear all items
  const clearItems = () => {
    console.log("Cleared all items");
    setExpenses([]);
    handleAlert({ type: "danger", text: "All items deleted" });
  };
  //handle Delete
  const handleDelete = (id) => {
    let tempExpenses = expenses.filter((item) => item.id !== id);
    setExpenses([...tempExpenses]);
    // console.log(expenses);
    // setExpenses([...expenses].filter((id) => expenses.id !== id));
    handleAlert({ type: "danger", text: "Item Deleted" });
  };
  //handle edit
  const handleEdit = (id) => {
    let expense = expenses.find((item) => item.id === id);
    let { charge, amount } = expense;
    setCharge(charge);
    setAmount(amount);
    setEdit(true);
    setId(id);
  };

  return (
    <React.Fragment>
      {alert.show && <Alert type={alert.type} text={alert.text} />}
      <h1>Budget Calculator</h1>
      <main className="App">
        <ExpenseForm
          charge={charge}
          amount={amount}
          handleAmount={handleAmount}
          handleCharge={handleCharge}
          handleSubmit={handleSubmit}
          edit={edit}
        />
        <ExpenseList
          expenses={expenses}
          clearItems={clearItems}
          handleDelete={handleDelete}
          handleEdit={handleEdit}
        />
      </main>
      <h1>
        total spending:{" "}
        <span className="total">
          $
          {expenses.reduce((acc, cur) => {
            return acc + parseInt(cur.amount);
          }, 0)}
        </span>
      </h1>
    </React.Fragment>
  );
}

export default App;
