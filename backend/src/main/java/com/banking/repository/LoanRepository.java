package com.banking.repository;

import com.banking.model.Loan;
import com.banking.model.LoanStatus;
import com.banking.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Repository
public interface LoanRepository extends JpaRepository<Loan, UUID> {
    
    List<Loan> findByUser(User user);
    
    List<Loan> findByStatus(LoanStatus status);
    
    List<Loan> findByUserAndStatus(User user, LoanStatus status);
    
    @Query("SELECT l FROM Loan l WHERE l.status = 'PENDING' ORDER BY l.createdAt ASC")
    List<Loan> findPendingLoans();
    
    @Query("SELECT l FROM Loan l WHERE l.user.userId = :userId ORDER BY l.createdAt DESC")
    List<Loan> findLoansByUserId(@Param("userId") UUID userId);
    
    @Query("SELECT l FROM Loan l WHERE l.amount >= :minAmount AND l.amount <= :maxAmount")
    List<Loan> findLoansByAmountRange(@Param("minAmount") BigDecimal minAmount, 
                                     @Param("maxAmount") BigDecimal maxAmount);
    
    @Query("SELECT COUNT(l) FROM Loan l WHERE l.user.userId = :userId AND l.status IN ('PENDING', 'APPROVED', 'ACTIVE')")
    Long countActiveLoansByUserId(@Param("userId") UUID userId);
}
