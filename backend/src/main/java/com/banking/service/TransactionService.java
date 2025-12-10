package com.banking.service;

import com.banking.dto.TransactionRequest;
import com.banking.model.Account;
import com.banking.model.Transaction;
import com.banking.model.TransactionStatus;
import com.banking.model.TransactionType;
import com.banking.repository.AccountRepository;
import com.banking.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Service
public class TransactionService {
    
    @Autowired
    private TransactionRepository transactionRepository;
    
    @Autowired
    private AccountRepository accountRepository;
    
    @Transactional(isolation = Isolation.SERIALIZABLE)
    public UUID deposit(TransactionRequest request) {
        try {
            Account account = accountRepository.findById(request.getAccountId())
                    .orElseThrow(() -> new RuntimeException("Account not found"));

            if (Boolean.FALSE.equals(account.getIsActive())) {
                throw new RuntimeException("Account is inactive");
            }

            BigDecimal amount = request.getAmount();
            if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
                throw new RuntimeException("Amount must be positive");
            }

            BigDecimal newBalance = account.getBalance().add(amount);
            account.setBalance(newBalance);

            Transaction txn = new Transaction();
            txn.setAccount(account);
            txn.setType(TransactionType.DEPOSIT);
            txn.setAmount(amount);
            txn.setDescription(request.getDescription() != null ? request.getDescription() : "Cash Deposit");
            txn.setBalanceAfter(newBalance);
            txn.setStatus(TransactionStatus.COMPLETED);

            accountRepository.save(account);
            transactionRepository.save(txn);

            return txn.getTxnId();
        } catch (Exception e) {
            throw new RuntimeException("Deposit failed: " + e.getMessage());
        }
    }
    
    @Transactional(isolation = Isolation.SERIALIZABLE)
    public UUID withdraw(TransactionRequest request) {
        try {
            Account account = accountRepository.findById(request.getAccountId())
                    .orElseThrow(() -> new RuntimeException("Account not found"));

            if (Boolean.FALSE.equals(account.getIsActive())) {
                throw new RuntimeException("Account is inactive");
            }

            BigDecimal amount = request.getAmount();
            if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
                throw new RuntimeException("Amount must be positive");
            }

            if (account.getBalance().compareTo(amount) < 0) {
                throw new RuntimeException("Insufficient balance");
            }

            BigDecimal newBalance = account.getBalance().subtract(amount);
            account.setBalance(newBalance);

            Transaction txn = new Transaction();
            txn.setAccount(account);
            txn.setType(TransactionType.WITHDRAW);
            txn.setAmount(amount.negate());
            txn.setDescription(request.getDescription() != null ? request.getDescription() : "Cash Withdrawal");
            txn.setBalanceAfter(newBalance);
            txn.setStatus(TransactionStatus.COMPLETED);

            accountRepository.save(account);
            transactionRepository.save(txn);

            return txn.getTxnId();
        } catch (Exception e) {
            throw new RuntimeException("Withdrawal failed: " + e.getMessage());
        }
    }
    
    @Transactional(isolation = Isolation.SERIALIZABLE)
    public UUID transfer(UUID fromAccountId, UUID toAccountId, BigDecimal amount, String description) {
        try {
            if (fromAccountId.equals(toAccountId)) {
                throw new RuntimeException("Source and destination accounts must be different");
            }

            Account fromAccount = accountRepository.findById(fromAccountId)
                    .orElseThrow(() -> new RuntimeException("Source account not found"));
            Account toAccount = accountRepository.findById(toAccountId)
                    .orElseThrow(() -> new RuntimeException("Destination account not found"));

            if (Boolean.FALSE.equals(fromAccount.getIsActive()) || Boolean.FALSE.equals(toAccount.getIsActive())) {
                throw new RuntimeException("One of the accounts is inactive");
            }

            if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
                throw new RuntimeException("Amount must be positive");
            }

            if (fromAccount.getBalance().compareTo(amount) < 0) {
                throw new RuntimeException("Insufficient balance in source account");
            }

            BigDecimal fromNewBalance = fromAccount.getBalance().subtract(amount);
            BigDecimal toNewBalance = toAccount.getBalance().add(amount);

            fromAccount.setBalance(fromNewBalance);
            toAccount.setBalance(toNewBalance);

            String txnDescription = description != null ? description : "Money Transfer";

            // Outgoing transaction
            Transaction debitTxn = new Transaction();
            debitTxn.setAccount(fromAccount);
            debitTxn.setToAccount(toAccount);
            debitTxn.setType(TransactionType.TRANSFER);
            debitTxn.setAmount(amount.negate());
            debitTxn.setDescription(txnDescription + " - To " + toAccount.getAccountNumber());
            debitTxn.setBalanceAfter(fromNewBalance);
            debitTxn.setStatus(TransactionStatus.COMPLETED);

            // Incoming transaction
            Transaction creditTxn = new Transaction();
            creditTxn.setAccount(toAccount);
            creditTxn.setToAccount(fromAccount);
            creditTxn.setType(TransactionType.TRANSFER);
            creditTxn.setAmount(amount);
            creditTxn.setDescription(txnDescription + " - From " + fromAccount.getAccountNumber());
            creditTxn.setBalanceAfter(toNewBalance);
            creditTxn.setStatus(TransactionStatus.COMPLETED);

            accountRepository.save(fromAccount);
            accountRepository.save(toAccount);
            transactionRepository.save(debitTxn);
            transactionRepository.save(creditTxn);

            return debitTxn.getTxnId();
        } catch (Exception e) {
            throw new RuntimeException("Transfer failed: " + e.getMessage());
        }
    }
    
    @Transactional(readOnly = true)
    public List<Object[]> getMiniStatement(UUID accountId) {
        return transactionRepository.getMiniStatement(accountId);
    }
    
    @Transactional(readOnly = true)
    public List<Transaction> getTransactionHistory(UUID accountId) {
        return transactionRepository.findRecentTransactionsByAccountId(accountId);
    }
    
    @Transactional(readOnly = true)
    public List<Transaction> getHighValueTransactions(BigDecimal threshold) {
        return transactionRepository.findHighValueTransactions(threshold);
    }
    
    @Transactional(readOnly = true)
    public Long getRecentTransactionCount(UUID accountId, int hours) {
        java.time.LocalDateTime since = java.time.LocalDateTime.now().minusHours(hours);
        return transactionRepository.countRecentTransactionsByAccount(accountId, since);
    }
}
