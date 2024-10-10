function Details(taskName, taskNote) {
    return (
        <div className="z-10 w-screen h-screen bg-black bg-opacity-80 pointer-events-auto absolute">
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-300 h-4/6 w-4/12 rounded-lg">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 text-left mx-10 my-5">Task name</h1>
             <div className="overflow-auto max-h-[85%] bg-slate-200 rounded-sm mx-5">
               <p className="text-xl tracking-tight text-gray-900 text-left mx-10 my-5">Task description</p>
             </div>
            
            </div>
        </div>
    );
}

export default Details;