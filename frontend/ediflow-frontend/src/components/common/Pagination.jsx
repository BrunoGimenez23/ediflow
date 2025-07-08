import React from "react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const handlePrevious = () => {
    if (currentPage > 0) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages - 1) onPageChange(currentPage + 1);
  };

  const renderPageNumbers = () => {
    const pages = [];

    for (let i = 0; i < totalPages; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className={`px-3 py-1 rounded-md mx-1 ${
            i === currentPage
              ? "bg-ediblue text-white font-semibold"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          {i + 1}
        </button>
      );
    }

    return pages;
  };

  return (
    <div className="flex justify-center mt-6 items-center flex-wrap gap-2">
      <button
        onClick={handlePrevious}
        disabled={currentPage === 0}
        className="px-4 py-1 rounded-md bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
      >
        Anterior
      </button>

      {renderPageNumbers()}

      <button
        onClick={handleNext}
        disabled={currentPage === totalPages - 1}
        className="px-4 py-1 rounded-md bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
      >
        Siguiente
      </button>
    </div>
  );
};

export default Pagination;
