export default interface DraggableEvent {
  item: {
    classList: {
      add: Function;
      remove: Function;
    };
  };
  dragged: {
    id: string;
  };
  to: {
    parentElement: {
      id: string;
    };
  };
}
