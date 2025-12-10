package com.banking.repository;

import com.banking.model.Account;
import com.banking.model.Transaction;
import com.banking.model.TransactionStatus;
import com.banking.model.TransactionType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, UUID> {
    
    List<Transaction> findByAccount(Account account);
    
    List<Transaction> findByAccountAndStatus(Account account, TransactionStatus status);
    
    @Query("SELECT t FROM Transaction t WHERE t.account.accountId = :accountId AND t.status = 'COMPLETED' ORDER BY t.createdAt DESC")
    List<Transaction> findRecentTransactionsByAccountId(@Param("accountId") UUID accountId);
    
    @Query(value = "SELECT * FROM get_mini_statement(:accountId)", nativeQuery = true)
    List<Object[]> getMiniStatement(@Param("accountId") UUID accountId);
    
    List<Transaction> findByType(TransactionType type);
    
    List<Transaction> findByStatus(TransactionStatus status);
    
    @Query("SELECT t FROM Transaction t WHERE t.account.accountId = :accountId AND t.createdAt BETWEEN :startDate AND :endDate ORDER BY t.createdAt DESC")
    List<Transaction> findByAccountAndDateRange(@Param("accountId") UUID accountId, 
                                              @Param("startDate") LocalDateTime startDate, 
                                              @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT t FROM Transaction t WHERE ABS(t.amount) > :amount AND t.status = 'COMPLETED'")
    List<Transaction> findHighValueTransactions(@Param("amount") BigDecimal amount);
    
    @Query("SELECT COUNT(t) FROM Transaction t WHERE t.account.accountId = :accountId AND t.createdAt > :since AND t.status = 'COMPLETED'")
    Long countRecentTransactionsByAccount(@Param("accountId") UUID accountId, @Param("since") LocalDateTime since);
}
