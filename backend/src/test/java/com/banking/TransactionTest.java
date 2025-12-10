package com.banking;

import com.banking.model.*;
import com.banking.repository.*;
import com.banking.service.TransactionService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
public class TransactionTest {
    
    @Autowired
    private TransactionService transactionService;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private AccountRepository accountRepository;
    
    @Autowired
    private BranchRepository branchRepository;
    
    @Test
    public void testACIDTransactionRollback() {
        // Create test data
        Branch branch = new Branch("TEST01", "Test Branch", "Test Region");
        branchRepository.save(branch);
        
        User user1 = new User("Test User 1", "test1@example.com", "password", "1234567890");
        User user2 = new User("Test User 2", "test2@example.com", "password", "0987654321");
        userRepository.save(user1);
        userRepository.save(user2);
        
        Account account1 = new Account(user1, branch, "TEST001");
        Account account2 = new Account(user2, branch, "TEST002");
        account1.setBalance(new BigDecimal("1000.00"));
        account2.setBalance(new BigDecimal("500.00"));
        accountRepository.save(account1);
        accountRepository.save(account2);
        
        // Test successful transfer
        UUID txnId = transactionService.transfer(
            account1.getAccountId(), 
            account2.getAccountId(), 
            new BigDecimal("200.00"), 
            "Test transfer"
        );
        
        assertNotNull(txnId);
        
        // Verify balances after successful transfer
        Account updatedAccount1 = accountRepository.findById(account1.getAccountId()).get();
        Account updatedAccount2 = accountRepository.findById(account2.getAccountId()).get();
        
        assertEquals(new BigDecimal("800.00"), updatedAccount1.getBalance());
        assertEquals(new BigDecimal("700.00"), updatedAccount2.getBalance());
        
        // Test failed transfer (insufficient funds) - should rollback
        assertThrows(RuntimeException.class, () -> {
            transactionService.transfer(
                account1.getAccountId(), 
                account2.getAccountId(), 
                new BigDecimal("1000.00"), 
                "Failed transfer"
            );
        });
        
        // Verify balances remain unchanged after failed transfer
        Account finalAccount1 = accountRepository.findById(account1.getAccountId()).get();
        Account finalAccount2 = accountRepository.findById(account2.getAccountId()).get();
        
        assertEquals(new BigDecimal("800.00"), finalAccount1.getBalance());
        assertEquals(new BigDecimal("700.00"), finalAccount2.getBalance());
    }
    
    @Test
    public void testDeadlockPrevention() throws Exception {
        // Create test accounts
        Branch branch = new Branch("TEST02", "Test Branch 2", "Test Region");
        branchRepository.save(branch);
        
        User user1 = new User("User 1", "user1@test.com", "password", "1111111111");
        User user2 = new User("User 2", "user2@test.com", "password", "2222222222");
        userRepository.save(user1);
        userRepository.save(user2);
        
        Account account1 = new Account(user1, branch, "DEADLOCK001");
        Account account2 = new Account(user2, branch, "DEADLOCK002");
        account1.setBalance(new BigDecimal("1000.00"));
        account2.setBalance(new BigDecimal("1000.00"));
        accountRepository.save(account1);
        accountRepository.save(account2);
        
        ExecutorService executor = Executors.newFixedThreadPool(2);
        
        // Simulate concurrent transfers in opposite directions
        CompletableFuture<UUID> transfer1 = CompletableFuture.supplyAsync(() -> {
            try {
                return transactionService.transfer(
                    account1.getAccountId(), 
                    account2.getAccountId(), 
                    new BigDecimal("100.00"), 
                    "Concurrent transfer 1"
                );
            } catch (Exception e) {
                throw new RuntimeException(e);
            }
        }, executor);
        
        CompletableFuture<UUID> transfer2 = CompletableFuture.supplyAsync(() -> {
            try {
                return transactionService.transfer(
                    account2.getAccountId(), 
                    account1.getAccountId(), 
                    new BigDecimal("150.00"), 
                    "Concurrent transfer 2"
                );
            } catch (Exception e) {
                throw new RuntimeException(e);
            }
        }, executor);
        
        // Both transfers should complete without deadlock
        UUID txn1 = transfer1.get();
        UUID txn2 = transfer2.get();
        
        assertNotNull(txn1);
        assertNotNull(txn2);
        
        executor.shutdown();
    }
}
