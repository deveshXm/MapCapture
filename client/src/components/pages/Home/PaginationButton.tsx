import React from "react";
import Button from "../../ui/Button";

interface PaginationButtonProps {
  page: number;
  currentPage: number;
  onClick: () => void;
}

const PaginationButton = ({ currentPage, page, onClick }: PaginationButtonProps) => {
  return (
    <Button.Root key={page} onClick={onClick} variant={page === currentPage ? "soft" : "ghost"}>
      <Button.Label>{page}</Button.Label>
    </Button.Root>
  );
};

export default PaginationButton;
