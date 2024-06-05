package com.zzq.service;

import com.zzq.domain.R;
import com.zzq.domain.User;

public interface LoginService {
    R login(User user);

    R logout();
}
