package com.zeroworker.zero_worker_rights_backend.service;

import com.fasterxml.jackson.databind.ObjectMapper;
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

    public Map analyze(AiRequestDTO dto) {
        // 1. 构造提示词（强制要求 AI 返回 JSON）
        String prompt = "你是一个零工权益法律助手。请根据用户描述的问题，给出初步分析、建议准备的材料、申报前检查事项、以及下一步建议。"
                + "你必须严格按照以下 JSON 格式输出，不要加任何额外的文字说明或 Markdown 标记：\n"
                + "{\n"
                + "  \"aiAnalysis\": \"对问题的初步分析\",\n"
                + "  \"materials\": \"建议准备的材料清单\",\n"
                + "  \"checkResult\": \"申报前检查事项\",\n"
                + "  \"nextStep\": \"下一步建议\"\n"
                + "}\n"
                + "\n用户描述：" + dto.getUserInput();

        // 2. 构造请求体
        Map<String, Object> requestBody = Map.of(
                "model", "deepseek-chat",
                "messages", List.of(
                        Map.of("role", "user", "content", prompt)
                )
        );

        // 3. 发送请求
        WebClient client = WebClient.builder()
                .baseUrl(apiUrl)
                .defaultHeader("Authorization", "Bearer " + apiKey)
                .defaultHeader("Content-Type", "application/json")
                .build();

        // 4. 获取 AI 返回
        Map response = client.post()
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(Map.class)
                .block();

        // 5. 解析 JSON 返回结果
        try {
            List choices = (List) response.get("choices");
            Map firstChoice = (Map) choices.get(0);
            Map message = (Map) firstChoice.get("message");
            String content = (String) message.get("content");

            // 用 ObjectMapper 把 AI 返回的字符串解析成 Map
            ObjectMapper mapper = new ObjectMapper();
            return mapper.readValue(content, Map.class);
        } catch (Exception e) {
            return Map.of("aiAnalysis", "AI 分析失败：" + e.getMessage(),
                    "materials", "",
                    "checkResult", "",
                    "nextStep", "");
        }
    }
}