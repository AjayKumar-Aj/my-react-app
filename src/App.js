import React from "react";
import Expenses from "./components/Expenses/Expenses";
import "./App.css";

const App = () => {
  const expenseItemData = [
    {
      id: 1,
      date: new Date(2021, 5, 1),
      title: "Car Insurance",
      amount: "Rs. 100",
    },
    {
      id: 2,
      date: new Date(2021, 5, 2),
      title: "Bike Insurance",
      amount: "Rs. 200",
    },
    {
      id: 3,
      date: new Date(2021, 5, 3),
      title: "Bus Insurance",
      amount: "Rs. 300",
    },
  ];
  return (
    <div className="App">
      <Expenses items={expenseItemData}/> 
    </div>
  );
};

export default App;
