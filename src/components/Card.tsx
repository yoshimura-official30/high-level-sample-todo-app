import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";

type CardProps = {
  id: string;
  title: string;
};

const Card = ({ id, title }: CardProps) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      className="m-2 p-4 bg-white text-gray-800 shadow rounded-md cursor-move"
    >
      <p>{title}</p>
    </div>
  );
};

export default Card;
