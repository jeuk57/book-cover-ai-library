package com.kt.library.service.impl;

import com.kt.library.domain.Book;
import com.kt.library.domain.Like;
import com.kt.library.domain.User;
import com.kt.library.exception.ResourceNotFoundException;
import com.kt.library.repository.BookRepository;
import com.kt.library.repository.LikeRepository;
import com.kt.library.repository.UserRepository;
import com.kt.library.service.LikeService;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class LikeServiceImpl implements LikeService {

    private final LikeRepository likeRepository;
    private final BookRepository bookRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public boolean toggleLike(Long bookId, Long userId) {

        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new ResourceNotFoundException("해당 도서를 찾을 수 없습니다."));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("해당 사용자를 찾을 수 없습니다."));

        Optional<Like> existing = likeRepository.findByBookIdAndUserId(bookId, userId);

        if (existing.isPresent()) {
            likeRepository.delete(existing.get());
            book.setLikeCount(Math.max(book.getLikeCount() - 1, 0));
            bookRepository.save(book);
            return false;
        }

        Like like = new Like(null, book, user);
        likeRepository.save(like);

        book.setLikeCount(book.getLikeCount() + 1);
        bookRepository.save(book);

        return true;
    }

    @Override
    public boolean isLiked(Long bookId, Long userId) {
        return likeRepository.existsByBookIdAndUserId(bookId, userId);
    }

    public int getLikeCount(Long bookId) {
        return likeRepository.countByBookId(bookId);
    }
}
