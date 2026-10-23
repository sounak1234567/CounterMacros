function MealSection({ id, title, items = [], onAddFood }) {
  const totalMealCalories = items.reduce(
    (sum, item) => sum + Number(item.calories) * 1,
    0,
  );
  return (
    <div id={id} className="bg-slate-900 mb-2 mr-2 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col gap-4">
      {/* Meal Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-slate-100">{title}</h3>
          <span className="text-xs text-slate-400">
            {totalMealCalories} kcal
          </span>
        </div>
        <button
          onClick={() => onAddFood(id)}
          className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-3 py-1.5 rounded-xl font-medium transition flex items-center gap-1.5"
        >
          <span>+ Add Food</span>
        </button>
      </div>

      {/* Food Items List or Empty State */}
      {items.length === 0 ? (
        <div className="border border-dashed border-slate-800 rounded-xl p-4 text-center">
          <p className="text-xs text-slate-500">No items logged yet.</p>
        </div>
      ) : (
        <div className="flex flex-col min-w-0 gap-2">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center bg-slate-950/50 border border-slate-800/60 p-3 rounded-xl text-sm"
            >
              <div className="flex flex-col">
                <span className="font-medium text-slate-200">{item.name}</span>
                <span className="text-xs text-slate-400">
                  P: {item.protein}g | C: {item.carbs}g | F: {item.fat}g
                </span>
              </div>
              <span className="font-semibold text-emerald-400 text-xs bg-emerald-500/10 px-2 py-1 rounded-lg">
                {item.calories} kcal
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MealSection;
