package com.banking.repository;

import com.banking.model.Branch;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BranchRepository extends JpaRepository<Branch, String> {
    
    List<Branch> findByRegion(String region);
    
    Optional<Branch> findByBranchName(String branchName);
    
    @Query("SELECT b FROM Branch b WHERE b.branchName LIKE %:name%")
    List<Branch> findByBranchNameContaining(@Param("name") String name);
    
    @Query(value = "SELECT * FROM get_branch_summary(:branchCode)", nativeQuery = true)
    List<Object[]> getBranchSummary(@Param("branchCode") String branchCode);
    
    @Query(value = "SELECT * FROM get_branch_summary(NULL)", nativeQuery = true)
    List<Object[]> getAllBranchSummaries();
}
