function TDEE_Form({ setTDEE, setGoal, setGoals }){

    function onClose(){
        const element = document.getElementById("tdee-modal");
        element.classList.add("collapse");
    }

    function calculateTDEE(e){
        e.preventDefault();
        const name = document.getElementById("name").value;
        const age = document.getElementById("age").value;
        const height = document.getElementById("height").value;
        const weight = document.getElementById("weight").value;
        const sex = document.getElementById("sex").value;
        const activity = document.getElementById("activity").value;
        const diet = document.getElementById("diet").value;
        const s = (sex === "male") ? 5 : -161;
        const BMR = (10 * weight) + (6.25 * height) - (5 * age) + s;
        const activityMultiplier = (activity === "sedentary") ? 1.2 : (activity === "light") ? 1.375 : (activity === "moderate") ? 1.55 : 1.725;
        const tdee = BMR * activityMultiplier;
        const deficit = (diet === "lose") ? tdee * 0.8 : (diet === "gain") ? tdee * 1.2 : tdee;
        console.log(`TDEE for ${name}: ${tdee.toFixed(2)}`);
        const goals = {
            calories: deficit, 
            protein: weight*2,
            fats: (deficit * 0.25) / 9,
            carbs: (deficit - (weight*8 + (deficit * 0.25))) / 4
        };
        setTDEE(tdee);
        setGoal(deficit);
        setGoals(goals);
        localStorage.setItem("goals", JSON.stringify(goals));
        localStorage.setItem("tdee", JSON.stringify(tdee));
        localStorage.setItem("deficit", JSON.stringify(deficit));
        document.getElementById("tdee-modal").className = "collapse";
    }

    return (
        <>
            <div id="tdee-modal" className="collapse">

            
            <div className="fixed z-20 backdrop-blur-md inset-0 w-full h-full"></div>
            <div className="z-50 fixed border-4 shadow-lg top-10 left-10 bg-gray-900 p-4 lg:mx-96 mx-auto w-1/2 rounded">
                
                <form onSubmit={(e) => {calculateTDEE(e)}}>
                    <div className="flex flex-col">
                        <label className="text-amber-200" htmlFor="name">Name:</label>
                        <input className="p-4 rounded-xl bg-gray-700 text-white placeholder:text-gray-500 border border-gray-600 focus:ring-blue-500 focus:border-blue-500" type="text" id="name" />
                        <label className="text-amber-200" htmlFor="age">Age: </label>
                        <input className="p-4 rounded-xl bg-gray-700 text-white placeholder:text-gray-500 border border-gray-600 focus:ring-blue-500 focus:border-blue-500" type="number" id="age" />
                        <label className="text-amber-200" htmlFor="height">Height (cm): </label>
                        <input className="p-4 rounded-xl bg-gray-700 text-white placeholder:text-gray-500 border border-gray-600 focus:ring-blue-500 focus:border-blue-500" type="number" id="height" />
                        <label className="text-amber-200" htmlFor="weight">Weight (kg): </label>
                        <input className="p-4 rounded-xl bg-gray-700 text-white placeholder:text-gray-500 border border-gray-600 focus:ring-blue-500 focus:border-blue-500" type="number" id="weight" />
                        <label className="text-amber-200" htmlFor="sex">Sex: </label>
                        <select className="p-4 rounded-xl bg-gray-700 text-white placeholder:text-gray-500 border border-gray-600 focus:ring-blue-500 focus:border-blue-500" id="sex">
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                        </select>
                        <label className="text-amber-200" htmlFor="activity">Activity Level: </label>
                        <select className="p-4 rounded-xl bg-gray-700 text-white placeholder:text-gray-500 border border-gray-600 focus:ring-blue-500 focus:border-blue-500" id="activity">
                            <option value="sedentary">Sedentary(little to no exercise)</option>
                            <option value="light">Lightly Active(1-3 days/week)</option>
                            <option value="moderate">Moderately Active(3-5 days/week)</option>
                            <option value="very">Very Active(6-7 days/week)</option>
                        </select>
                        <label className="text-amber-200" htmlFor="diet">Diet Goal: </label>
                        <select className="p-4 rounded-xl bg-gray-700 text-white placeholder:text-gray-500 border border-gray-600 focus:ring-blue-500 focus:border-blue-500" id="diet">
                            <option value="maintain">Maintain Weight</option>
                            <option value="lose">Lose Weight (cut)</option>
                            <option value="gain">Gain Weight (bulk)</option>
                        </select>
                    </div>
                    <div className="flex mt-2 lg:flex-row flex-col mb-2">
                        <button className="bg-blue-500 hover:bg-blue-600 text-white mb-2 font-bold ml-2 py-2 px-4 rounded-2xl" type="submit">
                        Calculate TDEE
                    </button>
                    <button type="button" className="bg-gray-600 hover:bg-gray-700 mb-2 hover:cursor-pointer text-white font-bold ml-2 py-2 px-4 rounded-2xl" data-bs-toggle="collapse" data-bs-target="#tdee-modal" onClick={onClose}>
                    Close
                </button>
                    </div>
                </form>
                
            </div>
            </div>
        </>
    )
}

export default TDEE_Form;
