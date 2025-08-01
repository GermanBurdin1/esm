package com.mycompany.ems.crm.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class CrmEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    // Placeholder entity for crm module
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
}