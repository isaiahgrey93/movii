interface ResultsSummaryProps {
  page: number;
  pages: number;
  limit: number;
  amount: number;
}

export function ResultsSummary({
  page,
  limit,
  pages,
  amount,
}: ResultsSummaryProps) {
  if (pages === 0) return <p>No results</p>;

  const totalResults = pages * limit;
  const start = (page - 1) * limit + 1;
  const end = Math.min(
    (page - 1) * limit + Math.min(limit, amount),
    totalResults
  );

  return (
    <p>
      Showing {start} - {end} of ~{totalResults} Results
    </p>
  );
}
