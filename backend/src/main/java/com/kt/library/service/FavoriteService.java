package com.kt.library.service;

import com.kt.library.dto.response.BookResponse;
import java.util.List;

public interface FavoriteService {

    void toggleFavorite(Long userId, Long bookId);

    // 특정 책의 찜 개수 조회
    Long getFavoriteCount(Long bookId);

    // 로그인 사용자가 찜한 책 목록 조회
    List<BookResponse> getMyFavorites(Long userId);

    // 로그인 사용자가 이 책을 찜했는지 여부 확인
    boolean isFavorited(Long userId, Long bookId);
}
