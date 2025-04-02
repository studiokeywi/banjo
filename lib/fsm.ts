/**
 * General purpose finite state machine pattern
 *
 * @module fsm
 * @author studioKeywi*/

// // TODO: what is a good generic implementation to provide?
// interface FSM<Type> {
//   get state(): State;
//   // ???
//   action(type: Type): void;
// }

// interface State<Type = unknown> {
//   action(type: Type): State<Type>;
//   onEnter?(): void;
//   onExit?(): void;
// }

// const createFSM = <Type>(initState: State<Type>): FSM<Type> => {
//   let state = initState;

//   return {
//     get state() {
//       return state;
//     },
//     action(type) {
//       const next = state.action(type);
//       if (next === state) {
//         return;
//       }
//       state.onExit?.();
//       state = next;
//       state.onEnter?.();
//     },
//   };
// };
