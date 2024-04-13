package org.example.bean;

import lombok.Data;

import java.util.List;

@Data
public class Department {

    private Integer id;
    private String departmentName;
    private List<Employee> emps;
}
