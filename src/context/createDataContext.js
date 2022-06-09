import React, { createContext, useReducer } from "react";

export const createDataContext = (reducer, actions, initialState) => {
  // Creating the context related to the data and statemanagement
  const Context = createContext();

  const Provider = ({ children }) => {
    // using useReducer hook to manage state using reducer function and initialState.
    const [state, dispatch] = useReducer(reducer, initialState);
    const boundActions = [];
    //converting actions from dispatch-actions option
    for (let key in actions) {
      boundActions[key] = actions[key](dispatch);
    }
    return (
      <Context.Provider value={{ state, ...boundActions }}>
        {children}
      </Context.Provider>
    );
  };
  return { Context, Provider };
};
