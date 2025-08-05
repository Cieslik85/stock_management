import React from 'react';

// Pagination component
function Pagination({ page, setPage, totalPages }) {
    if (totalPages <= 1) return null;
    const maxButtons = 5;
    let start = Math.max(1, page - Math.floor(maxButtons / 2));
    let end = Math.min(totalPages, start + maxButtons - 1);
    if (end - start < maxButtons - 1) start = Math.max(1, end - maxButtons + 1);

    const pageNumbers = [];
    for (let i = start; i <= end; i++) pageNumbers.push(i);

    return (
        <div className="flex items-center gap-1">
            <button
                className="px-2 py-1 border rounded disabled:opacity-50"
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
            >Prev</button>
            {pageNumbers.map(num => (
                <button
                    key={num}
                    className={`px-2 py-1 border rounded ${num === page ? 'bg-blue-500 text-white' : ''}`}
                    onClick={() => setPage(num)}
                >{num}</button>
            ))}
            <button
                className="px-2 py-1 border rounded disabled:opacity-50"
                onClick={() => setPage(page + 1)}
                disabled={page === totalPages}
            >Next</button>
        </div>
    );
}
export default Pagination;