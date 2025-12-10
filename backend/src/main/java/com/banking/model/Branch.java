package com.banking.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "branches")
public class Branch {
    
    @Id
    @Column(name = "branch_code", length = 10)
    private String branchCode;
    
    @NotBlank(message = "Branch name is required")
    @Size(max = 100)
    @Column(name = "branch_name", nullable = false)
    private String branchName;
    
    @NotBlank(message = "Region is required")
    @Size(max = 50)
    @Column(nullable = false)
    private String region;
    
    private String address;
    
    @Size(max = 15)
    private String phone;
    
    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @OneToMany(mappedBy = "branch", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Account> accounts;
    
    // Constructors
    public Branch() {}
    
    public Branch(String branchCode, String branchName, String region) {
        this.branchCode = branchCode;
        this.branchName = branchName;
        this.region = region;
    }
    
    // Getters and Setters
    public String getBranchCode() { return branchCode; }
    public void setBranchCode(String branchCode) { this.branchCode = branchCode; }
    
    public String getBranchName() { return branchName; }
    public void setBranchName(String branchName) { this.branchName = branchName; }
    
    public String getRegion() { return region; }
    public void setRegion(String region) { this.region = region; }
    
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public List<Account> getAccounts() { return accounts; }
    public void setAccounts(List<Account> accounts) { this.accounts = accounts; }
}
