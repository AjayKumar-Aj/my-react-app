import React from "react";

import Expenses from "./components/Expenses/Expenses";
import NewExpense from "./components/NewExpense/NewExpense";
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
    {
      id: 4,
      date: new Date(2021, 5, 4),
      title: "Lorry Insurance",
      amount: "Rs. 400",
    }
  ];

  const addExpenseHandler = (expenseDateFromNewExpense) => {
    return(
      console.log(expenseDateFromNewExpense)
    );
  };  


  return (
    <div className="App">
      <NewExpense onAddExpense={addExpenseHandler}/>
      <Expenses items={expenseItemData}/> 
    </div>
  );
};

export default App;
