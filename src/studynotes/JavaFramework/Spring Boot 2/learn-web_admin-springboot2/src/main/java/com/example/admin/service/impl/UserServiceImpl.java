package com.example.admin.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.example.admin.bean.User;
import com.example.admin.mapper.UserMapper;
import com.example.admin.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * @author zzq
 * @date 2021/12/30 15:08
 */
@Service
public class UserServiceImpl extends ServiceImpl<UserMapper,User> implements UserService {

    @Autowired
    UserMapper userMapper;

    @Override
    public User getUserById(Long id) {
        User user = userMapper.getById(id);
        return user;
    }

    @Override
    public void insert(User user) {
        userMapper.addUser(user);
    }

}
