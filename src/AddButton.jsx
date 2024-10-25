function AddButton({addBoard}){

    return (
        <button onClick={addBoard} className="w-60 h-[3vh] mt-5 mx-2 shadow-md dark:shadow-gray-700/50 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-100 hover:bg-gray-400 border-4 dark:border-gray-600 border-gray-300 bg-gray-200 text-gray-900 font-bold rounded-md flex items-center justify-center flex-shrink-0"> 
        <h1>+ Add another board</h1>
        </button>
    )
}

export default AddButton

