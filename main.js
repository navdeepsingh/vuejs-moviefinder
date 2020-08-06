Vue.component('top-header', {
	template: `<div class="container d-flex justify-content-center mt-5"><h1>{{title}}</h1></div>`,
	data() {
		return {
			title: "Movie Finder"
		}
	}
})

var app = new Vue({
  el: '#root',
  data: {
    message: 'Hello Vue!'
  }
})