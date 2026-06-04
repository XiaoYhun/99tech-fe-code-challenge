import { create } from "zustand";
import { SUPPORTED_TOKEN_LIST, Token } from "../constants";

export type SwapState = "initial" | "calculating" | "loading" | "success";

type SwapFormState = {
  tokenIn?: Token;
  tokenOut?: Token;
  amountIn: string;
  amountOut: string;
  swapState: SwapState;
  setTokenIn: (fromCurrency: Token) => void;
  setTokenOut: (toCurrency: Token) => void;
  setAmountIn: (amount: string) => void;
  setAmountOut: (amount: string) => void;
  setSwapState: (swapState: SwapState) => void;
  swapTokens: () => void;
};

const useSwapFormState = create<SwapFormState>((set, get) => ({
  tokenIn: SUPPORTED_TOKEN_LIST[0],
  tokenOut: SUPPORTED_TOKEN_LIST[1],
  amountIn: "0",
  amountOut: "0",
  swapState: "initial",
  setTokenIn: (tokenIn: Token) => {
    if (tokenIn.symbol === get().tokenOut?.symbol) {
      set((state) => ({
        amountIn: state.amountOut,
        amountOut: state.amountIn,
        tokenIn: state.tokenOut,
        tokenOut: state.tokenIn,
      }));
    } else {
      set({ tokenIn });
    }
  },
  setTokenOut: (tokenOut: Token) => {
    if (tokenOut.symbol === get().tokenOut?.symbol) {
      set((state) => ({
        amountIn: state.amountOut,
        amountOut: state.amountIn,
        tokenIn: state.tokenOut,
        tokenOut: state.tokenIn,
      }));
    } else {
      set({ tokenOut });
    }
  },
  setAmountIn: (amountIn: string) => set({ amountIn }),
  setAmountOut: (amountOut: string) => set({ amountOut }),
  setSwapState: (swapState: SwapState) => set({ swapState }),
  swapTokens: () =>
    set((state) => ({
      tokenIn: state.tokenOut,
      tokenOut: state.tokenIn,
      amountIn: state.amountOut,
      amountOut: state.amountIn,
    })),
}));

export default useSwapFormState;
