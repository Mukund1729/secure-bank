package com.banking.controller;

import com.banking.dto.LoanRequest;
import com.banking.model.Loan;
import com.banking.model.User;
import com.banking.service.LoanService;
import com.banking.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/loan")
@CrossOrigin(origins = "*")
public class LoanController {
    
    @Autowired
    private LoanService loanService;
    
    @Autowired
    private UserService userService;
    
    @PostMapping("/apply")
    public ResponseEntity<?> applyForLoan(@Valid @RequestBody LoanRequest request, Authentication authentication) {
        try {
            String email = authentication.getName();
            User user = userService.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            Loan loan = loanService.applyForLoan(user, request);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Loan application submitted successfully");
            response.put("loanId", loan.getLoanId());
            response.put("amount", loan.getAmount());
            response.put("status", loan.getStatus());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @GetMapping("/status")
    public ResponseEntity<?> getLoanStatus(Authentication authentication) {
        Map<String, Object> response = new HashMap<>();
        try {
            if (authentication != null) {
                String email = authentication.getName();
                User user = userService.findByEmail(email)
                        .orElseThrow(() -> new RuntimeException("User not found"));
                
                List<Loan> loans = loanService.getUserLoans(user.getUserId());
                response.put("loans", loans);
            } else {
                // No authentication context available – return empty loans list
                response.put("loans", List.of());
            }
        } catch (Exception e) {
            // On any error, still return an empty list so the dashboard remains stable
            response.put("loans", List.of());
        }
        
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/{loanId}")
    public ResponseEntity<?> getLoanDetails(@PathVariable UUID loanId, Authentication authentication) {
        try {
            String email = authentication.getName();
            User user = userService.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            Loan loan = loanService.findById(loanId)
                    .orElseThrow(() -> new RuntimeException("Loan not found"));
            
            // Check if loan belongs to the user
            if (!loan.getUser().getUserId().equals(user.getUserId())) {
                throw new RuntimeException("Unauthorized access to loan");
            }
            
            return ResponseEntity.ok(loan);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
}
