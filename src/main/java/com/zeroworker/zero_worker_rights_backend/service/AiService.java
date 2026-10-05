package com.zeroworker.zero_worker_rights_backend.service;

import com.zeroworker.zero_worker_rights_backend.dto.AiRequestDTO;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import java.util.List;
import java.util.Map;

@Service
public class AiService {

    @Value("${ai.api.key}")
    private String apiKey;

    @Value("${ai.api.url}")
    private String apiUrl;

    public String analyze(AiRequestDTO dto) {
        // 1. 构造发送给 AI 的提示词
        String prompt = "你是一个零工权益法律助手。请根据用户描述的问题，给出初步分析、可能涉及的法律问题、建议准备的材料、以及下一步建议。注意不要给出确定的法律结论，只做初步信息整理。\n\n用户描述：" + dto.getUserInput();

        // 2. 构造请求体
        Map<String, Object> requestBody = Map.of(
                "model", "deepseek-chat",
                "messages", List.of(
                        Map.of("role", "user", "content", prompt)
                )
        );

        // 3. 用 WebClient 发送请求到 AI 接口
        WebClient client = WebClient.builder()
                .baseUrl(apiUrl)
                .defaultHeader("Authorization", "Bearer " + apiKey)
                .defaultHeader("Content-Type", "application/json")
                .build();

        // 4. 获取 AI 返回的内容
        Map response = client.post()
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(Map.class)
                .block();

        // 5. 解析返回的数据
        try {
            List choices = (List) response.get("choices");
            Map firstChoice = (Map) choices.get(0);
            Map message = (Map) firstChoice.get("message");
            return (String) message.get("content");
        } catch (Exception e) {
            return "AI 分析失败：" + e.getMessage();
        }
    }
}