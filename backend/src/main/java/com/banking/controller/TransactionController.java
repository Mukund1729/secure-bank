package com.banking.controller;

import com.banking.dto.TransactionRequest;
import com.banking.model.User;
import com.banking.service.TransactionService;
import com.banking.service.UserService;
import jakarta.validation.Valid;
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
@RequestMapping("/transaction")
@CrossOrigin(origins = "*")
public class TransactionController {
    
    @Autowired
    private TransactionService transactionService;
    
    @Autowired
    private UserService userService;
    
    @PostMapping("/deposit")
    public ResponseEntity<?> deposit(@Valid @RequestBody TransactionRequest request, Authentication authentication) {
        try {
            UUID txnId = transactionService.deposit(request);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Deposit successful");
            response.put("transactionId", txnId);
            response.put("amount", request.getAmount());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @PostMapping("/withdraw")
    public ResponseEntity<?> withdraw(@Valid @RequestBody TransactionRequest request, Authentication authentication) {
        try {
            UUID txnId = transactionService.withdraw(request);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Withdrawal successful");
            response.put("transactionId", txnId);
            response.put("amount", request.getAmount());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @PostMapping("/transfer")
    public ResponseEntity<?> transfer(@Valid @RequestBody TransactionRequest request, Authentication authentication) {
        try {
            if (request.getToAccountId() == null) {
                throw new RuntimeException("Destination account ID is required for transfer");
            }
            
            UUID txnId = transactionService.transfer(
                request.getAccountId(),
                request.getToAccountId(),
                request.getAmount(),
                request.getDescription()
            );
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Transfer successful");
            response.put("transactionId", txnId);
            response.put("amount", request.getAmount());
            response.put("fromAccount", request.getAccountId());
            response.put("toAccount", request.getToAccountId());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @GetMapping("/statement/{accountId}")
    public ResponseEntity<?> getMiniStatement(@PathVariable UUID accountId, Authentication authentication) {
        try {
            List<Object[]> statement = transactionService.getMiniStatement(accountId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("accountId", accountId);
            response.put("transactions", statement);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @GetMapping("/history/{accountId}")
    public ResponseEntity<?> getTransactionHistory(@PathVariable UUID accountId, Authentication authentication) {
        try {
            List<com.banking.model.Transaction> history = transactionService.getTransactionHistory(accountId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("accountId", accountId);
            response.put("transactions", history);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @GetMapping("/high-value")
    public ResponseEntity<?> getHighValueTransactions(@RequestParam(defaultValue = "100000") BigDecimal threshold) {
        try {
            List<com.banking.model.Transaction> transactions = transactionService.getHighValueTransactions(threshold);
            
            Map<String, Object> response = new HashMap<>();
            response.put("threshold", threshold);
            response.put("transactions", transactions);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
}
