type Props = {
  isFirstPage: boolean;
  isLastPage: boolean;
  currentPage: number;
  isDisabled?: boolean;
  onPageChange: (newPage: number) => void;
};

export function Pagination({
  isFirstPage,
  isLastPage,
  currentPage,
  onPageChange,
  isDisabled = false,
}: Props) {
  return (
    <nav
      aria-label='Pagination'
      style={{
        display: 'flex',
        gap: '1rem',
      }}>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={isFirstPage}
        aria-label='Go to previous page'>
        Previous
      </button>
      <span aria-current='page'>Page {currentPage}</span>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={isLastPage || isDisabled}
        aria-label='Go to next page'>
        Next
      </button>
    </nav>
  );
}
