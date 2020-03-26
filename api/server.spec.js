const request = require('supertest');
const server = require('./server.js');

describe('server', function() {
    it('runs the test', function() {
        expect(true).toBe(true);
    });

    describe('GET /', function() {
        it('should return 200 OK', function() {
            return request(server) 
                .get('/')
                .then(res => {
                    expect(res.status).toBe(200);
                });
        });
        it('should return JSON', function() {
            return request(server)
                .get('/')
                .then(res => {
                    expect(res.type).toMatch(/json/i);
                });
        });
        it('should return message in JSON', function() {
            return request(server)
                .get('/')
                .then(res => {
                    expect(res.body.message).toEqual(`API up and running on port 5000`);
                });
        });
    });

    describe('POST api/register', function() {
        it('should register a new user', function() {
            return request(server)
                .post('/api/register')
                .send({"username": "cfinn",
                "password": "123456",
                "department": "PCA"
                })
                .then(res => {
                    expect(res.status).toBe(201);
                });
        }); 
        it('should return JSON', function() {
            return request(server)
            .post('/api/register')
            .send({"username": "sblaney",
            "password": "123456",
            "department": "Wrap around"
            })
            .then(res => {
                expect(res.type).toMatch(/json/i);
            });
        });
        it('should return JSON with user with username property', function() {
            return request(server)
            .post('/api/register')
            .send({"username": "kdesisto",
            "password": "123456",
            "department": "machinest"
            })
            .then(res => {
                expect(res.body.user).toHaveProperty('username');
            });
        }); 
        it('should return JSON with user with password property', function() {
            return request(server)
            .post('/api/register')
            .send({"username": "cputney",
            "password": "123456",
            "department": "house manager"
            })
            .then(res => {
                expect(res.body.user).toHaveProperty('password');
            });
        });
        it('should return JSON with token', function() {
            return request(server)
            .post('/api/register')
            .send({"username": "jeff",
            "password": "123456",
            "department": "TL"
            })
            .then(res => {
                expect(res.body.token).toBeDefined();
            });
        });                
    });

    describe('POST api/login', function() {
        it('should login an existing user', function() {
            return request(server)
                .post('/api/register')
                .send({"username": "kfinn",
                "password": "123456",
                "department": "Manager"
                })
                .then(res => {
                    return request(server)
                        .post('/api/login')
                        .send({"username": "kfinn",
                        "password": "123456"})
                        .then(response => {
                            expect(response.status).toBe(200);                          
                        });
                });   
        });
        it('should return a token after successful login', function() {
            return request(server)
            .post('/api/login')
            .send({"username": "kfinn",
            "password": "123456"})
            .then(response => {
                expect(response.body.token).toBeDefined();                          
            });
        });
    });

    describe('GET api/users', function() {
        it('should return 200 OK after a successful login', function() {
            return request(server)
                .post('/api/login')
                .send({"username": "kfinn",
                "password": "123456"})
                .then(response => {
                    let currentToken = response.body.token; 
                    return request(server) 
                        .get('/api/users') 
                        .set('Authorization', currentToken)
                        .then(res => {
                            expect(res.status).toBe(200);
                            expect(res.body.length).toBeGreaterThanOrEqual(1);    
                        });                        
                });
        });
        it('should return a body containing users after a successful login', function() {
            return request(server)
                .post('/api/login')
                .send({"username": "kfinn",
                "password": "123456"})
                .then(response => {
                    let currentToken = response.body.token; 
                    return request(server) 
                        .get('/api/users') 
                        .set('Authorization', currentToken)
                        .then(res => {
                            expect(res.body.length).toBeGreaterThanOrEqual(1);   
                            });    
                        });                        
        });
        it('should return a property of id', function() {
            return request(server)
                .post('/api/login')
                .send({"username": "kfinn",
                "password": "123456"})
                .then(response => {
                    let currentToken = response.body.token; 
                    return request(server) 
                        .get('/api/users') 
                        .set('Authorization', currentToken)
                        .then(res => {
                                expect(res.body[0]).toHaveProperty('id');
                        });
                });
        });
    });

    describe('DELETE api/users/:id', function() {
        beforeEach(() => {
            return request(server)
                .post('/api/register')
                .send({"username": "ksemenza",
                "password": "123456",
                "department": "motivational speaker"
                })
        });
        it('should return 200 OK after a successful deletion', function() {
            return request(server)
                .post('/api/login')
                .send({"username": "ksemenza",
                "password": "123456",
                })
                .then(res => {
                    const current_id = res.body.user.id;
                    return request(server)
                        .delete(`/api/users/${current_id}`)
                        .then(lastResponse => {
                            expect(lastResponse.status).toBe(200);
                        });    
                });
        });
            
        it('should return a JSON message after a successful deletion', function() {
            return request(server)
                .post('/api/login')
                .send({"username": "ksemenza",
                "password": "123456",
                })
                .then(res => {
                    const current_id = res.body.user.id;
                    return request(server)
                        .delete(`/api/users/${current_id}`)
                        .then(lastResponse => {
                            expect(lastResponse.body.message).toBe(`Removed user with id ${current_id}`);
                        });    
                });
        });
    });
});
