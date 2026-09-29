import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import AutoStoriesRoundedIcon from "@mui/icons-material/AutoStoriesRounded";
import BookCard from "./BookCard";
import { getBooks } from "../services/bookService";

export default function TopBooks() {
    const [sort, setSort] = useState("popular");
    const [books, setBooks] = useState([]);
    const trackRef = useRef(null);

    useEffect(() => {
        getBooks().then(setBooks).catch(() => setBooks([]));
    }, []);

    const sortedBooks = useMemo(() => [...books]
        .sort((a, b) => sort === "popular"
            ? (b.likeCount || 0) - (a.likeCount || 0)
            : (b.id || 0) - (a.id || 0))
        .slice(0, 10), [books, sort]);

    const scroll = (left) => trackRef.current?.scrollBy({ left, behavior: "smooth" });

    return (
        <section className="top-books">
            <div className="home-heading">
                <div>
                    <span className="eyebrow">Book Atelier Collection</span>
                    <h1>이야기를 고르고,<br />새로운 표지를 만드세요.</h1>
                    <p>직접 만든 도서를 공유하고 마음에 드는 작품을 내 서재에 담아보세요.</p>
                </div>
                <Link to="/books/new" className="primary-btn"><AddRoundedIcon />도서 등록</Link>
            </div>

            <div className="section-heading">
                <div>
                    <span className="eyebrow">Curated books</span>
                    <h2>지금 주목받는 도서</h2>
                </div>
                <div className="section-actions">
                    <div className="segmented-control">
                        <button className={sort === "popular" ? "active" : ""} onClick={() => setSort("popular")}>인기순</button>
                        <button className={sort === "latest" ? "active" : ""} onClick={() => setSort("latest")}>최신순</button>
                    </div>
                    <Link to="/books" className="text-link">전체 보기</Link>
                </div>
            </div>

            {sortedBooks.length ? (
                <div className="carousel">
                    <button className="carousel-button" onClick={() => scroll(-560)} aria-label="이전 도서"><ArrowBackRoundedIcon /></button>
                    <div className="card-track" ref={trackRef}>
                        {sortedBooks.map((book, index) => <BookCard key={book.id} {...book} rank={index + 1} />)}
                    </div>
                    <button className="carousel-button" onClick={() => scroll(560)} aria-label="다음 도서"><ArrowForwardRoundedIcon /></button>
                </div>
            ) : (
                <div className="empty-state"><AutoStoriesRoundedIcon /><strong>아직 등록된 도서가 없습니다.</strong><span>첫 번째 이야기를 등록해보세요.</span></div>
            )}
        </section>
    );
}
