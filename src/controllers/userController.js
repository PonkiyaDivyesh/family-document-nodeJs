const pool = require("../db/conn");
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

exports.userCreate = async (req, res) => {
    const { name, mobile_no, email, password } = req.body;
    try {
        const error = validationResult(req);
        if (!error.isEmpty()) {
            return res.status(400).json({ errors: error.array() });
        }

        await pool.query(`SELECT * FROM account_create WHERE email = ${pool.escape(email)} OR mobile_no = ${pool.escape(mobile_no)};`,
            (err, result) => {
                console.log('result', result)
                if (result && result.length) {
                    return res.status(409).send({ msg: 'This mail id and mobile no is already in use!' })
                } else {
                    bcrypt.hash(password, 10, (err, hash) => {
                        if (err) {
                            return res.status(400).send({ msg: err })
                        }
                        else {
                            let post = {
                                name: name, mobile_no: mobile_no, email: email,
                                password: hash, create_date: new Date()
                            };
                            let sql = 'INSERT INTO account_create SET ?'
                            pool.query(sql, post, (err, result) => {
                                if (err) {
                                    return res.status(400).send({ msg: err })
                                } else {
                                    res.status(200).send({
                                        msg: 'User has been registered with us!',
                                    });
                                }
                            })
                        }
                    })
                }
            }
        );



    } catch (e) {
        console.log(e)

        res.status(400).send(e);
    }
};

// exports.studentsGet = async (req, res) => {
//     try {

//         await pool.query('SELECT * FROM contact', (err, result, fields) => {
//             if (err) throw err;
//             res.status(201).send(result);

//             result.forEach(result => {
//                 console.log(result);
//             });
//         })
//     } catch (e) {
//         res.status(400).send(e);
//     }
// };

// exports.studentsGetSelect = async (req, res) => {
//     try {
//         const _id = req.params.id;
//         await pool.query(`SELECT * FROM contact WHERE srno=${_id}`, (err, result, fields) => {
//             if (err) throw err;
//             if (result.length <= 0) {
//                 res.status(400).send('list not found');
//             } else {
//                 res.status(201).send(result);
//             }

//             result.forEach(result => {
//                 console.log(result);
//             });
//         })
//     } catch (e) {
//         res.status(500).send(e);
//     }
// };

// exports.studentsUpdate = async (req, res) => {
//     console.log('req', req);

//     try {
//         const _id = req.params.id;
//         let email = req.body.email;
//         await pool.query(`UPDATE contact SET email="${email}" WHERE srno=${_id}`, (err, result, fields) => {
//             if (err) throw err;
//             res.status(201).send(result);
//         })
//     } catch (e) {
//         console.log('updateStudent', e)

//         res.status(500).send(e);
//     }
// };

// exports.studentsDel = async (req, res) => {
//     try {
//         const _id = req.params.id;
//         await pool.query(`DELETE FROM contact WHERE srno=${_id}`, (err, result, fields) => {
//             if (err) throw err;
//             res.status(201).send(result);
//         })
//     } catch (e) {
//         res.status(500).send(e);
//     }
// };