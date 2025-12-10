package com.banking.service;

import com.banking.model.Alert;
import com.banking.model.User;
import com.banking.repository.AlertRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class AlertService {
    
    @Autowired
    private AlertRepository alertRepository;
    
    @Transactional(readOnly = true)
    public List<Alert> getUnresolvedAlerts() {
        return alertRepository.findUnresolvedAlerts();
    }
    
    @Transactional(readOnly = true)
    public List<Alert> getAlertsByAccount(UUID accountId) {
        return alertRepository.findAlertsByAccountId(accountId);
    }
    
    @Transactional(readOnly = true)
    public List<Alert> getAlertsByType(String alertType) {
        return alertRepository.findByAlertType(alertType);
    }
    
    public Alert resolveAlert(UUID alertId, User resolvedBy) {
        Alert alert = alertRepository.findById(alertId)
                .orElseThrow(() -> new RuntimeException("Alert not found"));
        
        alert.setIsResolved(true);
        alert.setResolvedBy(resolvedBy);
        alert.setResolvedAt(LocalDateTime.now());
        
        return alertRepository.save(alert);
    }
    
    @Transactional(readOnly = true)
    public Long getUnresolvedAlertCount(UUID accountId) {
        return alertRepository.countUnresolvedAlertsByAccount(accountId);
    }
}
