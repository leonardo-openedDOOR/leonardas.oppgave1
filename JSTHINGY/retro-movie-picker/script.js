const movies = [
    {
        title: "The Dark Knight",
        genre: "action",
        year: 2008,
        rating: 9,
        mood: "dark"
    },
    {
        title: "whiplash",
        genre: "drama",
        year: 2014,
        rating: 8,
        mood: "serious"
    },
    {
        title: "home alone",
        genre: "comedy",
        year: 1990,
        rating: 7,
        mood: "light"
    }
];

// Function with two parameters
function meetsRating(rating, minimum) {
    return rating >= minimum;
}

// Function to format the movie result
function formatMovie(title, year) {
    return title + " (" + year + ")";
}

document.querySelector("#pick-movie").addEventListener("click", function() {
    const selectedGenre = document.querySelector("#genre").value;
    const selectedMood = document.querySelector("#mood").value;
    const selectedRating = parseInt(document.querySelector("#rating").value);

    const matchingMovies = [];

    // For loop checks every movie
    for (let i = 0; i < movies.length; i++) {
        const movie = movies[i];

        if (
            movie.genre === selectedGenre &&
            movie.mood === selectedMood &&
            meetsRating(movie.rating, selectedRating)
        ) {
            matchingMovies.push(movie);
        }
    }

    // While loop displays matching movies in console
    let count = 0;

    while (count < matchingMovies.length) {
        console.log("Matching movie: " + matchingMovies[count].title);
        count++;
    }

    const result = document.querySelector("#movie-result");

    // Select a random matching movie
    if (matchingMovies.length > 0) {
        const randomIndex = Math.floor(Math.random() * matchingMovies.length);
        const selectedMovie = matchingMovies[randomIndex];

        result.textContent = formatMovie(selectedMovie.title, selectedMovie.year);
        result.style.color = "lightgreen";
    } else {
        result.textContent = "No matching movies found.";
        result.style.color = "red";
    }

    // Switch statement checks selected genre
    switch (selectedGenre) {
        case "action":
            console.log("Action movie selected");
            break;

        case "comedy":
            console.log("Comedy movie selected");
            break;

        default:
            console.log("Another genre selected");
    }
});