const express = require('express');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');
const date = require('date-and-time');
var methodOverride = require('method-override');
var mongoose = require('mongoose');
var session = require('express-session')
const DATABASE_URL = 'mongodb://localhost:27017/PAMS';

const app = express()
  .set('view engine', 'ejs')
  .use(methodOverride("_method"))
  .use(express.json())
  .use(express.urlencoded({ extended: true }))
  .use(express.static("public"))
  .use(session({ secret: 'HW4', resave: true, saveUninitialized: false }))
  .use(passport.initialize())
  .use(passport.session());

mongoose.connect(DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true });

const User = require('./models/user');
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

const now = new Date();

var announcement = require('./models/announcement');
var doctor = require('./models/doctor');
var clinic = require('./models/clinic');
var appointment = require('./models/appointment');

//Root
app.get('/', checkAuthenticated, (req, res) => {
  res.redirect('/' + req.user.type);
});
//Entities routes
app.get('/patient', checkAuthenticated, (req, res) => {
  if (req.user.type != 'patient')
    res.redirect('/' + req.user.type);
  else
    res.render('patient', {})
});
app.get('/receptionist', checkAuthenticated, (req, res) => {
  if (req.user.type != 'receptionist')
    res.redirect('/' + req.user.type);
  else
    res.render('receptionist', {})
});
app.get('/manager', checkAuthenticated, (req, res) => {
  if (req.user.type != 'manager')
    res.redirect('/' + req.user.type);
  else
    res.render('manager', {})
});
app.get('/admin', checkAuthenticated, (req, res) => {
  if (req.user.type != 'admin')
    res.redirect('/' + req.user.type);
  else
    res.render('admin', {})
});
//Register logic
app.get('/register', checkNotAuthenticated, (req, res) => {
  res.render('register', { e_msg: '', expand: false });
});
app.post('/register', function (req, res) {
  e = req.body.email; f = req.body.fname; l = req.body.lname; c = req.body.confirm; p = req.body.password; n = req.body.number;
  if (n == '' || p == '' || f == '' || l == '' || e == '')
    return res.render('register', { e_msg: 'Please fill all fields', expand: true })
  if (p != c)
    return res.render('register', { e_msg: "Passwords don't match", expand: true });
  if(!(/[A-Za-z]{1,15}/.test(f) | /[A-Za-z]{1,15}/.test(l)))
    return res.render('register', { e_msg: "Name is invalid", expand: true });
  if (!/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(e))
    return res.render('register', { e_msg: "Email is invalid", expand: true });
  if (!/[0]{1}[5]{1}[0-9]{8}/.test(n))
    return res.render('register', { e_msg: "Number is invalid", expand: true });
  if(p.length < 3)
    return res.render('register', { e_msg: "password is invalid", expand: true });
  User.register(new User({ email: e.toLowerCase(), lname:l, fname: f, type:"patient", number: n, status:"verified"}), p, function (err, user) {
    if (err) {
      res.render('register', { e_msg: "Email is already used", expand: true });
      console.log(err);
    }
    else passport.authenticate('local')(req, res, () => {
      res.redirect('/');
    });
  });
});
//Login logic
app.get('/login', checkNotAuthenticated, (req, res) => {
  res.render('login', {e_msg:"", expand: false});
});
app.post('/login', function(req, res) {
  passport.authenticate('local', function(err, user, info) {
    if (err) 
      return res.render('login', { e_msg: "Internal error, please try again later", expand: true});
    else if (!user) 
      return res.render('login', { e_msg: "Please check your email and/or password", expand: true});
    else
    req.login(user, loginErr => {
      if (loginErr) 
        return res.render('login', { e_msg: "Internal error, please try again later", expand: true});
      else  
        res.redirect('/');
    });      
  })(req, res);
});
//signout
app.get('/signout', checkAuthenticated, (req, res) => {
  req.logOut()
  res.redirect('/')
})
//Checking logic
function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect('/login')
}
function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/')
  }
  next()
}
//RESTFULL ROUTES
app.get('/clinics', function (req, res) {
  if (req.user.type =='admin')
    clinic.find({},'name _id services rating location', (err, clinicList) => {
      if (err) 
        res.json({});
      else 
        res.json(clinicList);
    });
  else
    clinic.find({status: {"$ne":'Hidden'}},'name _id services rating location', (err, clinicList) => {
      if (err) 
        res.json({});
      else 
        res.json(clinicList);
    });
});
app.get('/clinics/:id', function (req, res) {
  var id = req.params.id;
    clinic.findById({id}, (err, clinic) => {
      if (err) 
        res.json({});
      else if(clinic.status=='Hidden' && req.user.clinic_id != clinic._id)
        res.send("You don't have privilege");
      else 
        res.json(clinic);
    });
});
app.get('/doctors', function (req, res) {
  if (req.user.type =='admin')
    doctor.find({},'fname lname _id speciality rating location clinic_id experience', (err, doctorList) => {
      if (err) 
        res.json({});
      else 
        res.json(doctorList);
    });
  else
    doctor.find({status: {"$ne":'Hidden'}},'fname lname _id speciality rating location clinic_id experience', (err, doctorList) => {
      if (err) 
        res.json({});
      else 
        res.json(doctorList);
    });
});
app.get('/doctor/:id', function (req, res) {
  var id = req.params.id;
    doctor.findById({id}, (err, doctor) => {
      if (err) 
        res.json({});
      else if(doctor.status=='Hidden' && req.user.clinic_id != doctor.clinic_id)
        res.send("You don't have privilege");
      else 
        res.json(doctor);
    });
});
app.get('/clinic/:id/doctors', function (res,req) {
  var id = req.params.id;
  if(req.user.clinic_id == id)
    doctor.find({clinic_id:id}, (err, doctorList) => {
      if (err) 
        res.json({});
      else 
        res.json(doctorList);
    });
    else 
    doctor.find({clinic_id:id, status: {"$ne":'Hidden'}}, (err, doctorList) => {
        if (err) 
          res.json({});
        else 
          res.json(doctorList);
    });
});
app.get('/appointments',checkAuthenticated, function (req, res) {
  if (req.user.type =='patient')
    appointment.find({patient_id: req.user._id}, (err, appList) => {
      if (err) 
        res.json({});
      else 
        res.json(appList);
    });
  else if (req.user.type =='receptionist')
  appointment.find({clinic_id: req.user.clinic_id}, (err, appList) => {
    if (err) 
        res.json({});
      else 
        res.json(appList);
    });
});
app.get('/annoucement', function (req, res) {
  announcement.find({},(err,annList) => {
    if(err)
      res.json({});
    else
      res.json(annList);
  });
});
app.get('/appointments/:id',checkAuthenticated, function (req, res) {
  var id = req.params.id;
  if (req.user.type =='patient')
    appointment.findById({id}, (err, app) => {
      if (err) 
        res.json({});
      else if(app.patient_id != req.user._id)
        res.send("You don't have privilege");
      else 
        res.json(app);
    });
  else if (req.user.type =='receptionist')
  appointment.findById({id}, (err, app) => {
    if (err) 
        res.json({});
        else if(app.clinic_id != req.user._id)
        res.send("You don't have privilege");
      else 
        res.json(app);
    });
});
app.post('/clinic', checkAuthenticated, function (req, res) {
  if (req.user.type != 'admin')
    res.send("You don't have privilege");
  else {
    //create clinic c from res.body
    var newClinic = new clinic(c);
    clinic.save((err, clinic) => {
      if (err) 
        res.send("failed "+err);
      else 
        res.send("success");
    });
  }
});
app.post('/clinic/:id/doctor', checkAuthenticated, function (req, res) {
  var id = req.params.id;
  if (req.user.type != 'manager' || id != req.user.clinic_id)
    res.send("You don't have privilege");
  else {
    //create doctor d from res.body to be added into clinic with id
    var newDoctor = new doctor(d);
    doctor.save((err, doctor) => {
      if (err) 
        res.send("failed " + err);
      else 
        res.send("success");
    });
  }
});
app.post('/appointments', checkAuthenticated, function (req, res) {
  if (req.user.type != 'patient')
    res.send("You don't have privilege");
  else {
    //create app
    //check if doctor busy?
    app.patient_id = req.user._id
    var newAppointment = new appointment(app);
    appointment.save((err, app) => {
      if (err) 
        res.send("failed");
      else 
        res.send("success");
    });
  }
});
app.post('/annoucement',checkAuthenticated, function (req, res) {
  if (req.user.type != 'admin')
    res.send("You don't have privilege");
    else {
      //create announcement a from res.body
      a.submitter = req.user.fname + " " + req.user.lname;
      a.date = date.format(now, 'YY/MM/DD');
      var newAnn = new announcement(a);
      announcement.save((err, ann) => {
        if (err) 
          res.send("failed");
        else 
          res.send("success");
      });
    }
});
//put and delete remaining
app.put("/visits/:id", checkAuthenticated, function (req, res) {
  var id = req.params.id;
  const visit = req.body;
  var test = true;
  for (var d in visit)
    if (visit[d] == '') {
      test = false;
      break;
    }
  if (test)
    visits.findById(id, (err, doc) => {
      if (err || doc == null)
        res.send("ID is not valid");
      if (doc.owner != req.user._id)
        res.send("You don't have privilege");
      else {
        if (req.user.type == 'resident')
          doc.visitor = visit.visitor;
        else
          doc.host = visit.host;
        doc.destination = visit.destination;
        doc.date = visit.date;
        doc.time = visit.time;
        doc.maker = visit.maker;
        doc.model = visit.model;
        doc.year = visit.year;
        doc.plate = visit.plate;
        doc.save((err, ndoc) => {
          if (err) res.redirect("/visits/" + id + "/edit")
          else res.redirect("/");
        });
      }
    });
  else
    res.redirect("/visits/" + id + "/edit")
});
app.delete("/visits/:id", checkAuthenticated, function (req, res) {
  var id = req.params.id;
  visits.findById(id, 'owner', (err, doc) => {
    if (err || doc == null)
      res.send("Id is not valid")
    else if (doc.owner != req.user._id)
      res.send("You don't have privilege")
    else {
      visits.findByIdAndDelete(id, (err) => {
        if (err) res.redirect("/visits/" + id + "/edit");
        else res.redirect("/");
      });
    }
  });
});
//switch status
app.put("/visits/:id/switch", checkAuthenticated, function (req, res) {
  if (req.user.type != 'security')
    res.send("You don't have privilege");
  var id = req.params.id;
  visits.findById(id, 'checkedout', (err, doc) => {
    if (err) res.send("Internal error, please try again");
    else {
      doc.checkedout = doc.checkedout == "YES" ? "NO" : "YES"
      doc.save((err, ndoc) => {
        if (err) res.send("Internal error, please try again");
        else res.redirect('/');
      });
    }
  });
});
//Start server
app.listen(3000, function () {
  console.log("Listening on port 3000");
});
