
        import http from "http";
        const server = http.createServer((req, res) => {
            res.end("Hello from server api1 on port 8081");
        });
        server.listen(8081, () => {
            console.log("Server api1 running on port 8081");
        });
    