// Require
let express=require('express')
let app=express()

// Moteur template
app.set('view engine','ejs')

// Middleware
app.use('/devjs',express.static('devjs/'))
app.use('/js',express.static('js/'))
app.use('/textures',express.static('textures/'))
app.use('/images',express.static('images/'))
app.use('/data',express.static('data/'))
app.use('/models',express.static('models/'))

// Routes
app.get('/',(request,response)=>{
	//response.send('Salut')
	/*
	if (request.session.error){
		response.locals.error=request.session.error
		request.session.error=undefined
	}*/
	response.render('index'); 
})

app.get('/cube',(request,response)=>{

	response.render('cube'); 
})

app.get('/terre',(request,response)=>{

	response.render('terre'); 
})

app.get('/ogre',(request,response)=>{

	response.render('ogre'); 
})

app.listen(8000)
