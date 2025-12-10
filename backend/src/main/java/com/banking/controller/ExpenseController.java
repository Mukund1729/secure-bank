package com.banking.controller;

import com.banking.model.User;
import com.banking.service.ExpenseService;
import com.banking.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/expense")
@CrossOrigin(origins = "*")
public class ExpenseController {

    @Autowired
    private ExpenseService expenseService;

    @Autowired
    private UserService userService;

    @PostMapping("/add")
    public ResponseEntity<?> addExpense(@RequestBody Map<String, Object> payload, Authentication authentication) {
        try {
            String email = authentication.getName();
            User user = userService.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            String dateStr = (String) payload.get("date");
            String category = (String) payload.get("category");
            String note = (String) payload.getOrDefault("note", "");
            Object amountObj = payload.get("amount");

            if (dateStr == null || category == null || amountObj == null) {
                throw new RuntimeException("date, category and amount are required");
            }

            LocalDate date = LocalDate.parse(dateStr);
            BigDecimal amount = new BigDecimal(amountObj.toString());

            expenseService.addExpense(user, date, category, amount, note);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Expense saved successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @GetMapping("/summary/monthly")
    public ResponseEntity<?> getMonthlySummary(@RequestParam(defaultValue = "6") int months,
                                               Authentication authentication) {
        try {
            String email = authentication.getName();
            User user = userService.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            Map<String, BigDecimal> summary = expenseService.getMonthlySummary(user, months);
            return ResponseEntity.ok(summary);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @GetMapping("/summary/daily")
    public ResponseEntity<?> getDailySummary(@RequestParam("month") String month,
                                             Authentication authentication) {
        try {
            String email = authentication.getName();
            User user = userService.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            YearMonth ym = YearMonth.parse(month); // format: YYYY-MM
            Map<Integer, BigDecimal> summary = expenseService.getDailySummaryForMonth(user, ym);
            return ResponseEntity.ok(summary);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @GetMapping("/list")
    public ResponseEntity<?> getExpensesForMonth(@RequestParam("month") String month,
                                                 Authentication authentication) {
        try {
            String email = authentication.getName();
            User user = userService.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            YearMonth ym = YearMonth.parse(month);
            return ResponseEntity.ok(expenseService.getExpensesForMonth(user, ym));
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
}
