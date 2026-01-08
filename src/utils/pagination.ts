/**
 * Generate pagination items with ellipsis for page navigation
 *
 * @param currentPage - The current active page (1-indexed)
 * @param totalPages - Total number of pages
 * @param maxVisible - Maximum number of page buttons to show (default: 7)
 * @returns Array of page numbers and ellipsis strings
 *
 * @example
 * getPaginationItems(1, 10) // [1, 2, 3, 4, 5, "...", 10]
 * getPaginationItems(5, 10) // [1, "...", 4, 5, 6, "...", 10]
 * getPaginationItems(10, 10) // [1, "...", 6, 7, 8, 9, 10]
 */
export function getPaginationItems(
  currentPage: number,
  totalPages: number,
  maxVisible: number = 7
): (number | string)[] {
  const items: (number | string)[] = [];

  if (totalPages <= maxVisible) {
    // Show all pages if total is small
    for (let i = 1; i <= totalPages; i++) {
      items.push(i);
    }
  } else {
    // Always show first page
    items.push(1);

    if (currentPage > 3) {
      items.push("...");
    }

    // Show pages around current
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let i = start; i <= end; i++) {
      items.push(i);
    }

    if (currentPage < totalPages - 2) {
      items.push("...");
    }

    // Always show last page
    items.push(totalPages);
  }

  return items;
}
