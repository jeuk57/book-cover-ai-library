import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PersonAddAltRoundedIcon from "@mui/icons-material/PersonAddAltRounded";
import { signup } from "../services/authService";

export default function Signup() {
    const [form, setForm] = useState({ name: "", loginId: "", email: "", password: "", confirmPassword: "" });
    const navigate = useNavigate();
    const update = (event) => setForm({ ...form, [event.target.name]: event.target.value });

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (form.password !== form.confirmPassword) return alert("비밀번호가 일치하지 않습니다.");
        try {
            const request = {
                name: form.name,
                loginId: form.loginId,
                email: form.email,
                password: form.password,
            };
            await signup(request);
            navigate("/login");
        } catch (error) {
            alert(error.response?.data?.message || "회원가입에 실패했습니다.");
        }
    };

    return (
        <div className="auth-page">
            <section className="auth-panel wide">
                <span className="eyebrow">Create account</span>
                <h1>나만의 서재를 시작하세요.</h1>
                <p>도서를 만들고 다른 사용자의 작품을 저장할 수 있습니다.</p>
                <form className="form-stack two-columns" onSubmit={handleSubmit}>
                    <label>이름<input name="name" value={form.name} onChange={update} required /></label>
                    <label>아이디<input name="loginId" value={form.loginId} onChange={update} required /></label>
                    <label className="span-two">이메일<input type="email" name="email" value={form.email} onChange={update} required /></label>
                    <label>비밀번호<input type="password" name="password" value={form.password} onChange={update} required /></label>
                    <label>비밀번호 확인<input type="password" name="confirmPassword" value={form.confirmPassword} onChange={update} required /></label>
                    <button className="primary-btn full span-two" type="submit"><PersonAddAltRoundedIcon />회원가입</button>
                </form>
                <p className="auth-switch">이미 회원이신가요? <Link to="/login">로그인</Link></p>
            </section>
        </div>
    );
}
