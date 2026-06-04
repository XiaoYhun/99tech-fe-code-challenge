import { useCallback } from "react";
import { toast } from "react-toastify";
import { sleep, formatBalance } from "../utils";
import { Token } from "../constants";
import useTokenPrices from "./useTokenPrices";
import useSwapFormState from "./useSwapFormState";
import useTokenBalances from "./useTokenBalances";

export default function useSwapActions() {
  const { updateTokenBalanceAfterSwapped } = useTokenBalances();
  const { data: tokenPrices } = useTokenPrices();
  const { setSwapState, tokenIn, tokenOut, amountIn, amountOut } =
    useSwapFormState();

  const calculateAmountOut = useCallback(
    async (tokenIn: Token, tokenOut: Token, amountIn: string) => {
      setSwapState("calculating");
      await sleep(1000);
      const tokenInPrice = tokenPrices?.find(
        (price) => price.currency === tokenIn.symbol,
      )?.price;
      const tokenOutPrice = tokenPrices?.find(
        (price) => price.currency === tokenOut.symbol,
      )?.price;
      setSwapState("initial");
      if (!tokenInPrice || !tokenOutPrice) {
        return "0";
      }
      return ((parseFloat(amountIn) * tokenInPrice) / tokenOutPrice).toFixed(
        18,
      );
    },
    [tokenPrices, setSwapState],
  );

  const executeSwap = useCallback(async () => {
    if (!tokenIn || !tokenOut || !amountIn || !amountOut) return;
    setSwapState("loading");
    await sleep(3000);
    updateTokenBalanceAfterSwapped(tokenIn, tokenOut, amountIn, amountOut);
    setSwapState("success");
    toast.success(
      `Swapped ${formatBalance(parseFloat(amountIn))} ${tokenIn.symbol} for ${formatBalance(
        parseFloat(amountOut)
      )} ${tokenOut.symbol}`
    );
  }, [
    tokenIn,
    tokenOut,
    amountIn,
    amountOut,
    setSwapState,
    updateTokenBalanceAfterSwapped,
  ]);

  return {
    calculateAmountOut,
    executeSwap,
  };
}
