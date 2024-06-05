package com.zzq.springcloud.mapper;

import com.zzq.springcloud.entity.Payment;

//@Mapper
//@Repository不用Spring的
public interface PaymentMapper {

    int create(Payment payment);

    Payment getPaymentById(Long id);
}
