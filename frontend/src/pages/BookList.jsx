import { useEffect, useMemo, useState } from "react";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import BookCard from "../components/BookCard";
import { getBooks } from "../services/bookService";

export default function BookList() {
    const [books, setBooks] = useState([]);
    const [query, setQuery] = useState("");

    useEffect(() => {
        getBooks().then(setBooks).catch(() => setBooks([]));
    }, []);

    const filteredBooks = useMemo(() => {
        const keyword = query.trim().toLowerCase();
        return books.filter(({ title, author }) =>
            !keyword || title.toLowerCase().includes(keyword) || author?.toLowerCase().includes(keyword)
        );
    }, [books, query]);

    return (
        <section className="page-section">
            <div className="section-heading list-heading">
                <div><span className="eyebrow">Library</span><h1>도서 둘러보기</h1></div>
                <label className="page-search"><SearchRoundedIcon /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="제목 또는 저자 검색" /></label>
            </div>
            <div className="book-grid">
                {filteredBooks.map((book) => <BookCard key={book.id} {...book} />)}
            </div>
            {!filteredBooks.length && <div className="empty-state"><strong>검색 결과가 없습니다.</strong><span>다른 검색어를 입력해보세요.</span></div>}
        </section>
    );
}
