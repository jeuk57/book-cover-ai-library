package com.kt.library.service.impl;

import com.kt.library.domain.Book;
import com.kt.library.domain.Comment;
import com.kt.library.domain.User;
import com.kt.library.dto.request.CommentCreateRequest;
import com.kt.library.dto.request.CommentUpdateRequest;
import com.kt.library.dto.response.CommentResponse;
import com.kt.library.exception.UnAuthorizedException;
import com.kt.library.repository.BookRepository;
import com.kt.library.repository.CommentRepository;
import com.kt.library.repository.UserRepository;
import com.kt.library.service.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class CommentServiceImpl implements CommentService {

    private final CommentRepository commentRepository;
    private final UserRepository userRepository;
    private final BookRepository bookRepository;

    @Override
    public CommentResponse createComment(Long userId, Long bookId, CommentCreateRequest request) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new IllegalArgumentException("Book not found"));

        Comment comment = Comment.builder()
                .user(user)
                .book(book)
                .content(request.getContent())
                .build();

        commentRepository.save(comment);

        return toResponse(comment);
    }

    @Override
    public List<CommentResponse> getCommentsByBook(Long bookId) {
        return commentRepository.findByBookId(bookId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public CommentResponse updateComment(Long commentId, Long userId, CommentUpdateRequest request) {

        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 댓글입니다."));

        if (!comment.getUser().getId().equals(userId)) {
            throw new UnAuthorizedException("본인의 댓글만 수정할 수 있습니다.");
        }

        comment.setContent(request.getContent());

        return toResponse(comment);
    }

    @Override
    @Transactional
    public void deleteComment(Long commentId, Long userId) {

        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 댓글입니다."));

        if (!comment.getUser().getId().equals(userId)) {
            throw new UnAuthorizedException("본인의 댓글만 삭제할 수 있습니다.");
        }

        commentRepository.delete(comment);
    }

    private CommentResponse toResponse(Comment comment) {
        return new CommentResponse(comment);
    }
}
