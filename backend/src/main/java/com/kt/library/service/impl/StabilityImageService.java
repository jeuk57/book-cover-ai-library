package com.kt.library.service.impl;

import com.kt.library.exception.ImageGenerationException;
import com.kt.library.service.ImageGenerationService;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientResponseException;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Service
public class StabilityImageService implements ImageGenerationService {

    private static final String API_URL =
            "https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image";

    private final RestTemplate restTemplate = new RestTemplate();

    @Override
    public String generateImage(String prompt, String apiKey) {
        if (apiKey == null || apiKey.isBlank()) {
            throw new IllegalArgumentException("Stability AI API 키가 필요합니다.");
        }
        if (prompt == null || prompt.isBlank()) {
            throw new IllegalArgumentException("이미지 생성 문구가 필요합니다.");
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(apiKey);
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setAccept(List.of(MediaType.APPLICATION_JSON));

        Map<String, Object> body = Map.of(
                "text_prompts", List.of(Map.of("text", prompt)),
                "height", 1024,
                "width", 1024,
                "cfg_scale", 7,
                "samples", 1
        );

        try {
            Map<?, ?> response = restTemplate.postForObject(
                    API_URL,
                    new HttpEntity<>(body, headers),
                    Map.class
            );
            return toDataUrl(response);
        } catch (RestClientResponseException exception) {
            throw new ImageGenerationException("Stability AI 요청에 실패했습니다.");
        }
    }

    private String toDataUrl(Map<?, ?> response) {
        if (response == null || !(response.get("artifacts") instanceof List<?> artifacts) || artifacts.isEmpty()) {
            throw new ImageGenerationException("이미지 생성 결과가 없습니다.");
        }

        if (!(artifacts.get(0) instanceof Map<?, ?> artifact)) {
            throw new ImageGenerationException("이미지 생성 결과 형식이 올바르지 않습니다.");
        }

        Object encodedImage = artifact.get("base64");
        if (!(encodedImage instanceof String base64) || base64.isBlank()) {
            throw new ImageGenerationException("생성된 이미지 데이터가 없습니다.");
        }
        return "data:image/png;base64," + base64;
    }
}
