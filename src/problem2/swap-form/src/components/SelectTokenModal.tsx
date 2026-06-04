import { Modal, ModalBody, ModalContent, ModalHeader } from "@nextui-org/react";
import { useMemo } from "react";
import { SUPPORTED_TOKEN_LIST, Token } from "../constants";
import useTokenBalances from "../hooks/useTokenBalances";
import useTokenPrices from "../hooks/useTokenPrices";
import { formatBalance, formatPrice } from "../utils";

export default function SelectTokenModal({
  isOpen,
  onClose,
  onSelect,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSelect?: (token: Token) => void;
}) {
  const { balances } = useTokenBalances();
  const { data: tokenPrices } = useTokenPrices();

  const sortedTokens = useMemo(() => {
    const valueOf = (token: Token) => {
      const balance = balances[token.symbol] || 0;
      const price = tokenPrices?.find((p) => p.currency === token.symbol)?.price || 0;
      return { balance, value: balance * price };
    };
    return [...SUPPORTED_TOKEN_LIST].sort((a, b) => {
      const aInfo = valueOf(a);
      const bInfo = valueOf(b);
      // Tokens with a balance come first, then sort by value (desc).
      if ((aInfo.balance > 0) !== (bInfo.balance > 0)) return aInfo.balance > 0 ? -1 : 1;
      return bInfo.value - aInfo.value;
    });
  }, [balances, tokenPrices]);

  return (
    <Modal
      isOpen={isOpen}
      classNames={{
        body: "",
        header: "",
        wrapper: "!border-none shadow-none",
        base: " bg-gradient-to-br from-neutral-950 to-neutral-900 !border-none shadow-xl !border-transparent",
      }}
      onClose={onClose}
    >
      <ModalContent>
        <ModalHeader className=" px-5 pt-4">Select a Token</ModalHeader>
        <ModalBody className="pt-0 pb-5 px-5">
          <div className="text-sm font-semibold text-neutral-500">Tokens</div>
          <div className="flex flex-col -mx-5 gap-1">
            {sortedTokens.map((token: Token) => {
              const tokenBalance = balances[token.symbol];
              const tokenPrice = tokenPrices?.find((price) => price.currency === token.symbol)?.price;
              const tokenValue = tokenBalance && tokenPrice ? tokenBalance * tokenPrice : 0;
              return (
                <div
                  key={token.symbol}
                  className="flex items-center justify-between gap-3 py-2.5 hover:bg-neutral-800/50 cursor-pointer px-5"
                  onClick={() => {
                    onClose();
                    onSelect?.(SUPPORTED_TOKEN_LIST.find((t) => t.symbol === token.symbol) || SUPPORTED_TOKEN_LIST[0]);
                  }}
                >
                  <div className="flex items-center gap-2">
                    <img src={token.iconUrl} className="rounded-full w-8 h-8"></img>
                    <div className="flex flex-col">
                      <div>{token.symbol}</div>
                      <div className="text-xs text-neutral-500">{token.name}</div>
                    </div>
                  </div>
                  <div className="flex flex-col  items-end gap-1 h-full justify-between">
                    <div className="text-sm">{formatBalance(tokenBalance)}</div>
                    <div className="text-xs text-neutral-500">{tokenValue ? "$" + formatPrice(tokenValue) : ""}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
