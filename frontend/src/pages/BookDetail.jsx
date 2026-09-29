import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import ThumbUpRoundedIcon from "@mui/icons-material/ThumbUpRounded";
import ThumbUpOffAltRoundedIcon from "@mui/icons-material/ThumbUpOffAltRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import AutoStoriesRoundedIcon from "@mui/icons-material/AutoStoriesRounded";
import { getBook } from "../services/bookService";
import { checkLiked, getLikeCount, toggleLike } from "../services/likeService";
import { checkFavorited, getFavoriteCount, toggleFavorite } from "../services/favoriteService";
import { createComment, deleteComment, getComments } from "../services/commentService";

const languageLabels = { KO: "한국어", EN: "영어", JP: "일본어", CN: "중국어" };
const genreLabels = { FANTASY: "판타지", ROMANCE: "로맨스", THRILLER: "스릴러", SF: "SF" };

export default function BookDetail() {
    const { id } = useParams();
    const [book, setBook] = useState(null);
    const [liked, setLiked] = useState(false);
    const [favorited, setFavorited] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [favoriteCount, setFavoriteCount] = useState(0);
    const [comment, setComment] = useState("");
    const [comments, setComments] = useState([]);

    const loadComments = () => getComments(id).then(setComments);

    useEffect(() => {
        Promise.all([getBook(id), getComments(id), getLikeCount(id), getFavoriteCount(id), checkLiked(id), checkFavorited(id)])
            .then(([bookData, commentData, likes, favorites, isLiked, isFavorited]) => {
                setBook(bookData);
                setComments(commentData);
                setLikeCount(likes);
                setFavoriteCount(favorites);
                setLiked(isLiked);
                setFavorited(isFavorited);
            })
            .catch(() => alert("도서 정보를 불러오지 못했습니다."));
    }, [id]);

    const handleLike = async () => {
        try {
            const active = await toggleLike(id);
            setLiked(active);
            setLikeCount(await getLikeCount(id));
        } catch { alert("로그인이 필요한 기능입니다."); }
    };

    const handleFavorite = async () => {
        try {
            await toggleFavorite(id);
            setFavorited((value) => !value);
            setFavoriteCount(await getFavoriteCount(id));
        } catch { alert("로그인이 필요한 기능입니다."); }
    };

    const handleComment = async (event) => {
        event.preventDefault();
        if (!comment.trim()) return;
        try {
            await createComment(id, { content: comment.trim() });
            setComment("");
            await loadComments();
        } catch { alert("댓글을 작성하려면 로그인해주세요."); }
    };

    if (!book) return <div className="loading-state">도서 정보를 불러오는 중입니다.</div>;

    return (
        <section className="page-section detail-page">
            <div className="detail-layout">
                <div className="detail-cover">
                    {book.coverImageUrl ? <img src={book.coverImageUrl} alt={`${book.title} 표지`} /> : <div className="cover-empty"><AutoStoriesRoundedIcon /><span>표지 이미지 없음</span></div>}
                </div>
                <article className="detail-content">
                    <span className="eyebrow">{genreLabels[book.genre] || book.genre}</span>
                    <h1>{book.title}</h1>
                    <p className="detail-author">{book.author}</p>
                    <div className="meta-row"><span>{languageLabels[book.language] || book.language}</span><span>좋아요 {likeCount}</span><span>찜 {favoriteCount}</span></div>
                    <div className="book-description">{book.content || "등록된 내용이 없습니다."}</div>
                    <div className="reaction-row">
                        <button className={`reaction-button ${liked ? "active like" : ""}`} onClick={handleLike}>{liked ? <ThumbUpRoundedIcon /> : <ThumbUpOffAltRoundedIcon />}좋아요</button>
                        <button className={`reaction-button ${favorited ? "active favorite" : ""}`} onClick={handleFavorite}>{favorited ? <FavoriteRoundedIcon /> : <FavoriteBorderRoundedIcon />}찜하기</button>
                    </div>
                </article>
            </div>

            <section className="comments-section">
                <div className="section-heading"><div><span className="eyebrow">Comments</span><h2>댓글 {comments.length}</h2></div></div>
                <form className="comment-form" onSubmit={handleComment}><input value={comment} onChange={(e) => setComment(e.target.value)} placeholder="도서에 대한 생각을 남겨보세요." maxLength={500} /><button className="primary-btn" type="submit">작성</button></form>
                <div className="comment-list">
                    {comments.map((item) => <article className="comment-item" key={item.id}><div><strong>{item.writerName}</strong><p>{item.content}</p></div><button className="icon-button danger" title="댓글 삭제" aria-label="댓글 삭제" onClick={() => deleteComment(item.id).then(loadComments)}><DeleteOutlineRoundedIcon /></button></article>)}
                    {!comments.length && <p className="muted-text">아직 댓글이 없습니다.</p>}
                </div>
            </section>
        </section>
    );
}
