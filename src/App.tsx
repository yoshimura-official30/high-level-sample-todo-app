import "./App.css";
import {
  closestCorners,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverEvent
} from "@dnd-kit/core";
import {
  arrayMove,
  sortableKeyboardCoordinates
} from "@dnd-kit/sortable";
import Column, { ColumnType } from "./Column";
import { useState } from "react";

export default function App() {
  const initialData: ColumnType[] = [
    {
      id: "Column1",
      title: "To Do",
      cards: [
        { id: "Card1", title: "Card 1" },
        { id: "Card2", title: "Card 2" }
      ]
    },
    {
      id: "Column2",
      title: "In Progress",
      cards: [
        { id: "Card3", title: "Card 3" },
        { id: "Card4", title: "Card 4" }
      ]
    }
  ];

  const [columns, setColumns] = useState<ColumnType[]>(initialData);

  const findColumn = (id: string | null): ColumnType | null => {
    if (!id) return null;
    const isColumn = columns.some((col) => col.id === id);
    if (isColumn) return columns.find((col) => col.id === id) ?? null;

    const columnWithCard = columns.find((col) =>
      col.cards.some((card) => card.id === id)
    );
    return columnWithCard ?? null;
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over, delta } = event;
    const activeId = String(active.id);
    const overId = over ? String(over.id) : null;

    const activeColumn = findColumn(activeId);
    const overColumn = findColumn(overId);
    if (!activeColumn || !overColumn || activeColumn === overColumn) return;

    setColumns((prev) => {
      const activeItems = activeColumn.cards;
      const overItems = overColumn.cards;
      const activeIndex = activeItems.findIndex((i) => i.id === activeId);
      const overIndex = overItems.findIndex((i) => i.id === overId);

      const newIndex = () => {
        const isLast = overIndex === overItems.length - 1 && delta.y > 0;
        return overIndex >= 0 ? overIndex + (isLast ? 1 : 0) : overItems.length;
      };

      return prev.map((col) => {
        if (col.id === activeColumn.id) {
          return {
            ...col,
            cards: activeItems.filter((i) => i.id !== activeId)
          };
        }
        if (col.id === overColumn.id) {
          return {
            ...col,
            cards: [
              ...overItems.slice(0, newIndex()),
              activeItems[activeIndex],
              ...overItems.slice(newIndex())
            ]
          };
        }
        return col;
      });
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    const activeId = String(active.id);
    const overId = over ? String(over.id) : null;

    const activeColumn = findColumn(activeId);
    const overColumn = findColumn(overId);
    if (!activeColumn || !overColumn || activeColumn !== overColumn) return;

    const activeIndex = activeColumn.cards.findIndex((i) => i.id === activeId);
    const overIndex = overColumn.cards.findIndex((i) => i.id === overId);
    if (activeIndex !== overIndex) {
      setColumns((prev) =>
        prev.map((col) => {
          if (col.id !== activeColumn.id) return col;
          return {
            ...col,
            cards: arrayMove(col.cards, activeIndex, overIndex)
          };
        })
      );
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
    >
      <div className="flex gap-4 p-6 bg-gray-100 min-h-screen">
        {columns.map((column) => (
          <Column
            key={column.id}
            id={column.id}
            title={column.title}
            cards={column.cards}
          />
        ))}
      </div>
    </DndContext>
  );
}
