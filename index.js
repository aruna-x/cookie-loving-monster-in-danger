const jServiceCategories = {
    "Potpourri": 306,
    "Stupid Answers": 136,
    "Sports": 42,
    "American History": 780,
    "Animals": 21,
    "3 Letter Words": 105,
    "Science": 25,
    "Transportation": 103,
    "U.S. Cities": 7,
    "People": 442,
    "Television": 67,
    "Food": 49,
    "State Capitals": 109,
    "History": 114,
    "The Bible": 31
}


document.addEventListener("DOMContentLoaded", () => {
    const categories = document.querySelectorAll('.category');
    const jCategoryArrayKeys = Object.keys(jServiceCategories);
    const uniqueCategories= [];
    categories.forEach((category)=>{
        checkUnique(category);
    });

    function checkUnique(category) {
        if (uniqueCategories.length === 5) { return; }

        const randomKey = jCategoryArrayKeys[Math.floor(Math.random() * jCategoryArrayKeys.length)]
        const redundantKey = Boolean(uniqueCategories.find((el)=> el === randomKey));
        if (redundantKey) {
            checkUnique(category);
            return;
        }
        else if (!redundantKey) {
            uniqueCategories.push(randomKey);
            category.textContent = randomKey;
            return;
        }
    }

    const cells = document.querySelectorAll('.cell');

    // categories.forEach(() => {})
    cells.forEach((cell)=>{
        cell.addEventListener("click", (e) => {
            const thisCell = e.target;
            const cellClassList = thisCell.classList;
            questionSwitch(thisCell, cellClassList);
        });
    })

    function questionSwitch(thisCell, cellClassList) {
        let category;
        switch (true) {
            case (cellClassList.contains("category-1-cell")):
                category = document.getElementById('category1').textContent;
                grabQuestion(thisCell, category);
                break;
            case (cellClassList.contains("category-2-cell")):
                category = document.getElementById('category2').textContent;
                grabQuestion(thisCell, category);
                break;
            case (cellClassList.contains("category-3-cell")):
                category = document.getElementById('category3').textContent;
                grabQuestion(thisCell, category);
                break;
            case (cellClassList.contains("category-4-cell")):
                category = document.getElementById('category4').textContent;
                grabQuestion(thisCell, category);
                break;
            case (cellClassList.contains("category-5-cell")):
                category = document.getElementById('category5').textContent;
                grabQuestion(thisCell, category);
                break;
            default:
                console.log("Something went wrong with questionSwitch!");
                break;
        }
    }

    function grabQuestion(thisCell, category) {
        const difficulty = thisCell.textContent;
        switch (difficulty) {
            case ("Easy"):
                apiCall(category, "200");
                break;
            case ("Medium"):
                apiCall(category, "400");
                break;
            case ("Hard"):
                apiCall(category, "600");
                break;
        }
    }

    // Takes a category and difficulty and returns a question
    function apiCall(category, difficultyValue) {
        // TODO pull in categories for a session, and pass in the object here. It will have an id.
        const category_id = jServiceCategories[category];
        fetch(`https://jservice.io/api/category?id=${category_id}`)        
            .then(r => r.json())
            .then(categoryObj => {
                let clueList = categoryObj.clues.filter(x => {
                    return((x.value <= difficultyValue) && (x.value > difficultyValue-200));
                });
                question = clueList[Math.floor(Math.random() * clueList.length)];
                placeQuestion(question);
            })
            .catch(e => console.error(`There was an error with fetch in apiCall: ${e}`));
    }

    function placeQuestion(question) {
        let questionContainer = document.getElementById('question');
        questionContainer.textContent = question.question;
        
    }
});