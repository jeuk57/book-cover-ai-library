import { Link } from "react-router-dom";
import AutoStoriesRoundedIcon from "@mui/icons-material/AutoStoriesRounded";

export default function BookCard({ id, title, author, coverImageUrl, rank }) {
    const content = (
        <article className="book-card">
            {rank && <span className="book-rank">{rank}</span>}
            <div className="book-cover-wrap">
                {coverImageUrl ? (
                    <img src={coverImageUrl} alt={`${title} 표지`} className="book-cover" loading="lazy" />
                ) : (
                    <div className="book-cover placeholder">
                        <AutoStoriesRoundedIcon />
                        <span>표지 준비 중</span>
                    </div>
                )}
            </div>
            <div className="book-meta">
                <h3 className="book-title">{title}</h3>
                <p className="book-author">{author || "저자 미상"}</p>
            </div>
        </article>
    );

    return id ? <Link to={`/books/${id}`} className="book-card-link">{content}</Link> : content;
}
