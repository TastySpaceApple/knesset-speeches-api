let open_speeches_db_why_did_i_have_to_create_one_myself_this_is_ridiculous = require('../services/open-knesset-speeches-db.js');
const router = require('express').Router();
const http = require('http');
const path = require('path');

router.get('/', (req, res) => {
  res.json({ message: 'Connected!' });
});

router.get('/speeches', (req, res) => {
  let data = {}
  if('protocolId' in req.query) data['protocolId'] = req.query['protocolId'];
  if('speaker' in req.query) data['speaker'] = req.query['speaker'];

  open_speeches_db_why_did_i_have_to_create_one_myself_this_is_ridiculous.getSpeeches(data)
  .then(speeches => res.json(speeches))
  ;
});

var request = require('request');

router.get('/images/mk', (req,res) => {
  open_speeches_db_why_did_i_have_to_create_one_myself_this_is_ridiculous.getMemberImageUrlByName(req.query.name).then(url => {
    request.get(url).pipe(res);
  }).catch(() => {
    res.sendFile(path.join(__dirname, 'img/noimage.png'));
  })
  //let url = 'http://fs.knesset.gov.il/globaldocs/MK/948/1_948_2_2596.png?v=20190722_62614';
  //request.get(url).pipe(res);
})


module.exports = router;
