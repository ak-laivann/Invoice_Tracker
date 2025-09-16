import React from "react";
import { Select, Button, Typography, Space } from "antd";
import { DownOutlined, LeftOutlined, RightOutlined } from "@ant-design/icons";
import { type PaginationProps } from "../props";
import styled from "styled-components";
const { Text } = Typography;

// I am manually maintaining the pagination numbers. TODO: Should refactor this somehow.
function getPaginationNumbers(totalPages: number, currentPage: number) {
  const pages: (number | "ellipsis")[] = [];

  if (totalPages <= 5) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);

    if (currentPage > 3) {
      pages.push("ellipsis");
    } else {
      pages.push(2);
    }

    // since i will have either ellipsis or 2, i am gonna start with 3 and current -1 -> which should probably give me 6 if current page is 7
    const startPage = Math.max(3, currentPage - 1);
    const endPage = Math.min(totalPages - 1, currentPage + 1);

    // i will display the next three numbers with this loop. if current is 6, i will show 5,6,7
    for (let i = startPage; i <= endPage; i++) {
      if (i !== 1 && i !== 2 && i !== totalPages) pages.push(i);
    }

    // if i came near the end, i dont need ellipsis
    if (currentPage < totalPages - 2) {
      pages.push("ellipsis");
    }

    // add the last element
    pages.push(totalPages);
  }

  return pages;
}

const StyledPagination = styled(Space)`
  display: flex;
  justify-content: end;
  padding: 1rem 0;
  align-items: center;

  @media (max-width: 700px) {
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    padding: 0.5rem 0;
  }
`;

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  total,
  onPageChange,
}) => {
  // use ceil for cases like this -> where the number might not be whole but would need to be rounded up so that user wont miss the excess data.
  const totalPages = Math.ceil(total / 10);

  const startItem = total === 0 ? 0 : (currentPage - 1) * 10 + 1;
  const endItem = Math.min(currentPage * 10, total);

  const pages = getPaginationNumbers(totalPages, currentPage);

  return (
    <StyledPagination size="middle">
      <Text>
        {startItem} - {endItem} of {total} Invoices
      </Text>

      <Space size="small" align="center">
        <Button
          icon={<LeftOutlined />}
          size="small"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        />

        {pages.map((page, idx) => {
          if (page === "ellipsis") {
            return (
              <Text key={`ellipsis-${idx}`} style={{ userSelect: "none" }}>
                ...
              </Text>
            );
          }
          const isActive = page === currentPage;
          return (
            <Button
              key={page}
              size="small"
              type={isActive ? "default" : "text"}
              style={{
                border: isActive ? "1px solid #1890ff" : undefined,
                fontWeight: isActive ? "bold" : undefined,
                padding: "0 8px",
              }}
              onClick={() => {
                if (!isActive) onPageChange(page as number);
              }}
            >
              {page}
            </Button>
          );
        })}

        <Button
          icon={<RightOutlined />}
          size="small"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        />
      </Space>

      <Select
        size="small"
        value={10}
        suffixIcon={<DownOutlined />}
        style={{ width: 120 }}
      />
    </StyledPagination>
  );
};
