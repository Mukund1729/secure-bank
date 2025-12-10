package com.banking.repository;

import com.banking.model.Account;
import com.banking.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface AccountRepository extends JpaRepository<Account, UUID> {
    
    List<Account> findByUser(User user);
    
    List<Account> findByUserAndIsActive(User user, Boolean isActive);
    
    Optional<Account> findByAccountNumber(String accountNumber);
    
    Optional<Account> findByAccountNumberAndIsActive(String accountNumber, Boolean isActive);
    
    List<Account> findByBranchBranchCode(String branchCode);
    
    @Query("SELECT a FROM Account a WHERE a.user.userId = :userId AND a.isActive = true")
    List<Account> findActiveAccountsByUserId(@Param("userId") UUID userId);
    
    @Query("SELECT a FROM Account a JOIN a.branch b WHERE b.region = :region AND a.isActive = true")
    List<Account> findByRegion(@Param("region") String region);
    
    @Query(value = "SELECT * FROM accounts WHERE user_id = :userId AND is_active = true LIMIT 1", 
           nativeQuery = true)
    Optional<Account> findPrimaryAccountByUserId(@Param("userId") UUID userId);
    
    Boolean existsByAccountNumber(String accountNumber);
}
