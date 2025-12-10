package com.banking.repository;

import com.banking.model.Alert;
import com.banking.model.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface AlertRepository extends JpaRepository<Alert, UUID> {
    
    List<Alert> findByAccount(Account account);
    
    List<Alert> findByIsResolved(Boolean isResolved);
    
    List<Alert> findByAlertType(String alertType);
    
    @Query("SELECT a FROM Alert a WHERE a.isResolved = false ORDER BY a.createdAt DESC")
    List<Alert> findUnresolvedAlerts();
    
    @Query("SELECT a FROM Alert a WHERE a.account.accountId = :accountId ORDER BY a.createdAt DESC")
    List<Alert> findAlertsByAccountId(@Param("accountId") UUID accountId);
    
    @Query("SELECT a FROM Alert a WHERE a.createdAt BETWEEN :startDate AND :endDate ORDER BY a.createdAt DESC")
    List<Alert> findAlertsByDateRange(@Param("startDate") LocalDateTime startDate, 
                                     @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT COUNT(a) FROM Alert a WHERE a.account.accountId = :accountId AND a.isResolved = false")
    Long countUnresolvedAlertsByAccount(@Param("accountId") UUID accountId);
}
