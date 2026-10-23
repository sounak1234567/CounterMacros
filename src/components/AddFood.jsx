import React, { useState } from "react";

export default function AddFoodModal({
  isOpen,
  onClose,
  onAddFoodToMeal,
  targetMealId,
}) {
  // Mode toggle: 'api' or 'manual'
  const [mode, setMode] = useState("api");

  // API Search States
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [servingWeight, setServingWeight] = useState(100);

  // Manual Entry States
  const [manualForm, setManualForm] = useState({
    name: "",
    servingSize: "100g",
    calories: "",
    protein: "",
    carbs: "",
    fat: "",
  });

  // 1. Explicit API Fetch triggered by Search Button
  const handleApiSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery || searchQuery.trim().length < 2) return;

    setIsLoading(true);
    try {
      const url = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(searchQuery)}&search_simple=1&json=1&page_size=6`;

      const response = await fetch(url, {
        headers: {
          "User-Agent": "LocalCalorieTracker/1.0 (sounak.developer@email.com)",
        },
      });

      if (!response.ok) throw new Error("Network failed");

      const data = await response.json();

      const normalized = data.products.map((product) => {
        const nutriments = product.nutriments || {};
        return {
          id: product.code || Math.random().toString(),
          name: product.product_name || "Unnamed Product",
          brands: product.brands || "Unknown Brand",
          calories100g:
            nutriments["energy-kcal_100g"] || nutriments["energy-kcal"] || 0,
          protein100g: nutriments["proteins_100g"] || 0,
          carbs100g: nutriments["carbohydrates_100g"] || 0,
          fat100g: nutriments["fat_100g"] || 0,
        };
      });

      setSearchResults(normalized);
    } catch (error) {
      console.error("OFF Search Error:", error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Select API Item & Scale Macros
  const handleSelectApiFood = (food) => {
    const scale = servingWeight / 100;
    const finalItem = {
      id: food.id,
      name: food.name,
      servingWeight: `${servingWeight}g`,
      calories: Math.round(food.calories100g * scale),
      protein: parseFloat((food.protein100g * scale).toFixed(1)),
      carbs: parseFloat((food.carbs100g * scale).toFixed(1)),
      fat: parseFloat((food.fat100g * scale).toFixed(1)),
    };

    onAddFoodToMeal(targetMealId, finalItem);
    onClose();
  };

  // 3. Handle Manual Form Submission
  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (!manualForm.name || !manualForm.calories) return;

    const finalItem = {
      id: Math.random().toString(),
      name: manualForm.name,
      servingWeight: manualForm.servingSize || "100g",
      calories: Number(manualForm.calories) || 0,
      protein: Number(manualForm.protein) || 0,
      carbs: Number(manualForm.carbs) || 0,
      fat: Number(manualForm.fat) || 0,
    };

    onAddFoodToMeal(targetMealId, finalItem);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div id="food-modal" className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 w-full max-w-lg shadow-2xl">
        {/* Modal Header & Mode Tabs */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-white">Add Food to Meal</h2>
          <div className="flex bg-slate-800 p-1 rounded-lg border border-slate-700">
            <button
              type="button"
              onClick={() => setMode("api")}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${mode === "api" ? "bg-emerald-600 text-white" : "text-slate-400 hover:text-white"}`}
            >
              API Search
            </button>
            <button
              type="button"
              onClick={() => setMode("manual")}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${mode === "manual" ? "bg-emerald-600 text-white" : "text-slate-400 hover:text-white"}`}
            >
              Custom Manual
            </button>
          </div>
        </div>

        {/* TAB 1: API DYNAMIC SEARCH */}
        {mode === "api" && (
          <div>
            <form onSubmit={handleApiSearch} className="flex gap-2 mb-4">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Open Food Facts (e.g., oats, peanut butter)..."
                className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 text-sm"
                autoFocus
              />
              <button
                type="submit"
                disabled={isLoading}
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
              >
                {isLoading ? "Searching..." : "Search"}
              </button>
            </form>

            <div className="flex items-center gap-3 mb-4 bg-slate-800/40 p-3 rounded-lg border border-slate-800">
              <label className="text-xs text-slate-300">
                Serving Weight Multiplier (g):
              </label>
              <input
                type="number"
                value={servingWeight}
                onChange={(e) => setServingWeight(Number(e.target.value))}
                className="w-20 bg-slate-800 border border-slate-700 rounded px-2 py-1 text-white text-center text-sm"
                min="1"
              />
            </div>

            <div className="max-h-60 overflow-y-auto space-y-2 mb-4 pr-1">
              {searchResults.map((food) => (
                <div
                  key={food.id}
                  onClick={() => handleSelectApiFood(food)}
                  className="bg-slate-800/80 hover:bg-slate-800 border border-slate-700/50 hover:border-emerald-500/50 p-3 rounded-lg cursor-pointer transition-all flex justify-between items-center"
                >
                  <div>
                    <h4 className="text-white font-medium text-sm">
                      {food.name}
                    </h4>
                    <p className="text-xs text-slate-400">{food.brands}</p>
                  </div>
                  <div className="text-right text-xs">
                    <p className="font-semibold text-emerald-400">
                      {Math.round(food.calories100g * (servingWeight / 100))}{" "}
                      kcal
                    </p>
                    <p className="text-slate-400">
                      P: {Math.round(food.protein100g * (servingWeight / 100))}g
                    </p>
                  </div>
                </div>
              ))}
              {searchResults.length === 0 && !isLoading && (
                <p className="text-center text-slate-500 py-6 text-sm">
                  Enter a search term and click search to query Open Food Facts.
                </p>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: MANUAL CUSTOM ENTRY */}
        {mode === "manual" && (
          <form onSubmit={handleManualSubmit} className="space-y-3">
            <div>
              <label className="block text-xs text-slate-400 mb-1">
                Food Name
              </label>
              <input
                type="text"
                required
                value={manualForm.name}
                onChange={(e) =>
                  setManualForm({ ...manualForm, name: e.target.value })
                }
                placeholder="e.g., Home-cooked Chicken Curry"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1">
                  Serving Size
                </label>
                <input
                  type="text"
                  value={manualForm.servingSize}
                  onChange={(e) =>
                    setManualForm({
                      ...manualForm,
                      servingSize: e.target.value,
                    })
                  }
                  placeholder="e.g., 1 bowl / 150g"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">
                  Calories (kcal)
                </label>
                <input
                  type="number"
                  required
                  value={manualForm.calories}
                  onChange={(e) =>
                    setManualForm({ ...manualForm, calories: e.target.value })
                  }
                  placeholder="250"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1">
                  Protein (g)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={manualForm.protein}
                  onChange={(e) =>
                    setManualForm({ ...manualForm, protein: e.target.value })
                  }
                  placeholder="20"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">
                  Carbs (g)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={manualForm.carbs}
                  onChange={(e) =>
                    setManualForm({ ...manualForm, carbs: e.target.value })
                  }
                  placeholder="10"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">
                  Fat (g)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={manualForm.fat}
                  onChange={(e) =>
                    setManualForm({ ...manualForm, fat: e.target.value })
                  }
                  placeholder="8"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors w-full"
              >
                Add Custom Food
              </button>
            </div>
          </form>
        )}

        {/* Modal Footer */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm font-medium transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
