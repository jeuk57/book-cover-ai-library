import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import AutoStoriesRoundedIcon from "@mui/icons-material/AutoStoriesRounded";
import { createBook, generateAiCover, getBook, saveAiCover, updateBook } from "../services/bookService";

const emptyForm = { title: "", author: "", language: "", genre: "", content: "" };

export default function BookCreate() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [form, setForm] = useState(emptyForm);
    const [useAiCover, setUseAiCover] = useState(false);
    const [apiKey, setApiKey] = useState("");
    const [coverImage, setCoverImage] = useState(null);
    const [generating, setGenerating] = useState(false);

    useEffect(() => {
        if (!id) return;
        getBook(id).then((book) => {
            setForm({ title: book.title || "", author: book.author || "", language: book.language || "", genre: book.genre || "", content: book.content || "" });
            setCoverImage(book.coverImageUrl || null);
            setUseAiCover(Boolean(book.coverImageUrl));
        }).catch(() => alert("도서 정보를 불러오지 못했습니다."));
    }, [id]);

    const update = (event) => setForm({ ...form, [event.target.name]: event.target.value });
    const isComplete = Object.values(form).every((value) => value.trim());

    const handleGenerate = async () => {
        if (!apiKey.trim()) return alert("Stability AI API 키를 입력해주세요.");
        if (!isComplete) return alert("도서 정보를 먼저 입력해주세요.");
        setGenerating(true);
        try {
            const prompt = `Book cover illustration for "${form.title}" by ${form.author}. Genre: ${form.genre}. ${form.content.slice(0, 300)}`;
            setCoverImage(await generateAiCover({ prompt, apiKey: apiKey.trim() }));
        } catch (error) {
            alert(error.response?.data?.message || "표지를 생성하지 못했습니다.");
        } finally {
            setGenerating(false);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!isComplete) return;
        try {
            const savedBook = id ? await updateBook(id, form) : await createBook(form);
            await saveAiCover(Number(id || savedBook.id), useAiCover ? coverImage : null);
            navigate(`/books/${id || savedBook.id}`);
        } catch (error) {
            alert(error.response?.data?.message || "도서를 저장하지 못했습니다.");
        }
    };

    return (
        <section className="page-section editor-page">
            <div className="section-heading"><div><span className="eyebrow">Book editor</span><h1>{id ? "도서 수정" : "새 도서 등록"}</h1><p>도서 정보를 입력하고 원하는 경우 AI 표지를 생성하세요.</p></div></div>
            <form className="editor-layout" onSubmit={handleSubmit}>
                <aside className="cover-editor">
                    <div className="cover-preview">{coverImage && useAiCover ? <img src={coverImage} alt="생성된 도서 표지" /> : <div className="cover-empty"><AutoStoriesRoundedIcon /><span>표지 미리보기</span></div>}</div>
                    <label className="toggle-row"><input type="checkbox" checked={useAiCover} onChange={(e) => setUseAiCover(e.target.checked)} /><span>AI 표지 사용</span></label>
                    {useAiCover && <div className="ai-controls"><label>Stability AI API 키<input type="password" value={apiKey} onChange={(e) => setApiKey(e.target.value)} placeholder="sk-..." /></label><button type="button" className="secondary-btn" onClick={handleGenerate} disabled={generating}><AutoAwesomeRoundedIcon />{generating ? "생성 중" : "표지 생성"}</button><small>API 키는 저장되지 않으며 표지 생성 요청에만 사용됩니다.</small></div>}
                </aside>
                <div className="editor-fields">
                    <label>제목<input name="title" value={form.title} onChange={update} placeholder="도서 제목" required /></label>
                    <label>저자<input name="author" value={form.author} onChange={update} placeholder="저자 이름" required /></label>
                    <div className="field-row"><label>언어<select name="language" value={form.language} onChange={update} required><option value="">선택</option><option value="KO">한국어</option><option value="EN">영어</option><option value="JP">일본어</option><option value="CN">중국어</option></select></label><label>장르<select name="genre" value={form.genre} onChange={update} required><option value="">선택</option><option value="FANTASY">판타지</option><option value="ROMANCE">로맨스</option><option value="THRILLER">스릴러</option><option value="SF">SF</option></select></label></div>
                    <label>내용<textarea name="content" value={form.content} onChange={update} rows="12" placeholder="도서의 줄거리나 내용을 입력하세요." required /></label>
                    <button className="primary-btn full" type="submit" disabled={!isComplete}><SaveRoundedIcon />{id ? "수정 내용 저장" : "도서 등록"}</button>
                </div>
            </form>
        </section>
    );
}
