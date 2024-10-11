import { useContext } from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import TaskCard from './TaskCard.jsx';
import './index.css';

console.log('TaskBoard.jsx loaded');

function TaskBoard({ tasks, boardId, deleteTask, setDetailsVisbility }) {
  return (
    <div>
    <Droppable droppableId={`Board-${boardId}`} type='group'>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className="w-60 min-h-[5vh]  flex-grow-0 h-min mt-5 mx-2 border-4 border-gray-300 bg-gray-200 shadow-2xl pt-0.5 px-3 rounded-lg"
        >
          {tasks && tasks.map((task, index) => (
            <Draggable key={index} draggableId={`draggable-${boardId}-${index}`} index={index}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                  className="draggable"
                >
                  <TaskCard task={task} provided={provided} snapshot={snapshot} isDragging={snapshot.isDragging} deleteTask={() => deleteTask(boardId, index)} setDetailsVisbility={setDetailsVisbility} />
                </div>
              )}
            </Draggable>
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
    </div>
  );
}

export default TaskBoard;
