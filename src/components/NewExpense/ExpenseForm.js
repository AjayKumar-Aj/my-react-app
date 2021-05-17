import React, { useState } from "react";

import "./ExpenseForm.css";

const ExpenseForm = (props) => {
  const [enteredTitle, setenteredTitle] = useState("");
  const [enteredAmount, setenteredAmount] = useState("");
  const [enteredDate, setenteredDate] = useState("");

  /* Assign more than one state as a object variables in useState Method */
  /* const [userInput, setUserInput] = useState({
    titleChange: '',
    dateChange: '',
    amountChange: ''
  }); */

  const titleChangeHandler = (event) => {
    return (
      /* First Method - Handling States using useState Method individually */
      setenteredTitle(event.target.value)

      /* Second Method - Handling Multiple States using single use State */
      /* setUserInput({
        ...userInput,
        titleChange: event.target.value,
      }) */

      /* Third Method - Handling Multiple States using single use State */
      /* setUserInput((prevState) => {
        return {
          ...prevState,
          titleChange: event.target.value,
        };
      }) */
    );
  };
  const amountChangeHandler = (event) => {
    return (
      /* First Method - Handling States using useState Method individually */
      setenteredAmount(event.target.value)

      /* Second Method - Handling Multiple States using single use State */
      /* setUserInput({
        ...userInput,
        amountChange: event.target.value,
      }) */

      /* Third Method - Handling Multiple States using single use State */
      /* setUserInput((prevState) => {
        return {
          ...prevState,
          amountChange: event.target.value,
        };
      }) */
    );
  };
  const dateChangeHandler = (event) => {
    return (
      /* First Method - Handling States using useState Method individually */
      setenteredDate(event.target.value)

      /* Second Method - Handling Multiple States using single use State */
      /* setUserInput({
        ...userInput,
        dateChange: event.target.value,
      }) */

      /* Third Method - Handling Multiple States using single use State */
      /* setUserInput((prevState) => {
        return {
          ...prevState,
          dateChange: event.target.value,
        };
      }) */
    );
  };

  const submitForm = (event) => {
    event.preventDefault();

    const expenses = {
      title: enteredTitle,
      amount: enteredAmount,
      date: new Date(enteredDate).toLocaleString()
    };

    props.onSaveExpenseData(expenses);
    setenteredTitle('');
    setenteredAmount('');
    setenteredDate('');
  };

  return (
    <form onSubmit={submitForm}>
      <div className="new-expense__controls">
        <div className="new-expense__control">
          <label>Title</label>
          <input type="text" value={enteredTitle} onChange={titleChangeHandler} />
        </div>
        <div className="new-expense__control">
          <label>Amount</label>
          <input
            type="number"
            min="0.01"
            step="0.01"
            value={enteredAmount}
            onChange={amountChangeHandler}
          />
        </div>
        <div className="new-expense__control">
          <label>Date</label>
          <input
            type="date"
            min="2019-01-01"
            max="2021-12-31"
            value={enteredDate}
            onChange={dateChangeHandler}
          />
        </div>
      </div>
      <div className="new-expense__actions">
        <button type="submit">Add Expense</button>
      </div>
    </form>
  );
};

export default ExpenseForm;
