package com.example.learnhellotest;

/**
 * @author zzq
 * @date 2022/1/9 16:44
 */
public class NetWorkTest {

    public static void main(String[] args) {
        Server server = new Server();
        NetWork netWork = new ProxyServer(server);

        netWork.browse();
    }
}

interface NetWork{

    public void browse();
}

class Server implements NetWork{

    @Override
    public void browse() {
        System.out.println("真实的服务器 browse");
    }
}

class ProxyServer implements NetWork{

    Server server;

    ProxyServer(Server server){
        this.server = server;
    }

    void check(){
        System.out.println("连接之前进行检查");
    }

    @Override
    public void browse() {
        check();
        server.browse();
    }
}
