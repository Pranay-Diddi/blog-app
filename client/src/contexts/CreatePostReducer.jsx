import { useReducer } from "react";

export let intialState = {
  id: "",
  username: "",
  title: "",
  description: "",
  tags: [],
};

export function createPostReducer(state, action) {
  switch (action.type) {
    case "id":
      return {
        ...state,
        id: action.payload,
      };

    case "username":
      return {
        ...state,
        username: action.payload,
      };

    case "title":
      return {
        ...state,
        title: action.payload,
      };

    case "description":
      return {
        ...state,
        description: action.payload,
      };

    case "tags":
      return {
        ...state,
        tags: action.payload,
      };

    default:
      return state;
  }
}
