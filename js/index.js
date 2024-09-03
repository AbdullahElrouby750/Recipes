"use strict";
//by category request : 
//https://forkify-api.herokuapp.com/api/search?q=(example)

//by recipe id request :
//https://forkify-api.herokuapp.com/api/get?rId=(id)


const search = document.querySelector('input');
const select = document.querySelector('select');
const cardsArea = document.querySelector("#recipes");
const errMsg = document.querySelector(".err");
const notFoundTarget = document.querySelector("span");


//recipes
const recipes = [
    "apple",
    "apricot",
    "artichoke",
    "arepas",
    "avocado",
    "banana",
    "basil",
    "bean",
    "beef",
    "beetroot",
    "blackberry",
    "blackcurrant",
    "blueberry",
    "boysenberry",
    "bunny chow",
    "cake",
    "cabbage",
    "caramel",
    "carrot",
    "champ",
    "chicken",
    "chili",
    "chocolate",
    "cinnamon",
    "coconut",
    "corinader",
    "croissant",
    "cucumber",
    "curry",
    "dill",
    "donuts",
    "duck",
    "eggplant",
    "fajitas",
    "fig",
    "fish",
    "fries",
    "garlic",
    "grape",
    "grapefruit",
    "green bean",
    "green pepper",
    "guacamole",
    "hamburger",
    "hummus",
    "ice cream",
    "Italian",
    "kale",
    "ketchup",
    "kiwifruit",
    "lamb",
    "lasagna",
    "leek",
    "lemon",
    "lentil",
    "lime",
    "lobster",
    "mango",
    "maple syrup",
    "marzipan",
    "melon",
    "mushrooms",
    "nectarine",
    "onion",
    "orange",
    "oregano",
    "paella",
    "pancake",
    "parma ham",
    "passion fruit",
    "peach",
    "pear",
    "pineapple",
    "plum",
    "pomegranate",
    "potato",
    "poutine",
    "pudding",
    "quinoa",
    "radish",
    "raspberry",
    "red pepper",
    "rendang",
    "ribs",
    "salami",
    "salad",
    "sausage",
    "saffron",
    "seafood",
    "sesame",
    "som tam",
    "sushi",
    "sweet potato",
    "tofu",
    "tomato",
    "turkey",
    "watermelon",
    "zucchini"
];




//http requests
const myHttp = new XMLHttpRequest;

//default is ''/'text'
myHttp.responseType = 'json';

//testing the API
/*
myHttp.open('GET', 'https://forkify-api.herokuapp.com/api/get?rId=47746');
myHttp.send();


onload and onreadystatechange are ready event listeners
use if tracking requests states needed
myHttp.onreadystatechange = function() { //triggered every readyState Change (4x)

    if(this.readyState === 4 && this.status === 200) {
        depends on responseType
        if responseType = '' then return a string (like responsText)
        no need to parse it if responseType = 'json'
        console.log('response: ',this.response);
        
        
        always string
        wont work unless responseType = 'text' or ''
        throw an error otherwise
        console.log('responseText: ',JSON.parse(this.responseText));
        
        const recipe = JSON.parse(this.responseText).recipe;
        console.log(recipe);
    }
}

myHttp.onload = function() {//triggered only after readyState  === 4
    if(this.status === 200) {
        const recipe = this.response.recipe;
        console.log(recipe);
    }
}*/


const storedRecipes = localStorage.getItem("recipes") ? JSON.parse(localStorage.getItem("recipes")) : {};
let firstVisit = true;
//displaying recommendation or pizza recipes if first visit as default
Object.keys(storedRecipes).length === 0 ? searchForRecipe("pizza") : displayRecommendedRecipes();


//Methods
recipes.forEach(recipe => {
    const option = document.createElement('option');
    option.value = recipe;
    option.textContent = recipe;
    select.appendChild(option);
});

function searchForRecipe(query) {


    myHttp.open('GET', `https://forkify-api.herokuapp.com/api/search?q=${query}`);
    myHttp.send();
    errMsg.classList.add("d-none")

    myHttp.onload = function () {
        
        if (this.status === 200) {
            const recipes = this.response.recipes;

            //!if the first visit dont add
            if (!firstVisit) addToLocalStorage(recipes, query);
            firstVisit = false;
            displayRecipe(recipes);
        }
        else{

            cardsArea.innerHTML = "";
            notFoundTarget.textContent = query + "!";
            errMsg.classList.remove("d-none")
            console.log("inside else", myHttp.status);
        }

    }

}

function displayRecipe(recipe) {
    // clear previous cards
    cardsArea.innerHTML = '';

    // create new card for each recipe
    recipe.forEach(recipe => {
        const htmltext = `<div class="col-md-4 p-2 wrapper">
                <div class="card h-100 bg-dark">
                    <img class="card-img-top" src="${recipe.image_url}" alt="${recipe.title} ${recipe.recipe_id}">
                    <div class="card-body d-flex flex-column justify-content-between">
                        <h3 class="card-title mb-2">${recipe.title}</h3>
                        <p><b>Recipe Id:</b> ${recipe.recipe_id}</p>
                        <p><b>puplisher:</b> ${recipe.publisher}</p>
                        <p><b>Social Rank:</b> ${recipe.social_rank.toFixed(6)}</p>
                        <a class = " text-decoration-none" href="${recipe.source_url}"><b>View Recipe</b> </a>
                    </div>
                </div>
            </div>`;
        cardsArea.innerHTML += htmltext;
    });

}

function addToLocalStorage(recipe, recipeCategory) {
    if (!storedRecipes.hasOwnProperty(recipeCategory)) {
        storedRecipes[recipeCategory] = recipe;
        localStorage.setItem("recipes", JSON.stringify(storedRecipes));
    }
}

function displayRecommendedRecipes() {

    // clear previous cards
    cardsArea.innerHTML = '';

    // create 30 recommended card for each recipe
    const storedRecipesArr = Object.values(storedRecipes);
    const recipesCount = storedRecipesArr.length;

    const recommendedRecipes = [];
    storedRecipesArr.forEach((recipes, index) => {
        if (recipesCount >= 30) {
            if (index <= 30) recommendedRecipes.push(recipes[0]);
        }
        else {
            const splicedArr = recipes.slice(0, (30 / recipesCount));

            recommendedRecipes.push(...splicedArr);
        }
    });
    //random sorting
    recommendedRecipes.sort((a, b) => a.title.localeCompare(b.title));

    displayRecipe(recommendedRecipes);
}

select.addEventListener('change', (event) => {
    errMsg.classList.add("d-none")
    const selectedRecipe = event.target.value;
    if (selectedRecipe != "random") {

        myHttp.open('GET', `https://forkify-api.herokuapp.com/api/search?q=${selectedRecipe}`);
        myHttp.send();

        myHttp.onload = function () {
            if (this.status === 200) {
                const recipes = this.response.recipes;
                addToLocalStorage(recipes, selectedRecipe);
                displayRecipe(recipes);
            }
        }
    }
    else {
        displayRecommendedRecipes();
    }
});


search.addEventListener('blur', () => {
    console.log("hii");

    const searchQuery = search.value.trim().toLowerCase();
    if (searchQuery) searchForRecipe(searchQuery);
})
search.addEventListener("keypress", event => {
    if (event.key == 'Enter') {
        event.preventDefault();
        search.blur();
    }
});