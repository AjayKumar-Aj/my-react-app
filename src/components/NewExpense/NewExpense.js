import React, { useState } from "react";

import ExpenseForm from "./ExpenseForm";
import "./NewExpense.css";

const NewExpense = (props) => {
  const [isEditing, setIsEditing] = useState(false);

  const SaveExpenseDataHandler = (expensesArgumentData) => {
    const expenseData = {
      ...expensesArgumentData,
      id: Math.random().toString(),
    };

    props.onAddExpense(expenseData);
    setIsEditing(false);
  };

  const singleButton = () => {
    setIsEditing(true);
  };

  const completeForm = () => {
    setIsEditing(false);
  };

  return (
    <div className="new-expense">
      {!isEditing && <button onClick={singleButton}>Add New Expense</button>}
      {isEditing && (
        <ExpenseForm
          onSaveExpenseData={SaveExpenseDataHandler}
          onCancel={completeForm}
        />
      )}
    </div>
  );
};

export default NewExpense;
