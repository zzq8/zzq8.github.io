package org.example.service.impl;

import org.example.bean.Employee;
import org.example.mapper.EmployeeMapper;
import org.example.service.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmployeeServiceImpl implements EmployeeService {

    @Autowired
    private EmployeeMapper mapper;


    @Override
    public List<Employee> getEmps() {
        return mapper.getEmps();
    }
}
