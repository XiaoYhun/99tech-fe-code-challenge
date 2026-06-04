// @ts-nocheck
// Original code block as provided by the challenge (kept verbatim for reference).
// The analysis of its issues is in README.md; the fixed version is refactored.tsx.

interface WalletBalance {
  currency: string;
  amount: number;
  blockchain: Blockchain;
}
interface FormattedWalletBalance extends WalletBalance {
  formatted: string;
}

interface Props extends BoxProps { }

enum Blockchain {
  Osmosis = "Osmosis",
  Ethereum = "Ethereum",
  Arbitrum = "Arbitrum",
  Zilliqa = "Zilliqa",
  Neo = "Neo",
}

const getPriority = (blockchain: Blockchain): number => {
  switch (blockchain) {
    case Blockchain.Osmosis:
      return 100;
    case Blockchain.Ethereum:
      return 50;
    case Blockchain.Arbitrum:
      return 30;
    case Blockchain.Zilliqa:
      return 20;
    case Blockchain.Neo:
      return 10;
    default:
      return -99;
  }
};

const WalletPage: React.FC<Props> = (props: Props) => {
  const { children, ...rest } = props;
  const balances = useWalletBalances();
  const prices = usePrices();

  const sortedBalances = useMemo(() => {
    if (!balances) return [];
    return balances
      .filter((balance: WalletBalance) => {
        const balancePriority = getPriority(balance.blockchain);
        if (balancePriority > -99 && balance.amount <= 0) {
          return true;
        }
        return false;
      })
      .sort((lhs: WalletBalance, rhs: WalletBalance) => {
        const leftPriority = getPriority(lhs.blockchain);
        const rightPriority = getPriority(rhs.blockchain);
        if (leftPriority > rightPriority) {
          return -1;
        } else if (rightPriority > leftPriority) {
          return 1;
        }
        return 0;
      });
  }, [balances]);

  const formattedBalances = useMemo(() => sortedBalances.map((balance: WalletBalance) => {
    return {
      ...balance,
      formatted: balance.amount.toFixed(2),
    };
  }), [sortedBalances]);

  const rows = formattedBalances.map((balance: FormattedWalletBalance) => {
    const usdValue = (prices?.[balance.currency] ?? 0) * balance.amount;
    return (
      <WalletRow
        className={classes.row}
        key={balance.currency}
        amount={balance.amount}
        usdValue={usdValue}
        formattedAmount={balance.formatted}
      />
    );
  });

  return <div {...rest}>{rows}</div>;
};
