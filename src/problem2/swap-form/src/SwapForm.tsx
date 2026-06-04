import { Button } from "@nextui-org/react";
import { ArrowDownUp } from "lucide-react";
import CurrencyInput from "./CurrencyInput";
import useSwapFormState from "./hooks/useSwapFormState";
import { useEffect, useMemo, useState } from "react";
import useTokenBalances from "./hooks/useTokenBalances";
import ConfirmSwapModal from "./components/ConfirmSwapModal";
import useSwapActions from "./hooks/useSwapActions";
import { useDebounce } from "use-debounce";

export default function SwapForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [arrowSpin, setArrowSpin] = useState(0);
  const [spinClockwise, setSpinClockwise] = useState(true);

  const { swapTokens, tokenIn, tokenOut, amountIn, amountOut, setAmountIn, setAmountOut, setTokenIn, setTokenOut, swapState } =
    useSwapFormState();
  const { calculateAmountOut } = useSwapActions();
  const isSwapping = swapState === "loading";
  const isCalculating = swapState === "calculating";
  const { balances } = useTokenBalances();
  const tokenInBalance = useMemo(() => (tokenIn?.symbol ? balances[tokenIn?.symbol] || 0 : 0), [balances, tokenIn]);
  const debouncedAmountIn = useDebounce(amountIn, 500)[0];

  const isLoading = swapState === "loading";

  const handleSwapClick = () => {
    if (!tokenIn || !tokenOut || !!errors || !amountIn || !amountOut) return;
    setIsOpen(true);
  };

  useEffect(() => {
    if (!tokenIn || !tokenOut || !debouncedAmountIn || debouncedAmountIn === "0" || isLoading) return;
    calculateAmountOut(tokenIn, tokenOut, debouncedAmountIn).then(setAmountOut);
  }, [debouncedAmountIn, tokenIn, tokenOut, calculateAmountOut, setAmountOut, isLoading]);

  let errors = "";
  if (!tokenIn) {
    errors = "Please select token to swap from";
  } else if (!tokenOut) {
    errors = "Please select token to swap to";
  } else if (!amountIn || amountIn === "0") {
    errors = "Please enter amount to swap";
  } else if (parseFloat(amountIn) > tokenInBalance) {
    errors = `Insufficient ${tokenIn.symbol} balance`;
  }

  return (
    <div className="flex flex-col gap-1 w-[400px] bg-black p-2 rounded-t-[26px] rounded-b-[20px] shadow-[0_35px_90px_-15px_rgba(0,0,0,0.9)]">
      <CurrencyInput
        title="From"
        token={tokenIn}
        value={amountIn}
        onValueChange={setAmountIn}
        onTokenChange={setTokenIn}
      />
      <div className="relative">
        <Button
          onPress={() => {
            setArrowSpin((prev) => prev + (spinClockwise ? 180 : -180));
            setSpinClockwise((prev) => !prev);
            swapTokens();
          }}
          className="bg-neutral-900 text-white min-w-0 w-[40px] rounded-full border-neutral-700 border-2 p-1.5 absolute left-1/2 -translate-x-1/2 -top-5 cursor-pointer hover:bg-neutral-800 hover:border-neutral-400 z-10"
        >
          <ArrowDownUp
            size={20}
            className="transition-transform duration-300 ease-in-out"
            style={{ transform: `rotate(${arrowSpin}deg)` }}
          />
        </Button>
        <CurrencyInput
          title="To"
          token={tokenOut}
          value={amountOut}
          onValueChange={setAmountOut}
          onTokenChange={setTokenOut}
          isLoading={isCalculating}
          isDisabled={true}
        />
      </div>

      <Button
        color="primary"
        className="font-bold mt-1"
        isDisabled={!!errors || isSwapping}
        onPress={handleSwapClick}
      >
        {isSwapping ? "Swapping..." : errors || "Swap"}
      </Button>
      <ConfirmSwapModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  );
}
