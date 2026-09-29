package com.kt.library.controller;

import com.kt.library.dto.request.BookAiImageRequest;
import com.kt.library.dto.request.BookCoverUrlRequest;
import com.kt.library.dto.request.BookCreateRequest;
import com.kt.library.dto.request.BookUpdateRequest;
import com.kt.library.dto.response.BookResponse;
import com.kt.library.dto.response.UserResponse;
import com.kt.library.exception.UnAuthorizedException;
import com.kt.library.service.BookService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/books")
@RequiredArgsConstructor
public class BookController {

    private final BookService bookService;

    @GetMapping
    public List<BookResponse> getBooks() {
        return bookService.getAllBooks();
    }

    @GetMapping("/{bookId}")
    public BookResponse getBook(@PathVariable Long bookId) {
        return bookService.getBook(bookId);
    }

    @PostMapping
    public BookResponse createBook(
            @RequestBody BookCreateRequest request,
            @SessionAttribute(name = "loginUser", required = false) UserResponse loginUser
    ) {
        return bookService.createBook(request, requireUserId(loginUser));
    }

    @PutMapping("/{bookId}")
    public BookResponse updateBook(
            @PathVariable Long bookId,
            @RequestBody BookUpdateRequest request,
            @SessionAttribute(name = "loginUser", required = false) UserResponse loginUser
    ) {
        return bookService.updateBook(bookId, request, requireUserId(loginUser));
    }

    @DeleteMapping("/{bookId}")
    public void deleteBook(
            @PathVariable Long bookId,
            @SessionAttribute(name = "loginUser", required = false) UserResponse loginUser
    ) {
        bookService.deleteBook(bookId, requireUserId(loginUser));
    }

    @GetMapping("/my")
    public List<BookResponse> getMyBooks(
            @SessionAttribute(name = "loginUser", required = false) UserResponse loginUser
    ) {
        return bookService.getBooksByUserId(requireUserId(loginUser));
    }

    @PutMapping("/ai-image")
    public void updateCoverImage(
            @RequestBody BookCoverUrlRequest request,
            @SessionAttribute(name = "loginUser", required = false) UserResponse loginUser
    ) {
        bookService.updateCoverImage(request.getBookId(), request.getCoverImageUrl(), requireUserId(loginUser));
    }

    @PostMapping("/ai-cover")
    public String generateCover(@RequestBody BookAiImageRequest request) {
        return bookService.generateAiCover(request.getPrompt(), request.getApiKey());
    }

    private Long requireUserId(UserResponse loginUser) {
        if (loginUser == null) {
            throw new UnAuthorizedException("로그인이 필요합니다.");
        }
        return loginUser.getId();
    }
}
