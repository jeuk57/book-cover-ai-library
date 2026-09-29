package com.kt.library.service;

import com.kt.library.dto.request.BookCreateRequest;
import com.kt.library.dto.request.BookUpdateRequest;
import com.kt.library.dto.response.BookResponse;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface BookService {

    @Transactional
    BookResponse createBook(BookCreateRequest request, Long userId);

    BookResponse getBook(Long id);

    List<BookResponse> getAllBooks();

    @Transactional
    BookResponse updateBook(Long id, BookUpdateRequest request, Long userId);

    @Transactional
    void deleteBook(Long id, Long userId);

    List<BookResponse> getBooksByUserId(Long userId);

    String generateAiCover(String prompt, String apiKey);

    void updateCoverImage(Long bookId, String coverImageUrl, Long userId);
}
