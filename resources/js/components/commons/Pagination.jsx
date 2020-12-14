import React, { Component } from "react";

const Pagination = props => {
    const { itemsCount, pageSize, onPageChange, currentPage } = props;
    const pagesCount = Math.ceil(itemsCount / pageSize);

    if (pagesCount === 1) return null;
    const pages = _.range(1, pagesCount + 1);

    return (
        <React.Fragment>
            <div className="row mt-3">
                <div className={pagesCount > 1 ? 'col-auto mr-auto mt-2' : 'd-none' }>
                <span className="badge badge-success" style={{ fontSize: 15 }}>
                    Prikazujem {pageSize} redova od ukupno {itemsCount} redova | Strana: {currentPage}
                </span>
                </div>
                <div className="col-auto">
                    <nav>
                        <ul className="pagination float-right mr-1">
                            {pages.map(page => (
                                <li
                                    className={
                                        currentPage == page
                                            ? "page-item active"
                                            : "page-item"
                                    }
                                    key={page}
                                >
                                    <a
                                        className="page-link"
                                        onClick={() => onPageChange(page)}
                                    >
                                        {page}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>
            </div>
        </React.Fragment>
    );
};

export default Pagination;
