const Clarifai = require('clarifai');

const app = new Clarifai.App({
    apiKey: 'cbc1d08f5729402eaf5b773e74edd3ef'
   });


const handleAPICall = (req, res) => {
    app.models.predict( Clarifai.FACE_DETECT_MODEL, req.body.input)
    .then(data => {
        res.json(data);
    })
    .catch(err => res.status(400).json('Unable to work with API'));
}   

const handleImage = ( req, res, db ) => {
    const { id, entries } = req.body;
    let found = false;
    db('users')
    .where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
        res.json(entries[0])
    })
    .catch(err => res.status(400).json('Unable to get entries'));
}

module.exports = {
    handleImage: handleImage,
    handleAPICall: handleAPICall
}