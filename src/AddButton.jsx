function AddButton({addBoard}){

    return (
        <button onClick={addBoard} className="w-60 h-[3vh] mt-5 mx-2 shadow-md bg-gradient-to-t from-amber-100 to-sky-20 hover:from-sky-100 hover:to-amber-50
         dark:text-gray-100 dark:from-gray-700/50  dark:hover:from-gray-800 dark:hover:to-gray-600  text-gray-900 font-bold rounded-md flex items-center justify-center flex-shrink-0"> 
        <h1>+ Add another board</h1>
        </button>
    )
}

export default AddButton

