package com.example.distributedlock.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.example.distributedlock.dao.StockDao;
import com.example.distributedlock.entity.Stock;
import com.example.distributedlock.service.StockService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.dao.DataAccessException;
import org.springframework.data.redis.core.RedisOperations;
import org.springframework.data.redis.core.SessionCallback;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.script.DefaultRedisScript;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.Arrays;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

/**
 * <p>
 * 服务实现类
 * </p>
 *
 * @author XD
 * @since 2022-09-02
 */
@Slf4j
@Service
//@Scope("prototype") // 现在还不是多例，还需要指定代理模式
@Scope(value = "prototype", proxyMode = ScopedProxyMode.TARGET_CLASS) //* 原生 Spring JDK代理  * 现在 SpringBoot 2.X 之后都是CGlib
public class StockServiceImpl extends ServiceImpl<StockDao, Stock> implements StockService {

    @Autowired
    StringRedisTemplate redisTemplate;


    /**
     * UUID Lua
     */
    @Override
    public void deduct(){
        String uuid = UUID.randomUUID().toString();
        //加锁   FIXME  这里忘记 ! 排查很久
        while(!redisTemplate.opsForValue().setIfAbsent("lock",uuid,3, TimeUnit.SECONDS)){
            try {
//                System.out.println(redisTemplate.opsForValue().get("lock"));
                Thread.sleep(50);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
        //执行业务
        try {
            // 1. 查库存
            String stock = redisTemplate.opsForValue().get("stock");
            // 2. 判断
            if(!StringUtils.isEmpty(stock)){
                Integer st = Integer.valueOf(stock);

                if(st > 0){
                    // 3. 执行减
                    redisTemplate.opsForValue().set("stock",String.valueOf(--st));
                }
            }
        } finally {
            // 4. 释放锁
//            if(uuid.equals(redisTemplate.opsForValue().get("lock"))){
                /**
                 * 这里可能会把第二个请求的锁释放掉：刚判断完锁过期，第二个拿到锁，第一个就释放第二个的
                 * 原因：判断和删除没有原子性
                 */
//                redisTemplate.delete("lock");
//            }


            String script = "if redis.call('get', KEYS[1]) == ARGV[1] " +
                    "then " +
                    "   return redis.call('del', KEYS[1]) " +
                    "else " +
                    "   return 0 " +
                    "end";
            redisTemplate.execute(new DefaultRedisScript<>(script,Long.class), Arrays.asList("lock"),uuid);
        }
    }

















    /**
     * Redis 乐观锁
     */
    public void deductByOptimistic() {

        redisTemplate.execute(new SessionCallback<Object>() {
            @Override
            public Object execute(RedisOperations redisOperations) throws DataAccessException {
                redisOperations.watch("stock");
                //查库存
                String stock = (String) redisOperations.opsForValue().get("stock");
                //判断逻辑  ->  也可以用 decr 把这一步和下一步结合
                if (!StringUtils.isEmpty(stock)) {
                    Integer value = Integer.valueOf(stock);
                    //执行减库存
                    if (value > 0) {
                        redisOperations.multi();
                        redisOperations.opsForValue().set("stock", String.valueOf(value - 1));
                        List<Object> exec = redisOperations.exec();
                        if (exec.isEmpty()) {
                            // FIXME 这里不 sleep 的话，可能会栈内存溢出，因为执行速度快
                            try {
                                Thread.sleep(100);
                                deduct();
                            } catch (InterruptedException e) {
                                e.printStackTrace();
                            }
                        }
                        return exec;
                    }

                }
                return null;

            }
        });

    }


    /**
     * 用了 MyBatis-Plus 就直接用 baseMapper 相当于 -> StockDao   ServiceImpl<StockDao, Stock>
     */
//    @Resource
//    private StockDao stockDao;
    @Value("${server.port}")
    private String port;

    private Lock lock = new ReentrantLock();

    public synchronized void deduct2() {
//        lock.lock();
        try {
            Stock stock = baseMapper.selectOne(new QueryWrapper<Stock>().eq("product_code", "1001"));
            if (stock != null && stock.getCount() > 0) {
                stock.setCount(stock.getCount() - 1);
                baseMapper.updateById(stock);
                log.info("端口{}，还剩{}", port, stock.getCount());
            }
        } finally {
//            lock.unlock();
        }
    }

}
