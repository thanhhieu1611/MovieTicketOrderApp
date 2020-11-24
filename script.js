//#region Create middle elements
//Array of each order info
//var orders = [];
var movieid = 0;
var nummovie = 6;
//#endregion

//#region
//Create a Vue Card component
Vue.component('moviecard', {
    data: function(){
        return{
            movtitle: "",
            adultquantity: 0,
            childquantity: 0,
            total: 0.0
        }
    },
    template: `
        <div class="card" style="width: 18rem;">
            <img :src="imgsrc" class="card-img-top" alt="Movie Poster" data-toggle="tooltip" data-placement="right" :title="content">
            <div class="card-body">
                <h5 class="card-title">{{title}}</h5>
                
                <div class="input-group mb-3">
                    <div class="input-group-prepend">
                        <label class="input-group-text" for="inputGroupSelect01">Quantity</label>
                    </div>

                    <select class="custom-select" id="inputGroupSelect01" @change="selectquantity" name="adult">
                        <option selected>Adult</option>
                        <option value="0">None</option>
                        <option value="1">One</option>
                        <option value="2">Two</option>
                        <option value="3">Three</option>
                    </select>  

                    <select class="custom-select" id="inputGroupSelect01" @change="selectquantity" name="child">
                        <option selected>Child</option>
                        <option value="0">None</option>
                        <option value="1">One</option>
                        <option value="2">Two</option>
                        <option value="3">Three</option>
                    </select>

                    <button type="button" class="btn btn-primary" :value="title" @click="addtocart" id="addBtn">Add To Cart</button>
                    
                </div>     
            </div>
        </div> 
    `,
    props: ['title', 'content', 'imgsrc'],
    methods:{
        //Click event method to add item to cart
        addtocart: function(event){
            this.movtitle = event.target.value;
            //Push data into orders array
            if(this.movquantity > 0){
                var newdata = {movieid: this.addid, movietit: this.movtitle, adultquan: this.adultquantity, childquan: this.childquantity, subtotal: this.subtotal};
                //Access to Vue Obj data
                app.addmovie(newdata);
                //console.log(newdata);
                
            } else{
                //console.log("Please select quantity for '" + this.movtitle + "' movie!");
                throw "Please select quantity for the movie or remove the item from the cart!"
            }
        },
        
        //select quantity event
        selectquantity: function(event){
            if(event.target.name == "child"){
                //console.log(event.target.name);
                this.childquantity = parseInt(event.target.value);
            }else if(event.target.name == "adult"){
                //console.log(event.target.name);
                this.adultquantity = parseInt(event.target.value);
            }
        }
    },
    computed: {
        movquantity: function(){
            return this.adultquantity + this.childquantity;
        },
        subtotal: function(){
            return (this.adultquantity * 6.99) + (this.childquantity * 3.99)
        },
        addid: function(){
            movieid++;
            //console.log(movieid);
            return movieid;
            
        }
    }
})


//#endregion

//#region Create Vue objects
const app = new Vue({
    el: '#app',
    data: {
        len: nummovie,
        movies: '',
        showmovies: [],
        ordermovies: [],
        showtable: false
    },
    mounted(){
        //Load Vue and then get data from themoviedb
        axios.get('https://api.themoviedb.org/3/movie/now_playing?api_key=58223e665e617d4feca2a4cd2ace7061&language=en-US&page=1')
        //Apply data to info as a array of movie infos and showmovies
        .then((response) => {
            this.movies = response.data.results;
            for(var i = 0; i < this.len; i++){
                this.showmovies.push(this.movies[i]);
            }
            
        })
    },
    methods: {
        addmovie: function(newdata){
            var sameselectmovie = false;
            var repeatmovid = 0;
            //check to see whethere selected movie is repeated
            for(var i = 0; i < this.ordermovies.length; i++){
                if(newdata.movietit == this.ordermovies[i].movietit){
                    sameselectmovie = true;
                    repeatmovid = this.ordermovies[i].movieid;
                    console.log("same selected movie");
                    break;
                }
            }
            //Add new data to table
            if(sameselectmovie == true){
                this.ordermovies[repeatmovid - 1].adultquan = newdata.adultquan;
                this.ordermovies[repeatmovid - 1].childquan = newdata.childquan;
                this.ordermovies[repeatmovid - 1].subtotal = newdata.subtotal;
            } else{
                this.ordermovies.push(newdata);
            }
            
           
        },
        removeitem: function(event){
            //console.log("in remove item");
            console.log(event.target.value);
            var remid = event.target.value - 1;
            this.ordermovies.splice(remid, 1);
            for(var i = remid; i < this.ordermovies.length; i++){
                this.ordermovies[i].movieid--;
            }           
        }
    },
    computed: {
        caltotal: function(){
            var total = 0.0;
            for(var i = 0; i < this.ordermovies.length; i++){
                total += this.ordermovies[i].subtotal;
                //console.log("in caltotal");
                
            }
            return total;
        },
        checkshoworder: function(){
            if(this.ordermovies.length > 0){
                this.showtable = true;
            } else{
                this.showtable = false;
            }
            return this.showtable;
        }
    }
});
//#endregion