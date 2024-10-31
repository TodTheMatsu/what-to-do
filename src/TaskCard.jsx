function TaskCard({ task, provided, snapshot, deleteTask, setDetailsVisibility }) {
    return (
        <div
            className={`w-full z-0 h-20 my-2 ${snapshot.isDragging ? 'animate-pulse outline-dashed outline-2 dark:outline-white' : ''} bg-gray-50 dark:bg-gray-900 shadow-2xl rounded-md flex items-center justify-center flex-col relative hover:border-gray-900 dark:hover:border-gray-700`}
            {...provided.dragHandleProps}
            {...provided.draggableProps}
            ref={provided.innerRef}
        >
            <div onClick={() => setDetailsVisibility(task, true)} className="w-full h-full cursor-pointer flex items-center justify-center">
                <h1 className="text-3xl select-none truncate font-bold tracking-tight text-gray-900 dark:text-gray-100 text-center">{task.name}</h1>
            </div>
            <div onClick={deleteTask}
                 className="bg-red-500 select-none hover:bg-red-700 text-white font-bold py-1 px-2 rounded-full text-sm absolute -top-2 -right-2 border-2 border-red-700 dark:border-red-500 cursor-pointer">
                X
            </div>
        </div>
    );
}

export default TaskCard;


