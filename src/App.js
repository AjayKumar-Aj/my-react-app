import "./App.css";
import ExpenseItem from "./components/ExpenseItem";

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
      <ExpenseItem
        date={expenseItemData[0].date}
        title={expenseItemData[0].title}
        amount={expenseItemData[0].amount}
      ></ExpenseItem>
      <ExpenseItem
        date={expenseItemData[1].date}
        title={expenseItemData[1].title}
        amount={expenseItemData[1].amount}
      ></ExpenseItem>
      <ExpenseItem
        date={expenseItemData[2].date}
        title={expenseItemData[2].title}
        amount={expenseItemData[2].amount}
      ></ExpenseItem>
    </div>
  );
};

export default App;
