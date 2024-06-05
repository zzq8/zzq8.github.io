package com.zzq.springcloud.controller;

import com.zzq.springcloud.entity.CommonResult;
import com.zzq.springcloud.entity.Payment;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import javax.annotation.Resource;

@RestController
/**
 * 不需要用，默认配置文件，默认加载过了
 */
//使用@PropertySource注解读取外部配置文件中的key/value并保存到运行的环境变量中。  我猜随便放哪里都可以，这里我放启动类上
//@PropertySource("classpath:application.yaml")
@Slf4j
public class OrderController {

    /**
     * 没有在类上使用@Component注解或其他衍生注解，使之成为容器，spring就获取不到properties的值。
     * 因为：import org.springframework.beans.factory.annotation.Value;
     */
    @Value("${payment.url}")
    public String PAYMENT_URL;

    @Resource
    private RestTemplate restTemplate;

    @GetMapping("/consumer/payment/create")
    public CommonResult<Payment> create(Payment payment) {
        return restTemplate.postForObject(PAYMENT_URL+"/payment/create",payment,CommonResult.class);
    }

    @GetMapping("/consumer/payment/get/{id}")
    public CommonResult<Payment> getPayment(@PathVariable("id") Long id){

        log.info("URL 地址: {}",PAYMENT_URL);
        return restTemplate.getForObject(PAYMENT_URL+"/payment/get/"+id,CommonResult.class);
    }

    @GetMapping("/consumer/payment/getForEntity/{id}")
    public CommonResult<Payment> getPayment2(@PathVariable("id") Long id)
    {
        ResponseEntity<CommonResult> entity = restTemplate.getForEntity(PAYMENT_URL+"/payment/get/"+id,CommonResult.class);

        if(entity.getStatusCode().is2xxSuccessful()){
            return entity.getBody();//getForObject()
        }else{
            return new CommonResult<>(444,"操作失败");
        }
    }

}

