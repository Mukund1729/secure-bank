package com.banking.controller;

import com.banking.model.Account;
import com.banking.model.User;
import com.banking.service.AccountService;
import com.banking.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/account")
@CrossOrigin(origins = "*")
public class AccountController {
    
    @Autowired
    private AccountService accountService;
    
    @Autowired
    private UserService userService;
    
    @GetMapping("/balance")
    public ResponseEntity<?> getBalance(Authentication authentication) {
        try {
            String email = authentication.getName();
            User user = userService.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            Account account = accountService.findPrimaryAccount(user.getUserId())
                    .orElseThrow(() -> new RuntimeException("Account not found"));
            
            Map<String, Object> response = new HashMap<>();
            response.put("accountId", account.getAccountId());
            response.put("accountNumber", account.getAccountNumber());
            response.put("balance", account.getBalance());
            response.put("accountType", account.getAccountType());
            response.put("branchCode", account.getBranch().getBranchCode());
            response.put("branchName", account.getBranch().getBranchName());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @GetMapping("/all")
    public ResponseEntity<?> getAllAccounts(Authentication authentication) {
        try {
            String email = authentication.getName();
            User user = userService.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            List<Account> accounts = accountService.findAccountsByUser(user);
            
            return ResponseEntity.ok(accounts);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @GetMapping("/{accountId}/balance")
    public ResponseEntity<?> getAccountBalance(@PathVariable UUID accountId, Authentication authentication) {
        try {
            String email = authentication.getName();
            User user = userService.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            Account account = accountService.findById(accountId)
                    .orElseThrow(() -> new RuntimeException("Account not found"));
            
            // Check if account belongs to the user
            if (!account.getUser().getUserId().equals(user.getUserId())) {
                throw new RuntimeException("Unauthorized access to account");
            }
            
            BigDecimal balance = accountService.getAccountBalance(accountId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("accountId", accountId);
            response.put("balance", balance);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @PostMapping("/create")
    public ResponseEntity<?> createAccount(@RequestParam String branchCode, Authentication authentication) {
        try {
            String email = authentication.getName();
            User user = userService.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            Account account = accountService.createAccount(user, branchCode);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Account created successfully");
            response.put("accountId", account.getAccountId());
            response.put("accountNumber", account.getAccountNumber());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
}
