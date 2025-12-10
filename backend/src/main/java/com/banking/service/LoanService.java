package com.banking.service;

import com.banking.dto.LoanRequest;
import com.banking.model.Loan;
import com.banking.model.LoanStatus;
import com.banking.model.User;
import com.banking.repository.LoanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@Transactional
public class LoanService {
    
    @Autowired
    private LoanRepository loanRepository;
    
    public Loan applyForLoan(User user, LoanRequest request) {
        // Check if user has too many active loans
        Long activeLoanCount = loanRepository.countActiveLoansByUserId(user.getUserId());
        if (activeLoanCount >= 3) {
            throw new RuntimeException("Maximum number of active loans exceeded");
        }
        
        Loan loan = new Loan();
        loan.setUser(user);
        loan.setAmount(request.getAmount());
        loan.setInterestRate(request.getInterestRate());
        loan.setTermMonths(request.getTermMonths());
        loan.setStatus(LoanStatus.PENDING);
        
        return loanRepository.save(loan);
    }
    
    public Loan approveLoan(UUID loanId, User approvedBy) {
        Loan loan = loanRepository.findById(loanId)
                .orElseThrow(() -> new RuntimeException("Loan not found"));
        
        if (loan.getStatus() != LoanStatus.PENDING) {
            throw new RuntimeException("Loan is not in pending status");
        }
        
        loan.setStatus(LoanStatus.APPROVED);
        loan.setApprovedBy(approvedBy);
        loan.setApprovedAt(LocalDateTime.now());
        
        return loanRepository.save(loan);
    }
    
    public Loan rejectLoan(UUID loanId, User rejectedBy) {
        Loan loan = loanRepository.findById(loanId)
                .orElseThrow(() -> new RuntimeException("Loan not found"));
        
        if (loan.getStatus() != LoanStatus.PENDING) {
            throw new RuntimeException("Loan is not in pending status");
        }
        
        loan.setStatus(LoanStatus.REJECTED);
        loan.setApprovedBy(rejectedBy);
        loan.setApprovedAt(LocalDateTime.now());
        
        return loanRepository.save(loan);
    }
    
    @Transactional(readOnly = true)
    public List<Loan> getPendingLoans() {
        return loanRepository.findPendingLoans();
    }
    
    @Transactional(readOnly = true)
    public List<Loan> getUserLoans(UUID userId) {
        return loanRepository.findLoansByUserId(userId);
    }
    
    @Transactional(readOnly = true)
    public Optional<Loan> findById(UUID loanId) {
        return loanRepository.findById(loanId);
    }
    
    @Transactional(readOnly = true)
    public List<Loan> getLoansByStatus(LoanStatus status) {
        return loanRepository.findByStatus(status);
    }
}
