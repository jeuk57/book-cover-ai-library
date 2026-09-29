import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import LoginRoundedIcon from "@mui/icons-material/LoginRounded";
import { login } from "../services/authService";

export default function Login() {
    const [form, setForm] = useState({ loginId: "", password: "" });
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await login(form);
            navigate("/mypage");
            window.location.reload();
        } catch (error) {
            alert(error.response?.data?.message || "로그인에 실패했습니다.");
        }
    };

    return (
        <div className="auth-page">
            <section className="auth-panel">
                <span className="eyebrow">Welcome back</span>
                <h1>다시 만나서 반가워요.</h1>
                <p>내 서재와 저장한 도서를 계속 관리해보세요.</p>
                <form className="form-stack" onSubmit={handleSubmit}>
                    <label>아이디<input name="loginId" value={form.loginId} onChange={(e) => setForm({ ...form, loginId: e.target.value })} required /></label>
                    <label>비밀번호<input type="password" name="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required /></label>
                    <button className="primary-btn full" type="submit"><LoginRoundedIcon />로그인</button>
                </form>
                <p className="auth-switch">아직 회원이 아니신가요? <Link to="/signup">회원가입</Link></p>
            </section>
        </div>
    );
}
