import Card from "./Card";
import { CardType } from "../types/card";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";

type ColumnProps = {
  id: string;
  title: string;
  cards: CardType[];
};

const Column = ({ id, title, cards }: ColumnProps) => {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div ref={setNodeRef} className="w-52 bg-gray-100 mr-2 rounded shadow-sm">
      <p className="px-5 py-2 text-left font-medium text-gray-700 border-b border-gray-200">
        {title}
      </p>
      <SortableContext items={cards.map((card) => card.id)} strategy={rectSortingStrategy}>
        {cards.map((card) => (
          <Card key={card.id} id={card.id} title={card.title} />
        ))}
      </SortableContext>
    </div>
  );
};

export default Column;
