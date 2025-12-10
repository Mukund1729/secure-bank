package com.banking.repository;

import com.banking.model.Expense;
import com.banking.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, UUID> {

    List<Expense> findByUserAndDateBetween(User user, LocalDate start, LocalDate end);

    @Query("SELECT e FROM Expense e WHERE e.user = :user AND e.date BETWEEN :start AND :end ORDER BY e.date ASC")
    List<Expense> findForUserInRange(@Param("user") User user,
                                     @Param("start") LocalDate start,
                                     @Param("end") LocalDate end);
}
