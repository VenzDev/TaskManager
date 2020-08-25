export default interface DraggableEvent {
  item: {
    classList: {
      add: Function;
      remove: Function;
    };
  };
}
