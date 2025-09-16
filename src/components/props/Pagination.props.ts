export interface PaginationProps {
  currentPage: number;
  total: number;
  onPageChange: (page: number) => void;
}
