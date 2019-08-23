const MyTodo = require('../../models/todo');
const User = require('../../models/users');
const jwt = require('../../config/jwtkey');
 
module.exports = function(app) {

    // rute untuk post login user
    app.post('/authenticate', (req, res) => {
        if(!req.body.email || !req.body.password) {
            res.status(422).json({
                type: false,
                error: 'Password Atau Email Harus Diisi'
            });
        } else {
            // cek user di dalam database
            User.findOne({
                email: String(req.body.email),
                password: String(req.body.password)
            },(err, user) => {
                if(err) {
                    res.status(501).json({
                        type: false,
                        error: 'Internal Server Error'
                    });
                } else {
                    if(user) {
                        // user ada 
                        res.status(200).json({
                            type: true,
                            data: user,
                            token: user.token
                        });
                    } else {
                        // password/email salah
                        res.status(400).json({
                            type: false,
                            error: 'Password atau Email Anda Salah'
                        });
                    }
                } 
            });
        }
     });

    // rute untuk post signin user
    app.post('/signup', (req, res) => {
        if(!req.body.email || !req.body.password || !req.body.name) {
            res.status(422).json({
                type: false,
                error: 'Nama, Password, Dan Email Anda Harus Disis'
            });
        } else {
            // cara apakah ada user yang sudah memiliki akun yang sama atau belum
            User.findOne({email: String(req.body.email)}, (err, user) => {
                if(err) {
                    res.status(501).json({
                        type: false,
                        error: 'Internal Server Error'
                    });
                } else {
                    if(user) {
                        res.status(400).json({
                            type: false,
                            error: 'Akun user ini sudah terdaftar'
                        });
                    } else {
                        // buat akun baru
                        let newUser = new User({
                            name: String(req.body.name),
                            email: String(req.body.email),
                            password: String(req.body.password),
                        });

                        newUser.save((err, user) => {
                            if(err) {
                                res.status(501).json({
                                    type: false,
                                    error: 'Internal Server Error'
                                });
                            } else { 
                                user.token = jwt.sign({user}, jwt.key);
                                user.save((err, user) => {
                                    if(err) {
                                        res.status(501).json({
                                            type: false,
                                            error: 'Internal Server Error'
                                        });
                                    } else {
                                        res.status(200).json({
                                            type: true,
                                            data: user,
                                            token: user.token
                                        });
                                    }
                                });      
                            }                 
                        });
                    }
                }
            });
        }
    })

    // rute menambahkan todo
    app.post('/todo', checkAuthorisasi ,(req, res) => {
        // cek token
        User.findOne({token: String(req.token)}, (err, user) => {
            if(err) {
                res.status(501).json({
                    type: false,
                    error: 'Internal Server Error'
                });
            } else {
                if(user) {
                    // token valid
                    let mytodo = new MyTodo({
                        judul: String(req.body.judul), 
                        deskripsi: String(req.body.deskripsi),
                        date: new Date()
                    });

                    mytodo.save((err, result) => {
                        if(err) {
                            res.status(501).json({
                                type: false,
                                error: 'Internal Server Error'
                            });
                        } else {
                            res.status(200).json({
                                type: true,
                                data: result
                            });
                        }  
                    });
                } else {
                    // token invalid
                    res.status(400).json({
                        type: false,
                        error: 'invalid Token'
                    });
                }
            }  
        });
    });

    // rute untuk mengambil todo berdasarkan id 
    app.get('/todo/:id', checkAuthorisasi, (req, res) => {
        // cek token
        User.findOne({token: String(req.token)}, (err, user) => {
            if(err) {  
                res.status(501).json({
                    type: false,
                    error: 'Internal Server Error'
                }); 
            } else {
                if(user) {
                    // token/user valid
                    MyTodo.findById(String(req.params.id), (err, todo) => {
                        if(err) { 
                            res.status(400).json({
                                error: 'Terjadi kesalahan saat mengambil todo anda'
                            });
                        } else {
                            res.status(200).json({
                                type: true,
                                data: todo
                            });
                        }
                    });           
                } else {
                    // invalid token 
                    res.status(400).json({
                        type: false,
                        error: 'invalid Token'
                    });
                }
            } 
        });
    });

    // rute menampilkan seluruh daftar todo
    app.get('/todo', checkAuthorisasi, (req, res) => {
        // cek token
        User.findOne({token: String(req.token)}, (err, user) => {
            if(err) {
                res.status(501).json({
                    type: false,
                    error: 'Internal Server Error'
                }); 
            } else {
                if(user) {
                    // token/user valid
                    MyTodo.find((err, items) => {
                        if(err) { 
                            res.status(400).json({
                                type: false,
                                error: 'Internal Server Error'
                            });
                        } else {
                            res.status(200).json({
                                type: true,
                                data: items
                            });
                        }
                    });
                } else {
                    // invalid token
                    res.status(400).json({
                        type: false,
                        error: 'invalid Token'
                    });
                }
             }
        });
    });

    // rute mendelete todo berdasarkan id
    app.delete('/todo/:id', checkAuthorisasi, (req, res) => {
        // cek token
        User.findOne({token: String(req.token)}, (err, user) => {
            if(err) {
                res.status(501).json({
                    type: false,
                    error: 'Internal Server Error'
                });
            } else {
                if(user) {
                    // token valid
                    MyTodo.deleteOne({_id: String(req.params.id)}, (err, result) => {
                        if(err) {
                            res.status(501).json({
                                type: false,
                                error: 'Internal Server Error'
                            }); 
                        } else {
                            res.status(200).json({
                                type: true,
                                data: result
                            });
                        }
                    });
                } else {
                    // token invalid
                    res.status(400).json({
                        type: false,
                        error: 'invalid Token'
                    });
                }
            }
        });
    });

    // rute mengupdate todo berdasarkan id
    app.put('/todo/:id', checkAuthorisasi, (req, res) => {
        // cek toke 
        User.findOne({token: String(req.token)}, (err, user) => {
            if(err) {
                res.status(501).json({
                    type: false,
                    error: 'Internal Server Error'
                });
            } else {
                if(user) {
                    // valid token
                    let newTodo = { judul: String(req.body.judul), deskripsi: String(req.body.deskripsi) }; 
                    MyTodo.updateOne({_id: String(req.params.id)}, {$set: {judul: newTodo.judul, deskripsi: newTodo.deskripsi}}, (err, result) => {
                        if(err) {
                            res.status(501).json({
                                type: false,
                                error: 'Terjadi kesalahan saat mengupdate/mengubah todo anda'
                            });
                        } else {
                            res.status(200).json({
                                type: true,
                                data: result
                            });
                       }
                    });
                } else {
                    // invalid token
                    res.status(501).json({
                        type: true,
                        error: 'invalid Token'
                    });
                }
            }
        });
    });
};

function checkAuthorisasi(req, res, next) {
    // console.log(req.data);
    console.log(req.headers);
    let getToken;
    let getHeaders = req.headers["authorization"];
//    console.log(getHeaders);
    if(typeof getHeaders !== 'undefined') {
        // authorized
        let usrToken = getHeaders.split(" ");
        getToken = usrToken[1];
        req.token = getToken;
        next();
    } else {
        // not autrhorized
        res.status(403).json({
            type: false,
            error: 'Forbiden'
        });
    }
}



