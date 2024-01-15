package ro.tuc.ds2020.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.*;
import ro.tuc.ds2020.entity.Message;
import ro.tuc.ds2020.repositories.ChatRepository;
import ro.tuc.ds2020.services.ChatService;

import java.util.List;

@RestController
//@CrossOrigin
@RequestMapping(value = "/chat")
public class ChatController {

    private final ChatService chatService;

    @Autowired
    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    @PostMapping
    public ResponseEntity<Message> sendMessage(@RequestBody Message message) {
        return ResponseEntity.ok(chatService.saveMessage(message));
    }

    @GetMapping
    public ResponseEntity<List<Message>> getAllMessages() {
        return ResponseEntity.ok(chatService.getAllMessages());
    }

    @MessageMapping("send")
    @SendTo("/topic/messages")
    public Message receiveMessage(Message message) {
        System.out.println("RECEIVED MESSAGE: " + message + "\n");
        chatService.saveMessage(message);
        // You can add logic here to process the message if needed
        return message;
    }

}
