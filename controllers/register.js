
const handleRegister = ( req, res, db, bcrypt ) => {
    const { fname, lname, email, password } = req.body;
    if ( !fname || !lname || !email || !password) {
        return res.status(400).json('incorrect form submission');
    }
    const hash = bcrypt.hashSync(password);
    db.transaction(trx => {
        trx.insert({
            hash: hash,
            email: email
        })
        .into('login')
        .returning('email')
        .then(loginEmail => {
            return trx('users')
            .returning('*')
            .insert({ 
                email: loginEmail[0],
                fname: fname,
                lname: lname,
                joined: new Date()})
            .then(user => {
            res.json(user[0]);
            })
        })
        .then(trx.commit)
        .catch(trx.rollback)
    }).catch(err => res.status(400).json('Unable to register'))
}

module.exports = {
    handleRegister: handleRegister
}