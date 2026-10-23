function Sidebar({ waterIntake, setWaterIntake, goals }) {
    const meals = localStorage.getItem('meals') ? JSON.parse(localStorage.getItem('meals')) : [["Breakfast", []], ["Lunch", []], ["Dinner", []]];
    const totalCalories = meals.reduce((sum, meal) => {
        return sum + meal[1].reduce((mealSum, item) => mealSum + item.calories, 0);
    }, 0);
    const totalCarbs = meals.reduce((sum, meal) => {
        return sum + meal[1].reduce((mealSum, item) => mealSum + item.carbs, 0);
    }, 0);
    const totalProteins = meals.reduce((sum, meal) => {
        return sum + meal[1].reduce((mealSum, item) => mealSum + item.protein, 0);
    }, 0);
    const totalFats = meals.reduce((sum, meal) => {
        return sum + meal[1].reduce((mealSum, item) => mealSum + item.fat, 0);
    }, 0);
    const macros = {
        calories: { current: totalCalories, goal: goals.calories },
        protein: { current: totalProteins, goal: goals.protein },
        carbs: { current: totalCarbs, goal: goals.carbs },
        fats: { current: totalFats, goal: goals.fats }
    };
    console.log(macros);
    const calcPercentage = (current, goal) => Math.min(Math.round((current / goal) * 100), 100);
    const tdee = localStorage.getItem('tdee') ? parseFloat(localStorage.getItem('tdee')) : 0;
    return (
    <div className="flex flex-col gap-6">
        {/* Macro & Calorie Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col gap-5">
        <h2 className="text-lg font-semibold tracking-tight text-slate-200">
            Daily Targets
        </h2>

        {/* Total Calories Progress */}
        <div className="flex flex-col gap-2">
            <div className="flex justify-between text-sm">
            <span className="text-slate-400">Calories Maintenance: {tdee} kcal</span>
            <span className="font-medium text-slate-100">
                {macros.calories.current} / {macros.calories.goal} kcal
            </span>
            </div>
            <div className="bg-slate-800 h-3 rounded-full overflow-hidden md:w-full w-3/4">
            <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                style={{
                width: `${calcPercentage(macros.calories.current, macros.calories.goal)}%`,
                }}
            ></div>
            </div>
        </div>

        <hr className="border-slate-800" />

        {/* Individual Macros */}
        <div className="flex flex-col gap-4">
            {/* Protein */}
            <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs">
                <span className="text-slate-400 font-medium">Protein</span>
                <span className="text-slate-200">
                {macros.protein.current}g / {macros.protein.goal}g
                </span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                className="bg-blue-500 h-full rounded-full"
                style={{
                    width: `${calcPercentage(macros.protein.current, macros.protein.goal)}%`,
                }}
                ></div>
            </div>
            </div>

            {/* Carbs */}
            <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs">
                <span className="text-slate-400 font-medium">Carbs</span>
                <span className="text-slate-200">
                {macros.carbs.current}g / {macros.carbs.goal}g
                </span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                className="bg-amber-500 h-full rounded-full"
                style={{
                    width: `${calcPercentage(macros.carbs.current, macros.carbs.goal)}%`,
                }}
                ></div>
            </div>
            </div>

            {/* Fats */}
            <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs">
                <span className="text-slate-400 font-medium">Fats</span>
                <span className="text-slate-200">
                {macros.fats.current}g / {macros.fats.goal}g
                </span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                className="bg-rose-500 h-full rounded-full"
                style={{
                    width: `${calcPercentage(macros.fats.current, macros.fats.goal)}%`,
                }}
                ></div>
            </div>
            </div>
        </div>
        </div>

        {/* Water Tracker Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col gap-4">
        <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold tracking-tight text-slate-200">
            Water Intake
            </h2>
            <span className="text-cyan-400 font-bold text-sm">
            {waterIntake} ml
            </span>
        </div>

        <div className="flex items-center gap-3">
            <button
            onClick={() => setWaterIntake((prev) => Math.max(0, prev - 250))}
            className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 py-2 rounded-xl text-sm font-medium transition"
            >
            - 250ml
            </button>
            <button
            onClick={() => setWaterIntake((prev) => prev + 250)}
            className="flex-1 bg-cyan-600 hover:bg-cyan-500 text-white py-2 rounded-xl text-sm font-medium transition shadow-lg shadow-cyan-900/30"
            >
            + 250ml
            </button>
        </div>
        </div>
    </div>
    );
}

export default Sidebar;
