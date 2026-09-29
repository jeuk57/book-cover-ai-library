package com.kt.library.service.impl;

import com.kt.library.domain.Book;
import com.kt.library.domain.User;
import com.kt.library.dto.request.BookCreateRequest;
import com.kt.library.dto.request.BookUpdateRequest;
import com.kt.library.dto.response.BookResponse;
import com.kt.library.exception.ResourceNotFoundException;
import com.kt.library.exception.UnAuthorizedException;
import com.kt.library.repository.BookRepository;
import com.kt.library.repository.UserRepository;
import com.kt.library.service.BookService;
import com.kt.library.service.ImageGenerationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BookServiceImpl implements BookService {

    private final BookRepository bookRepository;
    private final UserRepository userRepository;
    private final ImageGenerationService imageGenerationService;

    @Override
    public BookResponse createBook(BookCreateRequest request, Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(()->new IllegalArgumentException("존재하지 않는 회원입니다."));

        Book book = new Book();
        book.setTitle(request.getTitle());
        book.setContent(request.getContent());
        book.setLanguage(request.getLanguage());
        book.setGenre(request.getGenre());
        book.setUser(user);
        book.setAuthor(request.getAuthor());
        return BookResponse.fromEntity(bookRepository.save(book));
    }

    @Override
    public BookResponse getBook(Long id) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("해당 도서를 찾을 수 없습니다."));
        return BookResponse.fromEntity(book);
    }

    @Override
    public List<BookResponse> getAllBooks() {
        return bookRepository.findAll()
                .stream()
                .map(BookResponse::fromEntity)
                .toList();
    }

    @Override
    public BookResponse updateBook(Long id, BookUpdateRequest request, Long userId) {

        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("해당 도서를 찾을 수 없습니다."));
        validateOwner(book, userId);

        if (request.getTitle() != null)   book.setTitle(request.getTitle());
        if (request.getContent() != null) book.setContent(request.getContent());
        if (request.getAuthor() != null) book.setAuthor(request.getAuthor());
        if (request.getLanguage() != null) book.setLanguage(request.getLanguage());
        if (request.getGenre() != null)   book.setGenre(request.getGenre());

        return BookResponse.fromEntity(bookRepository.save(book));
    }

    @Override
    public void deleteBook(Long id, Long userId) {

        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("해당 도서를 찾을 수 없습니다."));
        validateOwner(book, userId);

        bookRepository.delete(book);
    }

    @Override
    public List<BookResponse> getBooksByUserId(Long userId) {
        List<Book> books = bookRepository.findByUserId(userId);
        return books.stream()
                .map(BookResponse::fromEntity)
                .toList();
    }

    @Override
    public void updateCoverImage(Long bookId, String coverImageUrl, Long userId) {

        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new ResourceNotFoundException("해당 도서를 찾을 수 없습니다."));
        validateOwner(book, userId);
        book.setCoverImageUrl(coverImageUrl);
        bookRepository.save(book);
    }

    @Override
    public String generateAiCover(String prompt, String apiKey) {
        return imageGenerationService.generateImage(prompt, apiKey);
    }

    private void validateOwner(Book book, Long userId) {
        if (!book.getUser().getId().equals(userId)) {
            throw new UnAuthorizedException("본인이 등록한 도서만 변경할 수 있습니다.");
        }
    }

}
