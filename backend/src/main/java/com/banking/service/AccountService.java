package com.banking.service;

import com.banking.model.Account;
import com.banking.model.Branch;
import com.banking.model.User;
import com.banking.repository.AccountRepository;
import com.banking.repository.BranchRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@Transactional
public class AccountService {
    
    @Autowired
    private AccountRepository accountRepository;
    
    @Autowired
    private BranchRepository branchRepository;
    
    public Account createAccount(User user, String branchCode) {
        Branch branch = branchRepository.findById(branchCode)
                .orElseGet(() -> {
                    Branch newBranch = new Branch();
                    newBranch.setBranchCode(branchCode);
                    newBranch.setBranchName("Default Branch " + branchCode);
                    newBranch.setRegion("Default");
                    return branchRepository.save(newBranch);
                });
        
        // Generate a short unique account number (max 20 chars)
        String rawId = UUID.randomUUID().toString().replace("-", "");
        String accountNumber = rawId.substring(0, 16);
        
        Account account = new Account();
        account.setUser(user);
        account.setBranch(branch);
        account.setAccountNumber(accountNumber);
        
        return accountRepository.save(account);
    }
    
    public Optional<Account> findByAccountNumber(String accountNumber) {
        return accountRepository.findByAccountNumberAndIsActive(accountNumber, true);
    }
    
    public Optional<Account> findById(UUID accountId) {
        return accountRepository.findById(accountId);
    }
    
    public List<Account> findAccountsByUser(User user) {
        return accountRepository.findByUserAndIsActive(user, true);
    }
    
    public Optional<Account> findPrimaryAccount(UUID userId) {
        return accountRepository.findPrimaryAccountByUserId(userId);
    }
    
    public BigDecimal getAccountBalance(UUID accountId) {
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("Account not found"));
        return account.getBalance();
    }
    
    public List<Account> findAccountsByBranch(String branchCode) {
        return accountRepository.findByBranchBranchCode(branchCode);
    }
    
    public void deactivateAccount(UUID accountId) {
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("Account not found"));
        
        account.setIsActive(false);
        accountRepository.save(account);
    }
    
    @Transactional(readOnly = true)
    public boolean accountExists(UUID accountId) {
        return accountRepository.existsById(accountId);
    }
    
    @Transactional(readOnly = true)
    public boolean isAccountActive(UUID accountId) {
        return accountRepository.findById(accountId)
                .map(Account::getIsActive)
                .orElse(false);
    }
}
