package com.kt.library.controller;

import com.kt.library.dto.response.BookResponse;
import com.kt.library.dto.response.UserResponse;
import com.kt.library.exception.UnAuthorizedException;
import com.kt.library.service.FavoriteService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/favorites")
public class FavoriteController {

    private final FavoriteService favoriteService;

    @PostMapping("/{bookId}")
    public void toggleFavorite(
            @PathVariable Long bookId,
            @SessionAttribute(name = "loginUser", required = false) UserResponse loginUser
    ) {
        if (loginUser == null) {
            throw new UnAuthorizedException("로그인이 필요합니다.");
        }
        favoriteService.toggleFavorite(loginUser.getId(), bookId);
    }

    @GetMapping("/{bookId}/count")
    public Long getFavoriteCount(@PathVariable Long bookId) {
        return favoriteService.getFavoriteCount(bookId);
    }

    @GetMapping
    public List<BookResponse> getMyFavorites(
            @SessionAttribute(name = "loginUser", required = false) UserResponse loginUser
    ) {
        if (loginUser == null) {
            throw new UnAuthorizedException("로그인이 필요합니다.");
        }
        return favoriteService.getMyFavorites(loginUser.getId());
    }

    @GetMapping("/{bookId}/check")
    public boolean checkFavorited(
            @PathVariable Long bookId,
            @SessionAttribute(name = "loginUser", required = false) UserResponse loginUser
    ) {
        if (loginUser == null) {
            return false;
        }
        return favoriteService.isFavorited(loginUser.getId(), bookId);
    }
}
