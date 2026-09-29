import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { deleteBook, getMyBooks } from "../services/bookService";
import { getFavorites, toggleFavorite } from "../services/favoriteService";

function ShelfItem({ book, actions }) {
    return <article className="shelf-item">{book.coverImageUrl ? <img src={book.coverImageUrl} alt="" /> : <div className="shelf-cover">표지 없음</div>}<div className="shelf-info"><strong>{book.title}</strong><span>{book.author || "저자 미상"}</span></div><div className="shelf-actions">{actions}</div></article>;
}

export default function MyPage() {
    const [user] = useState(() => JSON.parse(localStorage.getItem("loginUser") || "null"));
    const [myBooks, setMyBooks] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const loadBooks = () => getMyBooks().then(setMyBooks);
    const loadFavorites = () => getFavorites().then(setFavorites);

    useEffect(() => {
        if (!user) return;
        Promise.all([
            getMyBooks().then(setMyBooks),
            getFavorites().then(setFavorites),
        ]).catch(() => {});
    }, [user]);

    if (!user) return <div className="empty-state"><strong>로그인이 필요합니다.</strong><Link className="primary-btn" to="/login">로그인</Link></div>;

    const removeBook = async (id) => {
        if (!window.confirm("이 도서를 삭제할까요?")) return;
        await deleteBook(id);
        await loadBooks();
    };

    const removeFavorite = async (id) => {
        await toggleFavorite(id);
        await loadFavorites();
    };

    return (
        <section className="page-section">
            <div className="section-heading"><div><span className="eyebrow">My library</span><h1>{user.name}님의 서재</h1><p>{user.email}</p></div><Link to="/books/new" className="primary-btn"><AddRoundedIcon />새 도서</Link></div>
            <div className="library-layout">
                <section className="library-section"><div className="subheading"><h2>내가 만든 도서</h2><span>{myBooks.length}권</span></div><div className="shelf-list">{myBooks.map((book) => <ShelfItem key={book.id} book={book} actions={<><Link className="icon-button" to={`/books/edit/${book.id}`} title="수정"><EditRoundedIcon /></Link><button className="icon-button danger" onClick={() => removeBook(book.id)} title="삭제"><DeleteOutlineRoundedIcon /></button></>} />)}{!myBooks.length && <p className="muted-text">아직 등록한 도서가 없습니다.</p>}</div></section>
                <section className="library-section"><div className="subheading"><h2>찜한 도서</h2><span>{favorites.length}권</span></div><div className="shelf-list">{favorites.map((book) => <ShelfItem key={book.id} book={book} actions={<button className="icon-button favorite" onClick={() => removeFavorite(book.id)} title="찜 해제"><FavoriteRoundedIcon /></button>} />)}{!favorites.length && <p className="muted-text">찜한 도서가 없습니다.</p>}</div></section>
            </div>
        </section>
    );
}
