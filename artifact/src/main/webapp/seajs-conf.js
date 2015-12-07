seajs.config({
	base : "./",
	debug : true,
	paths : {
		'source-map' : 'base/spm_modules/source-map2/0.1.31',
		'handlebars' : 'base/spm_modules/handlebars/2.0.0'
	},
	alias : {
		"source-map" : "source-map/lib/source-map.js",
		"handlebars" : "handlebars/dist/handlebars.js"
	}
});