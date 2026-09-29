package com.kt.library.service;

public interface LikeService {
    boolean toggleLike(Long bookId, Long userId);

    int getLikeCount(Long bookId);

    boolean isLiked(Long bookId, Long userId);
}


