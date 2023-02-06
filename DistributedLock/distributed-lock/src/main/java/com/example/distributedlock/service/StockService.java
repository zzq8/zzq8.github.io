package com.example.distributedlock.service;

import com.example.distributedlock.entity.Stock;
import com.baomidou.mybatisplus.extension.service.IService;

/**
 * <p>
 *  服务类
 * </p>
 *
 * @author XD
 * @since 2022-09-02
 */
public interface StockService extends IService<Stock> {

    void deduct();
}
