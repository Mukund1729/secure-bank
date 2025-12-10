package com.banking.controller;

import com.banking.model.Alert;
import com.banking.model.Loan;
import com.banking.model.LoanStatus;
import com.banking.model.User;
import com.banking.service.AlertService;
import com.banking.service.LoanService;
import com.banking.service.TransactionService;
import com.banking.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/admin")
@CrossOrigin(origins = "*")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {
    
    @Autowired
    private LoanService loanService;
    
    @Autowired
    private AlertService alertService;
    
    @Autowired
    private TransactionService transactionService;
    
    @Autowired
    private UserService userService;
    
    @GetMapping("/loans/pending")
    public ResponseEntity<?> getPendingLoans() {
        try {
            List<Loan> pendingLoans = loanService.getPendingLoans();
            return ResponseEntity.ok(pendingLoans);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @PostMapping("/loans/{loanId}/approve")
    public ResponseEntity<?> approveLoan(@PathVariable UUID loanId, Authentication authentication) {
        try {
            String email = authentication.getName();
            User admin = userService.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("Admin not found"));
            
            Loan loan = loanService.approveLoan(loanId, admin);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Loan approved successfully");
            response.put("loanId", loan.getLoanId());
            response.put("amount", loan.getAmount());
            response.put("monthlyPayment", loan.getMonthlyPayment());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @PostMapping("/loans/{loanId}/reject")
    public ResponseEntity<?> rejectLoan(@PathVariable UUID loanId, Authentication authentication) {
        try {
            String email = authentication.getName();
            User admin = userService.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("Admin not found"));
            
            Loan loan = loanService.rejectLoan(loanId, admin);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Loan rejected successfully");
            response.put("loanId", loan.getLoanId());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @GetMapping("/transactions/alerts")
    public ResponseEntity<?> getSuspiciousTransactions() {
        try {
            List<Alert> alerts = alertService.getUnresolvedAlerts();
            return ResponseEntity.ok(alerts);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @PostMapping("/alerts/{alertId}/resolve")
    public ResponseEntity<?> resolveAlert(@PathVariable UUID alertId, Authentication authentication) {
        try {
            String email = authentication.getName();
            User admin = userService.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("Admin not found"));
            
            Alert alert = alertService.resolveAlert(alertId, admin);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Alert resolved successfully");
            response.put("alertId", alert.getAlertId());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @GetMapping("/transactions/high-value")
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
    
    @GetMapping("/reports/branch")
    public ResponseEntity<?> getBranchReports(@RequestParam(required = false) String branchCode) {
        try {
            // This would use the stored procedure get_branch_summary
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Branch reports functionality - integrate with BranchRepository.getBranchSummary()");
            response.put("branchCode", branchCode);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
}
