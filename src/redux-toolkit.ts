import { createSlice, PayloadAction, configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import { v1 as uuid } from "uuid";
import logger from "redux-logger";

import { Todo } from "./type";

const todosInitialState: Todo[] = [
  {
    id: uuid(),
    desc: "Learn React",
    isComplete: true,
  },
  {
    id: uuid(),
    desc: "Learn Redux",
    isComplete: true,
  },
  {
    id: uuid(),
    desc: "Learn Redux-ToolKit",
    isComplete: false,
  },
];

const todosSlice = createSlice({
  name: "todos",
  initialState: todosInitialState,
  reducers: {
    create: {
      reducer: (
        state,
        {
          payload,
        }: PayloadAction<{ id: string; desc: string; isComplete: boolean }>
      ) => {
        state.push(payload);
      },
      prepare: ({ desc }: { desc: string }) => ({
        payload: {
          id: uuid(),
          desc,
          isComplete: false,
        },
      }),
    },
    edit: (state, { payload }: PayloadAction<{ id: string; desc: string }>) => {
      const todoToEdit = state.find((todo) => todo.id === payload.id);
      if (todoToEdit) {
        todoToEdit.desc = payload.desc;
      }
    },
    toggle: (
      state,
      { payload }: PayloadAction<{ id: string; isComplete: boolean }>
    ) => {
      const toToggle = state.find((todo) => todo.id === payload.id);
      if (toToggle) {
        toToggle.isComplete = payload.isComplete;
      }
    },
    remove: (state, { payload }: PayloadAction<{ id: string }>) => {
      const index = state.findIndex((todo) => todo.id === payload.id);
      if (index !== -1) {
        state.splice(index, 1);
      }
    },
  },
});

const selectedTodoSlice = createSlice({
  name: "selectedTodo",
  initialState: null as string | null,
  reducers: {
    select: (state, { payload }: PayloadAction<{ id: string }>) => payload.id,
    // when dealing with primitive values in the state return the new state
  },
});

const counterSlice = createSlice({
  name: "counter",
  initialState: 0,
  reducers: {},
  // TO ACCEPT OTHER ACTION TYPES UNRELATED TO ITS OWN STATE
  extraReducers: {
    [todosSlice.actions.create.type]: (state) => state + 1,
    [todosSlice.actions.edit.type]: (state) => state + 1,
    [todosSlice.actions.toggle.type]: (state) => state + 1,
    [todosSlice.actions.remove.type]: (state) => state + 1,
  },
});

// EXPORTING ACTION CREATORS
export const {
  create: createTodoActionCreator,
  edit: editTodoActionCreator,
  toggle: toggleTodoActionCreator,
  remove: deleteTodoActionCreator,
} = todosSlice.actions;

export const { select: selectTodoActionCreator } = selectedTodoSlice.actions;

// COMBINING REDUCERS
// no need to call combine reducers, just put them in an obj & RTK will combine them
// and we give them to out configureStore RTK will call combineReducers upon our obj
const reducer = {
  todos: todosSlice.reducer,
  selectedTodo: selectedTodoSlice.reducer,
  counter: counterSlice.reducer,
};

const middleware = [...getDefaultMiddleware(), logger];

export default configureStore({
  // reducer: reducer   // because theyre the same name we just put a comma
  reducer,
  // extra step to log stuff
  middleware,
  // to turn off devtools for production use
  // devTools: false
});
