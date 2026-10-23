import { useState } from "react";
import Navbar from "./components/Navbar";
import TDEE_Form from "./components/TDEE_Form";
import Sidebar from "./components/Sidebar";
import MealSection from "./components/MealSection";
import AddMealModal from "./components/AddMealModal";
import AddFood from "./components/AddFood";
import "./App.css";

function addMeal(title, setMeals, meals) {
  if (title !== "") {
    console.log(`Adding meal: ${title}`);
    setMeals([...meals, [title, []]]);
    localStorage.setItem("meals", JSON.stringify([...meals, [title, []]]));
  }
}

function App() {
  const [waterIntake, setWaterIntake] = useState(0);
  const [meals, setMeals] = useState(() => {return localStorage.getItem("meals") ? JSON.parse(localStorage.getItem("meals")) : [["Breakfast", []], ["Lunch", []], ["Dinner", []]]});
  const [isOpen, setIsOpen] = useState(false);
  const [mealID, setMealID] = useState(() => {return localStorage.getItem("mealID") ? localStorage.getItem("mealID") : null});
  const [tdee, setTDEE] = useState(() => {return localStorage.getItem("tdee") ? parseFloat(localStorage.getItem("tdee")) : 0});
  const [goal, setGoal] = useState(() => {return localStorage.getItem("deficit") ? parseFloat(localStorage.getItem("deficit")) : 0});
  const [goals, setGoals] = useState(() => {return localStorage.getItem("goals") ? JSON.parse(localStorage.getItem("goals")) : {
    carbs: 0, 
    protein: 0, 
    fats: 0, 
    calories: goal
  }});
  const now = new Date();

  console.log(localStorage.getItem("meals"));

  function onAddFood(mealID) {
    console.log(`Add Food button clicked for meal: ${mealID}`);
    setIsOpen(true);
    setMealID(mealID);
    console.log(isOpen);
  }

  function onAddFoodToMeal(targetMealId, finalItem){
    console.log(`Adding food to meal ${targetMealId}:`, finalItem);
    var meal_copy = meals;
    setMeals(meals.map(meal => {
      if (meal[0] === targetMealId) {
        console.log(`Adding food to meal ${targetMealId}:`, finalItem);
        return [meal[0], [...meal[1], finalItem]];
      }
      return meal;
    }));
    meal_copy = meal_copy.map(meal => {
      if (meal[0] === targetMealId) {
        return [meal[0], [...meal[1], finalItem]];
      }
      return meal;
    });
    localStorage.setItem("meals", JSON.stringify(meal_copy));
    console.log(meal_copy);
  }

  function onClose(){
  setIsOpen(false);
  }

  return (
    <>
      <Navbar />
      <TDEE_Form setTDEE={setTDEE} setGoal={setGoal} setGoals={setGoals} />
      {/* add meal modal */}
      <AddMealModal meals={meals} setMeals={setMeals} addMeal={addMeal} />
      {
        isOpen && <AddFood isOpen={isOpen} onAddFoodToMeal={onAddFoodToMeal} onClose={onClose} targetMealId={mealID} />
      }
      <div className="flex lg:flex-row flex-col mx-auto bg-gray-600 rounded-full px-4 mb-2 justify-between items-center w-1/2 h-12">
        <h1 className="text-md md:text-2xl font-bold tracking-tight text-slate-100 items-center">
          Today's Fuel Log
        </h1>
        <span className="text-sm text-slate-400 font-medium">
          {now.toDateString()}
        </span>
      </div>
      <main className="flex flex-col-reverse lg:flex-row mx-2">
        <div className="container mr-2">
          <Sidebar waterIntake={waterIntake} setWaterIntake={setWaterIntake} goals={goals} />
        </div>
        <div id='Meals' className="container ml-2">
          {meals.map((meal, index) => (
            <MealSection key={index} id={`${meal[0]}`} title={meal[0]} items={meal[1]} onAddFood={onAddFood} />
          ))}
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
            onClick={() => {
              const element = document.getElementById("modal");
              element.classList.remove("collapse");
            }}
          >
            + Add Meal
          </button>
        </div>
      </main>
    </>
  );
}

export default App;
