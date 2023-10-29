package energymanagement.users.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@CrossOrigin
public class IndexController {

    @GetMapping(value = "/")
    public ResponseEntity<String> getStatus() {
        return new ResponseEntity<>("City APP Service is running...", HttpStatus.OK);
    }
}
