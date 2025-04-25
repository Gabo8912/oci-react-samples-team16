package com.springboot.MyTodoList.service;

import com.springboot.MyTodoList.model.ClickCaptcha;
import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;

@Service
public class CaptchaService {
    private final Map<String, Boolean> captchaStore = new HashMap<>();
    private final Random random = new Random();

    public void generateCaptcha(String sessionId) {
        captchaStore.put(sessionId, false);
    }

    public boolean validateCaptcha(String sessionId, int clickX, int clickY) {
        // Check if click is within the checkbox area
        boolean isValid = clickX >= ClickCaptcha.getCheckboxX() &&
                         clickX <= ClickCaptcha.getCheckboxX() + ClickCaptcha.getCheckboxSize() &&
                         clickY >= ClickCaptcha.getCheckboxY() &&
                         clickY <= ClickCaptcha.getCheckboxY() + ClickCaptcha.getCheckboxSize();
        
        captchaStore.remove(sessionId); // Remove used captcha
        return isValid;
    }
} 