import { useState } from "react";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";
import Column from "./Column";
import { CardType } from "./Card";

const initialCards: CardType[] = [
  { id: "1", title: "タスクA" },
  { id: "2", title: "タスクB" },
  { id: "3", title: "タスクC" },
];

const Board = () => {
  const [cards, setCards] = useState<CardType[]>(initialCards);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = cards.findIndex((card) => card.id === active.id);
      const newIndex = cards.findIndex((card) => card.id === over?.id);
      const newCards = arrayMove(cards, oldIndex, newIndex);
      setCards(newCards);
    }
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <SortableContext items={cards.map((card) => card.id)} strategy={rectSortingStrategy}>
        <Column id="column-1" title="To Do" cards={cards} />
      </SortableContext>
    </DndContext>
  );
};

export default Board;
