function TaskCard({ text, provided, deleteTask, setDetailsVisbility}) {
    return (
        <div
            className="w-full z-0 h-20 my-2 hover:bg-gray-300 bg-gray-100 shadow-2xl border-2 border-gray-400 rounded-md flex items-center justify-center flex-col relative hover:border-gray-900"
            {...provided.dragHandleProps}
            {...provided.draggableProps}
            ref={provided.innerRef}
        >
            <button onClick={setDetailsVisbility}>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 text-center text-wrap">{text}</h1>
            <button onClick={deleteTask}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded-full text-sm absolute -top-2 -right-2 border-2 border-red-700"
            >
                X
              </button>
            </button>
        </div>
    );
}

export default TaskCard;
