import React from "react";

const ProductCard = ({ image, title }) => {
    return (
        <div className="product-card">
            <img src={image} alt={title} className="product-img" />
            <span>{title}</span>
        </div>
    )
}

export default function Pagination() {
    let options = [10, 50, 100];
    const [products, setProducts] = React.useState([]);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [pageNumber, setPageNumber] = React.useState(1);
    const [totalPages, setTotalPages] = React.useState(0);
    const [fromPage, setFromPage] = React.useState(0);
    const [toPage, setToPage] = React.useState(10);

    React.useEffect(() => {
        if (products.length > 0) {
            setTotalPages(Math.ceil(products.length / rowsPerPage));
            setFromPage((pageNumber - 1) * rowsPerPage);
            if (pageNumber === totalPages)
                setToPage(Math.min(pageNumber * rowsPerPage, products.length));  //in slice() the from index is inclusive
            else
                setToPage(pageNumber * rowsPerPage);  //in slice() the from index is exclusive

        }
    }, [rowsPerPage, products, pageNumber])
    React.useEffect(() => {
        fetchData();
    }, []);
    const fetchData = async () => {
        try {
            const data = await fetch("https://dummyjson.com/products?limit=500");
            const json = await data.json();
            setProducts(json.products);
        } catch (error) {
            console.error("Failed to fetch data:", error);
        }
    };

    return products.length === 0 ? <h1>No products</h1> : (
        <>
            <div>
                <select name="rowsCount" id="rowsCount"
                    onChange={(event) => {
                        setRowsPerPage(event.target.value);
                        setPageNumber(1);
                    }}>
                    {options.map((rowsCount, index) => (
                        <option key={index} value={rowsCount}>{rowsCount}</option>
                    ))}
                </select>
                <a className="previous-round" style={{ cursor: "pointer" }} onClick={() => {
                    if (pageNumber > 1) {
                        setPageNumber(pageNumber - 1);
                    }
                }}>&#8249;</a>
                {[...Array(totalPages).keys()].map((n) => (
                    <button
                        className={pageNumber === (n + 1) ? "selected" : "not-selected"}
                        onClick={() => setPageNumber(n + 1)}
                    >{n + 1}</button>
                ))}
                <a className="next-round" style={{ cursor: "pointer" }} onClick={() => {
                    if (pageNumber < totalPages) {
                        setPageNumber(pageNumber + 1);
                    }
                }}>&#8250;</a>
            </div>
            <div className="products-container">
                {products.slice(fromPage, toPage).map((data) => (
                    <ProductCard key={data.id} image={data.thumbnail} title={data.title} />
                ))}
            </div>
        </>
    )
}