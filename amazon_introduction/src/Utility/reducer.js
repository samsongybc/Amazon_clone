import { Type } from "./action.type";

export const initialState = {
  basket: [],
  user: null,
};

export const reducer = (state, action) => {
  switch (action.type) {
    case Type.ADD_TO_BASKET:
      // Check if item already exists in basket
      const existingItem = state.basket.find(
        (item) => item.id === action.item.id
      );

      if (existingItem) {
        // If item exists, increment quantity
        return {
          ...state,
          basket: state.basket.map((item) =>
            item.id === action.item.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      } else {
        // If new item, add with quantity 1
        return {
          ...state,
          basket: [...state.basket, { ...action.item, quantity: 1 }],
        };
      }

    case Type.REMOVE_FROM_BASKET:
      return {
        ...state,
        basket: state.basket.filter((item) => item.id !== action.id),
      };

    case Type.INCREMENT_ITEM:
      return {
        ...state,
        basket: state.basket.map((item) =>
          item.id === action.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ),
      };

    case Type.DECREMENT_ITEM:
      return {
        ...state,
        basket: state.basket.map((item) =>
          item.id === action.id
            ? { ...item, quantity: Math.max(1, item.quantity - 1) }
            : item
        ),
      };

    default:
      return state;
  }
};
