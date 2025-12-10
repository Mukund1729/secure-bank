package com.banking.service;

import com.banking.model.Expense;
import com.banking.model.User;
import com.banking.repository.ExpenseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Transactional
public class ExpenseService {

    @Autowired
    private ExpenseRepository expenseRepository;

    public Expense addExpense(User user, LocalDate date, String category, BigDecimal amount, String note) {
        Expense expense = new Expense();
        expense.setUser(user);
        expense.setDate(date);
        expense.setCategory(category);
        expense.setAmount(amount);
        expense.setNote(note);
        return expenseRepository.save(expense);
    }

    public Map<String, BigDecimal> getMonthlySummary(User user, int monthsBack) {
        LocalDate end = LocalDate.now();
        LocalDate start = end.minusMonths(monthsBack).withDayOfMonth(1);

        List<Expense> expenses = expenseRepository.findForUserInRange(user, start, end);
        Map<String, BigDecimal> monthTotals = new HashMap<>();

        for (Expense e : expenses) {
            YearMonth ym = YearMonth.from(e.getDate());
            String key = ym.toString(); // e.g. 2025-03
            monthTotals.put(key, monthTotals.getOrDefault(key, BigDecimal.ZERO).add(e.getAmount()));
        }

        return monthTotals;
    }

    public Map<Integer, BigDecimal> getDailySummaryForMonth(User user, YearMonth month) {
        LocalDate start = month.atDay(1);
        LocalDate end = month.atEndOfMonth();

        List<Expense> expenses = expenseRepository.findForUserInRange(user, start, end);
        Map<Integer, BigDecimal> dayTotals = new HashMap<>();

        for (Expense e : expenses) {
            int day = e.getDate().getDayOfMonth();
            dayTotals.put(day, dayTotals.getOrDefault(day, BigDecimal.ZERO).add(e.getAmount()));
        }

        return dayTotals;
    }

    public List<Expense> getExpensesForMonth(User user, YearMonth month) {
        LocalDate start = month.atDay(1);
        LocalDate end = month.atEndOfMonth();
        return expenseRepository.findForUserInRange(user, start, end);
    }
}
