import { Button } from "@movii/components/ui";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const PAGINATION_SET_MAX = 5;

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const paginationSet = Math.floor((currentPage - 1) / PAGINATION_SET_MAX);
  const paginationStart = paginationSet * PAGINATION_SET_MAX + 1;
  const paginationEnd = Math.min(
    paginationStart + (PAGINATION_SET_MAX - 1),
    totalPages
  );

  return (
    <div className="flex flex-col justify-center items-center gap-4">
      <div className="flex justify-center items-center gap-2">
        <Button
          onClick={() => onPageChange(1)}
          disabled={!totalPages || currentPage === 1}
        >
          First
        </Button>
        <Button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!totalPages || currentPage === 1}
        >
          Prev
        </Button>
        {Array.from({ length: paginationEnd - paginationStart + 1 }, (_, i) => {
          const pageNum = paginationStart + i;
          return (
            <Button
              key={pageNum}
              onClick={() => onPageChange(pageNum)}
              variant={pageNum === currentPage ? "default" : "outline"}
            >
              {pageNum}
            </Button>
          );
        })}
        <Button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!totalPages || currentPage === totalPages}
        >
          Next
        </Button>
        <Button
          onClick={() => onPageChange(totalPages)}
          disabled={!totalPages || currentPage === totalPages}
        >
          Last
        </Button>
      </div>
      <div className="flex flex-col gap-2 justify-center items-center">
        <p>{totalPages} pages</p>
      </div>
    </div>
  );
}
