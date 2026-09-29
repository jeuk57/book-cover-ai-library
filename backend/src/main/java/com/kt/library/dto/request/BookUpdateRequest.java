package com.kt.library.dto.request;

import com.kt.library.domain.Book;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BookUpdateRequest {

    private String title;
    private String content;
    private String author;
    private Book.Language language;
    private Book.Genre genre;
}
