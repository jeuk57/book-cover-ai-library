package com.kt.library.repository;

import com.kt.library.domain.Like;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface LikeRepository extends JpaRepository<Like, Long> {

    Optional<Like> findByBookIdAndUserId(Long bookId, Long userId);

    int countByBookId(Long bookId);

    boolean existsByBookIdAndUserId(Long bookId, Long userId);
}
