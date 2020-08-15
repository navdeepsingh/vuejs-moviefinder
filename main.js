const api = "http://www.omdbapi.com/?apikey=8dae9e85&type=movie&s=";

Vue.component("top-header", {
  template: `<div class="container d-flex justify-content-center mt-5"><h1>{{title}}</h1></div>`,
  data() {
    return {
      title: "Movie Finder",
    };
  },
});

Vue.component("movie-search", {
  template: `<div class="container d-flex justify-content-center my-5">
		<form class="form-inline" v-on:submit.prevent="handleSubmit">
			<label for="search" >Search:</label>
			<input v-on:keyup="handleSearch" type="text" class="form-control" id="search" name="search" value="Mission" />
		</form>
	</div>
	`,
  methods: {
    handleSubmit: function (event) {
      console.log(event.target.value);
    },
    handleSearch: function (event) {
      console.log(event.target.value);
      this.$root.$refs.movielist
        .fetchMovie(event.target.value)
        .then((results) => {
          this.$root.$refs.movielist.loading = false;
          this.$root.$refs.movielist.moviesList = results;
        })
        .catch((e) => {
          this.$root.$refs.movielist.errored = true;
        });
    },
  },
});

Vue.component("movielist", {
  template: `<div class="container my-5 home-button">
	<div class=" d-flex d-flex justify-content-center mb-3">
	  <h1 class="text-slaned ">Movie List</h1>
	</div>
	<div class="movies-list d-flex flex-column">

	<div v-if="loading" class="loading"></div>
	
	<section v-if="errored">
		<div class="alert alert-danger text-center" role="alert">
			We're sorry, we're not able to retrieve this information at the moment, please try back later
		</div>
	</section>

  	<movie
		  v-for="movie in moviesList"
		  v-bind:info="movie"
		  v-bind:key="movie.imdbID"
	  ></movie>
	</div>
  </div>
`,
  methods: {
    getUnique: async function (arr) {
      let uniqueArr = [];
      let uniqueActualArr = [];
      arr.map((arrItem) => {
        if (!uniqueArr.includes(arrItem.imdbID)) {
          uniqueArr.push(arrItem.imdbID);
          uniqueActualArr.push(arrItem);
        }
      });
      return uniqueActualArr;
    },
    fetchMovie: async function (search = "Mission") {
      try {
        // read our json
        let response = await fetch(api + search);
        let responseJson = await response.json();

        // get results
        let results = await this.getUnique(responseJson.Search);
        this.errored = false;
        return results;
      } catch (e) {
        if (e) {
          this.errored = true;
          console.log(e.message, "Try updating the API key");
        }
      }
    },
  },
  data() {
    return {
      moviesList: null,
      loading: true,
      errored: false,
    };
  },
  created() {
    this.$root.$refs.movielist = this;
    this.fetchMovie().then((results) => {
      this.loading = false;
      this.moviesList = results;
    });
  },
});

Vue.component("movie", {
  props: ["info"],
  template: `<div class="d-flex justify-content-between">
	<div>
	  <h2>{{info.Title}}</h2>
	  <movie-details 
	  	v-bind:detail="info"
	  ></movie-details>	  
	</div>
	<a :href="'https://www.imdb.com/title/' +  info.imdbID" target="_blank">
		<img v-bind:src="info.Poster" width="100" />
	</a>	
  </div>
  `,
});

Vue.component("movie-details", {
  props: ["detail"],
  template: `<p>
	<strong>Year: </strong> {{ detail.Year }} <br />
	<strong>IMDb: </strong> <a href="https://www.imdb.com/title/">https://www.imdb.com/title/{{detail.imdbID}}</a>
  </p>
	`,
});

var app = new Vue({
  el: "#root",
});
