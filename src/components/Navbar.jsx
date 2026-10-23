function Navbar(){

    function tdeeOpen(){
        const element = document.getElementById("tdee-modal");
        element.classList.remove("collapse");
    }

    return (
        <nav className="bg-gray-800 flex justify-space-between rounded-xl text-white p-4 m-2">
            <div className="container mx-auto">
                <h1 className="text-xl font-bold">Calorie Tracker</h1>
            </div>
            <div className="flex max-auto items-end">
                <button className="bg-blue-500 hover:bg-blue-700 hover:cursor-pointer text-white font-bold py-2 px-4 rounded" onClick={tdeeOpen}>
                    <span className="text-xl font-bold">TDEE</span>
                </button>
            </div>
        </nav>
    )
}

export default Navbar;
