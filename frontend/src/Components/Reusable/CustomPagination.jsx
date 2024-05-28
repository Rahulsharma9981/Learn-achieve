function getPageLinkForIndex(index, offset, setOffset) {
    return <h2 key={index} className={`fs-16 fw-600 d-flex align-items-center justify-content-center cursor-pointer p-0 mb-0 ${offset == index ? 'page-link-selected' : 'page-link-default'}`} onClick={() => {
        setOffset(index);
    }}>{index + 1}</h2>;
}

const generatePaginationFooter = (availableDataCount, limit, offset, setOffset) => {
    var totalCount = Math.ceil(availableDataCount / limit);
    if (totalCount > 1) {
        return <div className="d-flex justify-content-between align-items-center gap-3 mt-3">
            <p className="text_dark fs-16 fw-600 mb-0">
                {availableDataCount > 0
                    ? `Showing ${Math.min(offset * limit + 1, availableDataCount)} to ${Math.min((offset + 1) * limit, availableDataCount)} of ${availableDataCount} entries`
                    : "Showing No Entries"}</p>
            <div className="d-flex align-items-center justify-content-center" style={{ gap: "12px" }}>
                <a className="fs-16 fw-500 secondary cursor-pointer" style={{opacity: (offset == 0) ? 0.2 : 1}} onClick={
                    () => {
                        if (offset > 0) {
                            setOffset(offset - 1);
                        }
                    }
                }>Prev</a>
                {generatePaginationLinks(availableDataCount, limit, offset, setOffset)}
                <a className="fs-16 fw-500 secondary cursor-pointer" style={{opacity: (offset == totalCount - 1) ? 0.2 : 1}} onClick={
                    () => {
                        if (offset < Math.ceil(availableDataCount / limit) - 1) {
                            setOffset(offset + 1);
                        }
                    }
                }>Next</a>
            </div>
        </div>
    } else {
        return <div className="d-flex justify-content-between align-items-center gap-3 mt-3">
            <p className="text_dark fs-16 fw-600 mb-0">
                {availableDataCount > 0
                    ? `Showing ${Math.min(offset * limit + 1, availableDataCount)} to ${Math.min((offset + 1) * limit, availableDataCount)} of ${availableDataCount} entries`
                    : "Showing No Entries"}</p>
        </div>
    }
}

const generatePaginationLinks = (availableDataCount, limit, offset, setOffset) => {
    var totalCount = Math.ceil(availableDataCount / limit);

    if (totalCount <= 7) {
        // Display all pages
        return Array.from({ length: totalCount }, (_, index) => getPageLinkForIndex(index, offset, setOffset));
    } else {
        // Display a combination of active, previous, next, and last pages
        const pageLinks = [];

        // Always include the first page
        pageLinks.push(getPageLinkForIndex(0, offset, setOffset));

        if (offset > 2) {
            // pageLinks.push(<a className="fs-24 page-link-default d-flex justify-content-center" style={{ color: "black", height: 36, aspectRatio: 1 }}>...</a>);
            pageLinks.push(<a className="fs-24" style={{ color: "black", margin: "-4px -4px 0px -4px" }}>...</a>);
        }

        if (offset > 0 && offset - 1 != 0) {
            pageLinks.push(getPageLinkForIndex(offset - 1, offset, setOffset));
        }

        // Include the active page
        if (offset != 0 && offset != totalCount - 1) {
            pageLinks.push(getPageLinkForIndex(offset, offset, setOffset));
        }

        // Include the next page if offset < totalCount - 1
        if (offset < totalCount - 1 && offset + 1 != totalCount - 1) {
            pageLinks.push(getPageLinkForIndex(offset + 1, offset, setOffset));
        }

        if (offset == 0) {
            pageLinks.push(getPageLinkForIndex(2, offset, setOffset));
        }

        if (offset < totalCount - 3) {
            pageLinks.push(<a className="fs-24" style={{ color: "black", margin: "-4px -4px 0px -4px" }}>...</a>);
        }

        // Always include the last page
        pageLinks.push(getPageLinkForIndex(totalCount - 1, offset, setOffset));

        return pageLinks;
    }
}

export default generatePaginationFooter;