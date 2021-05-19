import React, { useState } from "react";

import Expenses from "./components/Expenses/Expenses";
import NewExpense from "./components/NewExpense/NewExpense";
import "./App.css";

const initial_expenseItemData = [
  {
    id: 1,
    date: new Date(2021, 5, 1),
    title: "Car Insurance",
    amount: 100,
  },
  {
    id: 2,
    date: new Date(2021, 10, 2),
    title: "Bike Insurance",
    amount: 200,
  },
  {
    id: 3,
    date: new Date(2022, 5, 3),
    title: "Bus Insurance",
    amount: 300,
  },
  {
    id: 4,
    date: new Date(2019, 5, 4),
    title: "Lorry Insurance",
    amount: 400,
  },
];

const App = () => {
  const [expenseData, setExpenseData] = useState(initial_expenseItemData);

  const addExpenseHandler = (expenseDateFromNewExpense) => {
    setExpenseData((prevExpense) => {
      return [expenseDateFromNewExpense, ...prevExpense];
    });
  };

  return (
    <div className="App">
      <NewExpense onAddExpense={addExpenseHandler} />
      <Expenses items={expenseData} />
    </div>
  );
};

export default App;
