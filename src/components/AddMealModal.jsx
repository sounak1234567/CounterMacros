function AddMealModal({ meals, setMeals, addMeal }) {
  return (
    <>
      <div
        id="modal"
        className="collapse w-1/2 z-10 bg-gray-500 absolute rounded-2xl shadow-2xl p-2 lg:mx-96 mx-auto"
      >
        <form
          className="flex flex-col"
          onSubmit={(e) => {
            e.preventDefault();
            const element = document.getElementById("modal");
            element.classList.add("collapse");
            const title = document.getElementById("title").value;
            addMeal(title, setMeals, meals);
          }}
        >
          <input
            className="border-2 border-gray-300 rounded-md py-2 px-4 mb-4"
            type="text"
            name="title"
            id="title"
            placeholder="Meal Name"
          />
          <div className="container">
            <button
              className="border-4 border-green-800 hover:bg-green-900 rounded-2xl w-1/2 mr-2"
              type="submit"
            >
              Add Meal
            </button>
            <button
              className="bg-gray-600 hover:bg-black text-white font-bold py-2 px-4 rounded-full ml-2"
              onClick={(e) => {
                e.preventDefault();
                const element = document.getElementById("modal");
                element.classList.add("collapse");
              }}
            >
              Close
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default AddMealModal;
