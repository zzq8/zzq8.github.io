package org.example.service.impl;

import org.example.service.CRUD;
import org.springframework.stereotype.Service;

@Service
public class CRUDImpl implements CRUD {
    @Override
    public void delete() {
        System.out.println("删除方法执行...");
    }
}
