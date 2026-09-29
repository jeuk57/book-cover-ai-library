import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import LoginRoundedIcon from "@mui/icons-material/LoginRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import logo from "../assets/logo.png";
import { getBooks } from "../services/bookService";
import { logout, sessionCheck } from "../services/authService";

export default function Layout({ children }) {
    const [query, setQuery] = useState("");
    const [loggedIn, setLoggedIn] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        sessionCheck().then((user) => {
            setLoggedIn(Boolean(user));
            if (!user) localStorage.removeItem("loginUser");
        });
    }, []);

    const handleSearch = async (event) => {
        event.preventDefault();
        const keyword = query.trim().toLowerCase();
        if (!keyword) return;

        try {
            const books = await getBooks();
            const book = books.find(({ title, author }) =>
                title.toLowerCase().includes(keyword) || author?.toLowerCase().includes(keyword)
            );
            book ? navigate(`/books/${book.id}`) : alert("검색 결과가 없습니다.");
        } catch {
            alert("도서를 검색하지 못했습니다.");
        }
    };

    const handleLogout = async () => {
        await logout();
        setLoggedIn(false);
        navigate("/");
    };

    return (
        <div className="layout">
            <header className="nav-bar">
                <div className="nav-inner">
                    <Link to="/" className="brand-link" aria-label="Book Atelier 홈">
                        <img src={logo} alt="Book Atelier" className="brand-logo" />
                    </Link>

                    <nav className="nav-links" aria-label="주요 메뉴">
                        <NavLink to="/books" className="nav-link">도서 둘러보기</NavLink>
                        <NavLink to="/books/new" className="nav-link">도서 등록</NavLink>
                        <NavLink to="/mypage" className="nav-link">내 서재</NavLink>
                    </nav>

                    <div className="nav-actions">
                        <form className="search-bar" onSubmit={handleSearch}>
                            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="제목 또는 저자 검색" />
                            <button type="submit" className="icon-button" aria-label="검색" title="검색">
                                <SearchRoundedIcon />
                            </button>
                        </form>

                        {loggedIn ? (
                            <button onClick={handleLogout} className="account-button">
                                <LogoutRoundedIcon />
                                로그아웃
                            </button>
                        ) : (
                            <Link to="/login" className="account-button">
                                <LoginRoundedIcon />
                                로그인
                            </Link>
                        )}
                    </div>
                </div>
            </header>
            <main className="layout-body">{children}</main>
        </div>
    );
}
