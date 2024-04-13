package org.example.mapper;

import org.example.bean.Employee;


public interface EmployeeMapperPlus {
	
	public Employee getEmpById(Integer id);

	public Employee getEmpAndDept(Integer id);

	public Employee getEmpByIdStep(Integer id);

	public Employee getEmpsByDeptId(Integer id);
}
