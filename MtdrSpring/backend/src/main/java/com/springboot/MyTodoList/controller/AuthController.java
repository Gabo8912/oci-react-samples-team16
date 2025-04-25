package com.springboot.MyTodoList.controller;

import com.springboot.MyTodoList.model.User;
import com.springboot.MyTodoList.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        Optional<User> user = userService.authenticate(loginRequest.getUsername(), loginRequest.getPassword());

        if (user.isPresent()) {
            // Simulación de un token (en producción usar JWT)
            String token = UUID.randomUUID().toString();
            return ResponseEntity.ok(new AuthResponse(token, user.get().getRole()));
        }

        return ResponseEntity.status(401).body("Credenciales incorrectas");
    }

    // ✅ Obtener todos los usuarios (para asignar tareas)
    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    // ✅ Obtener datos del usuario actual
    @GetMapping("/user/{username}")
    public ResponseEntity<?> getCurrentUser(@PathVariable String username) {
        Optional<User> user = userService.findByUsername(username);
        if (user.isPresent()) {
            User currentUser = user.get();
            currentUser.setPassword(null); // Oculta la contraseña
            return ResponseEntity.ok(currentUser);
        }
        return ResponseEntity.status(404).body("User not found");
    }
}

// Clase para recibir las credenciales
class LoginRequest {
    private String username;
    private String password;

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}

// Clase para responder con un token y el rol
class AuthResponse {
    private String token;
    private String role;

    public AuthResponse(String token, String role) {
        this.token = token;
        this.role = role;
    }

    public String getToken() { return token; }
    public String getRole() { return role; }
}

/*package com.springboot.MyTodoList.controller;

import com.springboot.MyTodoList.model.User;
import com.springboot.MyTodoList.model.ClickCaptcha;
import com.springboot.MyTodoList.service.UserService;
import com.springboot.MyTodoList.service.CaptchaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private CaptchaService captchaService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        Optional<User> user = userService.authenticate(loginRequest.getUsername(), loginRequest.getPassword());

        if (user.isPresent()) {
            // Generate a captcha for the user
            captchaService.generateCaptcha(loginRequest.getUsername());
            return ResponseEntity.ok(new CaptchaResponse(
                ClickCaptcha.getCheckboxX(),
                ClickCaptcha.getCheckboxY(),
                ClickCaptcha.getCheckboxSize()
            ));
        }

        return ResponseEntity.status(401).body("Credenciales incorrectas");
    }

    @PostMapping("/verify-captcha")
    public ResponseEntity<?> verifyCaptcha(@RequestBody CaptchaVerificationRequest request) {
        if (captchaService.validateCaptcha(request.getUsername(), request.getClickX(), request.getClickY())) {
            // Generate final token after successful captcha verification
            String token = UUID.randomUUID().toString();
            Optional<User> user = userService.findByUsername(request.getUsername());
            return ResponseEntity.ok(new AuthResponse(token, user.get().getRole()));
        }
        return ResponseEntity.status(401).body("Captcha incorrecto");
    }

    // Get all users (for task assignment)
    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    // ✅ Obtener datos del usuario actual
    @GetMapping("/user/{username}")
    public ResponseEntity<?> getCurrentUser(@PathVariable String username) {
        Optional<User> user = userService.findByUsername(username);
        if (user.isPresent()) {
            User currentUser = user.get();
            currentUser.setPassword(null); // Oculta la contraseña
            return ResponseEntity.ok(currentUser);
        }
        return ResponseEntity.status(404).body("User not found");
    }
}

// Clase para recibir las credenciales
class LoginRequest {
    private String username;
    private String password;

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}

// Clase para responder con un token y el rol
class AuthResponse {
    private String token;
    private String role;

    public AuthResponse(String token, String role) {
        this.token = token;
        this.role = role;
    }

    public String getToken() { return token; }
    public String getRole() { return role; }
}

class CaptchaResponse {
    private int checkboxX;
    private int checkboxY;
    private int checkboxSize;

    public CaptchaResponse(int checkboxX, int checkboxY, int checkboxSize) {
        this.checkboxX = checkboxX;
        this.checkboxY = checkboxY;
        this.checkboxSize = checkboxSize;
    }

    public int getCheckboxX() { return checkboxX; }
    public int getCheckboxY() { return checkboxY; }
    public int getCheckboxSize() { return checkboxSize; }
}

class CaptchaVerificationRequest {
    private String username;
    private int clickX;
    private int clickY;

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public int getClickX() { return clickX; }
    public void setClickX(int clickX) { this.clickX = clickX; }

    public int getClickY() { return clickY; }
    public void setClickY(int clickY) { this.clickY = clickY; }
}
 */