package com.example.distributedlock.controller;

import com.example.distributedlock.service.StockService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * <p>
 *  前端控制器
 * </p>
 *
 * @author XD
 * @since 2022-09-02
 */
@RestController
@RequestMapping("/stock")
public class StockController {

    @Autowired
    private StockService stockService;

    @Value("${server.port}")
    private String serverPort;

    @GetMapping("/deduct")
    public String deduct(){
        stockService.deduct();

        return "端口："+serverPort+"，执行--";
    }
}
