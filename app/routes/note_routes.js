const MyTodo = require('../../models/todo');
module.exports = function(app) {

    // rute menambahkan todo
    app.post('/todo', (req, res) => {
        let todo = { judul: req.body.judul, deskripsi: req.body.deskripsi };

        let mytodo = new MyTodo({
                judul: String(todo.judul), 
            deskripsi: String(todo.deskripsi),
                 date: new Date()
        });

        mytodo.save((err, result) => {
            if(err) res.status(400).send({'error': 'Terjadi kesalahan saat menambahkan todo anda'});
            res.status(200).send(result);
        });
    });

    // rute untuk mengambil todo berdasarkan id 
    app.get('/todo/:id', (req, res) => {
        const id = req.params.id;
        MyTodo.findById(id, (err, item) => {
            if(err) res.status(400).send({'error': 'Terjadi kesalahan saat mengambil todo anda'});
            res.status(200).send(item);
        });
    });

    // rute menampilkan seluruh daftar todo
    app.get('/todo', (req, res) => {
        MyTodo.find((err, item) => {
            if(err) res.status(400).send({'error': 'Terjadi kesalahan saat mengambil seluruh daftar todo anda'});
            res.status(200).send(item);
        })
    });

    // rute mendelete todo berdasarkan id
    app.delete('/todo/:id', (req, res) => {
        const id = req.params.id;
        MyTodo.deleteOne({_id: id}, (err, result) => {
           if(err) res.status(400).send({'error': 'Terjadi kesalahan saat menghapus todo anda'}); 
            res.status(200).send(result);
        });
    });

    // rute mengupdate todo berdasarkan id
    app.put('/todo/:id', (req, res) => {
        const id = req.params.id;
        let newTodo = { judul: String(req.body.judul), deskripsi: String(req.body.deskripsi) }; 
        MyTodo.updateOne({_id: id}, {$set: {judul: newTodo.judul, deskripsi: newTodo.deskripsi}}, (err, result) => {
            if(err) res.status(400).send({'error': 'Terjadi kesalahan saat mengupdate/mengubah todo anda'});
            res.status(200).send(result);
        });
    });
};

