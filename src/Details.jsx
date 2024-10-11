function Details({setDetailsVisbility, taskObj} ) {
    return (
        <>
        <div onClick={() => setDetailsVisbility(null, false)} className="z-10 w-screen h-screen bg-black bg-opacity-80 pointer-events-auto absolute">
        </div>
        <div className="z-20 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-300 h-4/6 w-4/12 rounded-lg shadow-lg border-8  border-gray-300 bg-gradient-to-br from-gray-100 to-gray-200 shadow-gray-500">
          {taskObj &&  <><h1 className="z-20 text-3xl font-bold tracking-tight text-gray-900 text-left mx-10 my-5">{taskObj.name}</h1>
                <div className="z-20 overflow-auto max-h-[85%] bg-slate-200 rounded-sm mx-5">
                    <p className="z-20 text-xl tracking-tight font-sans text-gray-900 text-left mx-10 my-5">{taskObj.note}</p>
                </div></>}
            </div>
        </>
    );
}

export default Details;