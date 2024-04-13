package com.example.admin.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.example.admin.bean.User;

/**
 * @author zzq
 * @date 2021/12/30 15:07
 */
public interface UserService extends IService<User> {

    public User getUserById(Long id);

    public void insert(User user);
}