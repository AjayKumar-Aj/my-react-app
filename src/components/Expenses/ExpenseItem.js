import React /* {useState} */ from "react";

import ExpenseDate from "./ExpenseDate";
import "./ExpenseItem.css";
import Card from "../UI/Card";

const ExpenseItem = (props) => {
  /* const [title, setTitle] = useState(props.title); */

  /* const clickHandler = () => {
    return (
      setTitle("Button Clicked"),
      console.log(title)
    );
  }; */

  return (
    <li>
      <Card className="expense-item">
        <ExpenseDate date={props.date} />
        <div className="expense-item__description">
          <h2>{props.title}</h2>
          <div className="expense-item__price">Rs. {props.amount}</div>
        </div>

        {/* Clicking event to change content method */}
        {/* <button onClick={clickHandler}>Change Title</button> */}
      </Card>
    </li>
  );
};

export default ExpenseItem;
