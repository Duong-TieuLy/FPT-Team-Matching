package ut.edu.teammatching.websocket;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.enableSimpleBroker("/topic", "/queue"); // Sử dụng prefix cho broker
        config.setApplicationDestinationPrefixes("/app"); // Prefix cho các tin nhắn gửi từ client
        config.setUserDestinationPrefix("/user");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws") // endpoint frontend sẽ kết nối
                .setAllowedOriginPatterns("*") // hoặc đúng origin của frontend
                .withSockJS(); // Nếu dùng fallback SockJS // Đăng ký endpoint WebSocket
    }
}
