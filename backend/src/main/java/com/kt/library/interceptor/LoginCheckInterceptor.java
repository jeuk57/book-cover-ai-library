package com.kt.library.interceptor;

import com.kt.library.exception.UnAuthorizedException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.web.servlet.HandlerInterceptor;

public class LoginCheckInterceptor implements HandlerInterceptor {

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        if (request.getMethod().equals("OPTIONS")) {
            return true;
        }

        String requestURI = request.getRequestURI().substring(request.getContextPath().length());
        String method = request.getMethod();

        if (method.equals("GET") && (
                        requestURI.startsWith("/books") ||
                        requestURI.startsWith("/comments") ||
                        requestURI.startsWith("/favorites") ||
                        requestURI.startsWith("/likes")
        )) {
            return true;
        }

        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("loginUser") == null) {
            throw new UnAuthorizedException("로그인이 필요한 서비스입니다.");
        }
        return true;
    }
}
