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
    
    // Grab 5 unique categories from our object above and display them on game page
    const categories = document.querySelectorAll('.category');
    const jCategoryArrayKeys = Object.keys(jServiceCategories);
    categories.forEach((category) => {
        checkUnique(category, jCategoryArrayKeys);
    });

    // When any clue cell is clicked ...
    const cells = document.querySelectorAll('.cell');
    cells.forEach((cell) => {
        cell.addEventListener("click", (e) => {
            // Display question, enable submit button, refresh answer field in form, etc.
            let answer = document.getElementById('answer');
            let submitButton = document.getElementById('submit');

            answer.value = "";
            answer.focus();

            submitButton.disabled = false;
            submitButton.textContent = "Submit";
            submitButton.className = "submit";

            const thisCell = e.target;
            const cellClassList = thisCell.classList;

            // This determines the category the clicked clue is under and calls next function
            // Function chain: questionSwitch > placeCategory > grabQuestion > apiCall > placeQuestion ...
            // placeQuestion calls both postButtonQuestion and moveMonster (which calls confetti() on win)
            questionSwitch(thisCell, cellClassList);
        });
    })

    // Welcome Page JS
    const playButton = document.getElementById('play-button');
    const instructionsButton = document.getElementById('instructions-button');

    playButton.addEventListener('click', toggleView);
    instructionsButton.addEventListener('click', toggleView);

    function toggleView() {
        const welcomePage = document.getElementById('wrap-welcome');
        const gamePage = document.getElementById('wrap-main');
        if (welcomePage.style.display === "block") {
            welcomePage.style.display = "none";
            gamePage.style.display = "block";
        } else if (welcomePage.style.display === "none") {
            welcomePage.style.display = "block";
            gamePage.style.display = "none";
        }
    }

    /**
     *  FUNCTIONS (in approx. order of use)
     */

    // Check categories for uniqueness
    function checkUnique(category, jCategoryArrayKeys) {
        let uniqueCategories = [];
        (function loopUnique() {
            // When we have found all five successfully, exit function
            if (uniqueCategories.length === 5) { return; }

            const randomKey = jCategoryArrayKeys[Math.floor(Math.random() * jCategoryArrayKeys.length)]
            const redundantKey = Boolean(uniqueCategories.find((el) => el === randomKey));
            if (redundantKey) {
                loopUnique(category);
                return;
            }
            else if (!redundantKey) {
                uniqueCategories.push(randomKey);
                category.textContent = randomKey;
                return;
            }
        })();
    }

    // Determines the category a cell belongs to, then places category on the page
    function questionSwitch(thisCell, cellClassList) {
        switch (true) {
            case (cellClassList.contains("category-1-cell")):
                placeCategory(1, thisCell);
                break;
            case (cellClassList.contains("category-2-cell")):
                placeCategory(2, thisCell);
                break;
            case (cellClassList.contains("category-3-cell")):
                placeCategory(3, thisCell);
                break;
            case (cellClassList.contains("category-4-cell")):
                placeCategory(4, thisCell);
                break;
            case (cellClassList.contains("category-5-cell")):
                placeCategory(5, thisCell);
                break;
            default:
                break;
        }
    }

    // Places a determined category on the page, then grab a valid corresponding question
    function placeCategory(num, thisCell) {
        let category = document.getElementById(`category${num}`).textContent;
        grabQuestion(thisCell, category);
    }

    // Determines the difficulty, then calls the api to find a question
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

    // Takes a category and difficulty, and returns a question
    function apiCall(category, difficultyValue) {
        const category_id = jServiceCategories[category];
        fetch(`https://jservice.io/api/category?id=${category_id}`)
            .then(r => r.json())
            .then(categoryObj => {
                let clueList = categoryObj.clues.filter(clue => {
                    const difficultyBool = ((clue.value <= difficultyValue) && (clue.value > difficultyValue - 200));
                    const vettedQuestion = !(clue.question.toLowerCase().includes("as seen in"));
                    return (difficultyBool && vettedQuestion);
                });

                const question = clueList[Math.floor(Math.random() * clueList.length)];
                placeQuestion(question, difficultyValue);
            })
            .catch(e => console.error(`There was an error with fetch in apiCall: ${e}`));
    }

    // Now we'll display the question instead of the game board
    let latestQuestion;
    let difficultyValue;
    function placeQuestion(question, dValue) {
        latestQuestion = question;
        difficultyValue = dValue;

        let answerContainer = document.getElementById('answer');
        let wrapQuestion = document.getElementById('wrap-question');
        const boardHeight = document.getElementById('trivia-board').scrollHeight;

        document.getElementById('question').textContent = question.question;
        answerContainer.style.display = "inline";

        wrapQuestion.style.height = `${boardHeight-96}px`;
        wrapQuestion.style.display = 'block';
        document.getElementById('categories').style.display = 'none';
        document.getElementById('clues').style.display = 'none';
        console.log(question.answer.replace(/<[^>]*>?/gm, '').replace(/"/g, '').replace(/'/g, ''));
    }
        
    // Submit Button: listen for guess submitted (or a click to see game board again)
    const form = document.getElementById('form')
    form.addEventListener('submit', e => {
        e.preventDefault();

        // If className returns "submit" we are not already displaying another question and can proceed.
        let submitClass = document.getElementById('submit').className

        if (submitClass === "submit") {
            const answerInput = document.getElementById('answer').value;
            const checkMatch = stringAnalysis(latestQuestion, answerInput);

            switch (difficultyValue) {
                case "600":
                    monsterMove = 30;
                    break;
                case "400":
                    monsterMove = 20;
                    break;
                case "200":
                    monsterMove = 10;
                    break;
                default:
                    monsterMove = 0;
                    console.log("Could not calculate monsterMove.");
                    break;
            }
            
            if (checkMatch) {
                moveMonster(monsterMove, "forward");
                postQuestionButton("right");
            }
            else {
                moveMonster(monsterMove, "backward");
                postQuestionButton("wrong");
            }
        }
        else {
            // If that className wasn't "submit", we have changed the className to indicate
            // that user is ready to see board again after attempting an answer. Diplay the board:
            document.getElementById('wrap-question').style.display = 'none';
            document.getElementById('categories').style.display = 'contents';
            document.getElementById('clues').style.display = 'contents';
        }
    });

    function postQuestionButton(buttonColor) {
        let submitButton = document.getElementById('submit');
        submitButton.textContent = "Try another one!";
        document.getElementById('answer').style.display = "none";
                
        if (buttonColor==="wrong") {
            submitButton.className = "answer-wrong";
        } 
        else if (buttonColor === "right") {
            submitButton.className = "answer-right";
        }
    }

    // Moves the monster to the left or right after a guess
    function moveMonster(monsterMove, direction) {
        let question = document.getElementById('question');
        let monster = document.getElementById("cookie-monster");

        let monsterLeft = monster.style.marginLeft;
        let monsterLeftNum = parseInt(monsterLeft, 10);

        if (direction === "forward"){
            question.textContent = "Phew! Correct. That much closer to the cookies!";
            const left = monsterLeftNum + monsterMove;
            if (left>=90){
                monster.style.marginLeft = `90%`;
                confetti();
                question.textContent = "You did it! And I think you made a friend along the way!!";
                document.getElementById('monster-win-wrap').style.display = "contents";
                document.getElementById('wrap-question').style.height = "375px";
                document.getElementById('submit').style.visibility = "hidden";
            }
            else {
                monster.style.marginLeft = `${left}%`;
                monster.classList.add('forward-wiggle');
                setTimeout(()=>{monster.classList.remove('forward-wiggle');}, 3000);
            }
        }

        else if (direction === "backward"){
            question.textContent = "Wahhh! That was incorrect!";
            const left = monsterLeftNum - monsterMove;
            if (left<0){
                monster.style.marginLeft = `0%`;
                monster.classList.add('backward-wiggle');
                setTimeout(()=>{monster.classList.remove('backward-wiggle');}, 3000);
            }
            else {
                monster.style.marginLeft = `${left}%`;
                monster.classList.add('backward-wiggle');
                setTimeout(()=>{monster.classList.remove('backward-wiggle');}, 3000);
            }
        }
    }
});

// Strings matching analysis
function stringAnalysis(latestQuestion, answerInput) {
    // I'm using regex here. Test of puncuation removal:
    // console.log(`<em>~!@#$%^&*!@#$%^&*()_-+={.,,,....}|:";'<>"'(),:;+.Hello World!</em>`.replace(/<[^>]*>?/gm, '').replace(/[~!@#$%^&*()_+-={}|;"']/g, ''));

    // remove puncuation and awkward markup tags from the ANSWER from the API
    const noPunctuationAnswer = latestQuestion.answer.replace(/<[^>]*>?/gm, '').replace(/[~!@#$%^&*()_+-={}|;"']/g, '');
    const lowerCaseAnswer = noPunctuationAnswer.toLowerCase();

    // remove puncuation and awkward markup tags from the INPUT from the USER
    const noPunctuationInput = answerInput.replace(/<[^>]*>?/gm, '').replace(/[~!@#$%^&*()_+-={}|;"']/g, '');
    const lowerCaseInput = noPunctuationInput.toLowerCase();

    // If the answer is only 1 or 2 letters, then just see if it's inlcuded in the input 
    // and make sure input is sufficiently short
    if (lowerCaseAnswer.length < 3){
        return lowerCaseInput.includes(lowerCaseAnswer) && (lowerCaseInput.length < 4);
    }
    // Else let's do some fancier string analysis
    else {
        const levDist = levenshteinDistance(lowerCaseAnswer, lowerCaseInput);

        const substring = longestCommonSubstring(lowerCaseAnswer, lowerCaseInput);

        // If Lev dist is < 2 -OR- longest matching string >= 5, assume good answer. Test.
        return (levDist < 3 || substring > 4) ? true : false;
    }
}


// Calculates Levenshtein Distance (num of insertions, deletions, and subs)
function levenshteinDistance(lowerCaseAnswer = "", lowerCaseInput = "") {
    // This creates a matrix. Every element of the "track" array is itself an array
    const matrix = Array(lowerCaseInput.length + 1).fill(null).map(() =>
        Array(lowerCaseAnswer.length + 1).fill(null)
    );
    // Fill the first array of the matrix with 0 to lowerCaseAnswer.length numbers
    for (let i = 0; i <= lowerCaseAnswer.length; i++) {
        matrix[0][i] = i;
    }
    for (let j = 0; j <= lowerCaseInput.length; j++) {
        matrix[j][0] = j;
    }
    for (let j = 1; j <= lowerCaseInput.length; j++) {
        for (let i = 1; i <= lowerCaseAnswer.length; i++) {
            const charMatchValue = (lowerCaseAnswer[i - 1] === lowerCaseInput[j - 1]) ? 0 : 1;
            matrix[j][i] = Math.min(
                matrix[j][i - 1] + 1, // deletion
                matrix[j - 1][i] + 1, // insertion
                matrix[j - 1][i - 1] + charMatchValue, // substitution
            );
        }
    }
    return matrix[lowerCaseInput.length][lowerCaseAnswer.length];
};

// Example for lowerCaseAnswer = "apple" and lowerCaseInput = "app"
/**                          MATRIX REPRESENTATIONS                         */

//                                    1-D          

/**
 *  [ [ 0, 1, 2, 3, 4, 5 ], [ 1, 0, 1, 2, 3, 4 ], [ 2, 1, 0, 1, 2, 3 ], [ 3, 2, 1, 0, 1, 2 ] ]
 */

//                                    2-D
/**    
 * 
                            [    ""  a  p  p  l  e
                             "" [ 0, 1, 2, 3, 4, 5 ],
                             a  [ 1, 0, 1, 2, 3, 4 ],
                             p  [ 2, 1, 0, 1, 2, 3 ],
                             p  [ 3, 2, 1, 0, 1, 2 ]
                            ]
 * 
 */

// Calculates the longest matching substring given an array of strings
function longestCommonSubstring(s1, s2) {
    let shorter = s1.length > s2.length ? s2 : s1;
    let longer = s1.length < s2.length ? s2 : s1;
    if (shorter === "" || longer === "") { return 0 }
    for (let end = shorter.length; end > 0; end--) {
        // ruler = shorter.length to 1
        // # of shifts along the string = ruler = shorter.length
        for (let beg = 0; beg <= shorter.length - end; beg++) {
            if (longer.includes(shorter.slice(beg, end + beg))) {
                return end - beg;
            }
        }
    }
}

// Party time!! This code was gratefully borrowed (free source) from the itnerwebs. 
// There are no more functions below confetti() in this doc.
function confetti() {
    class Progress {
    constructor(param = {}) {
      this.timestamp        = null;
      this.duration         = param.duration || Progress.CONST.DURATION;
      this.progress         = 0;
      this.delta            = 0;
      this.progress         = 0;
      this.isLoop           = !!param.isLoop;

      this.reset();
    }

    static get CONST() {
      return {
        DURATION : 1000
      };
    }

    reset() {
      this.timestamp = null;
    }

    start(now) {
      this.timestamp = now;
    }

    tick(now) {
      if (this.timestamp) {
        this.delta    = now - this.timestamp;
        this.progress = Math.min(this.delta / this.duration, 1);

        if (this.progress >= 1 && this.isLoop) {
          this.start(now);
        }

        return this.progress;
      } else {
        return 0;
      }
    }
    }

    class Confetti {
    constructor(param) {
      this.parent         = param.elm || document.body;
      this.canvas         = document.createElement("canvas");
      this.ctx            = this.canvas.getContext("2d");
      this.width          = param.width  || this.parent.offsetWidth;
      this.height         = param.height || this.parent.offsetHeight;
      this.length         = param.length || Confetti.CONST.PAPER_LENGTH;
      this.yRange         = param.yRange || this.height * 2;
      this.progress       = new Progress({
        duration : param.duration,
        isLoop   : true
      });
      this.rotationRange  = typeof param.rotationLength === "number" ? param.rotationRange
                                                                      : 10;
      this.speedRange     = typeof param.speedRange     === "number" ? param.speedRange
                                                                      : 10;
      this.sprites        = [];

      this.canvas.style.cssText = [
        "display: block",
        "position: absolute",
        "top: 0",
        "left: 0",
        "pointer-events: none"
      ].join(";");

      this.render = this.render.bind(this);

      this.build();

      this.parent.appendChild(this.canvas);
      this.progress.start(performance.now());

      requestAnimationFrame(this.render);
    }

    static get CONST() {
      return {
          SPRITE_WIDTH  : 13,
          SPRITE_HEIGHT : 20,
          PAPER_LENGTH  : 100,
          DURATION      : 20000,
          ROTATION_RATE : 50,
          COLORS        : [
            "#EF5350",
            "#EC407A",
            "#AB47BC",
            "#7E57C2",
            "#5C6BC0",
            "#42A5F5",
            "#29B6F6",
            "#26C6DA",
            "#26A69A",
            "#66BB6A",
            "#9CCC65",
            "#D4E157",
            "#FFEE58",
            "#FFCA28",
            "#FFA726",
            "#FF7043",
            "#8D6E63",
            "#BDBDBD",
            "#78909C"
          ]
      };
    }

    build() {
      for (let i = 0; i < this.length; ++i) {
        let canvas = document.createElement("canvas"),
            ctx    = canvas.getContext("2d");

        canvas.width  = Confetti.CONST.SPRITE_WIDTH;
        canvas.height = Confetti.CONST.SPRITE_HEIGHT;

        canvas.position = {
          initX : Math.random() * this.width,
          initY : -canvas.height - Math.random() * this.yRange
        };

        canvas.rotation = (this.rotationRange / 2) - Math.random() * this.rotationRange;
        canvas.speed    = (this.speedRange / 2) + Math.random() * (this.speedRange / 2);

        ctx.save();
          ctx.fillStyle = Confetti.CONST.COLORS[(Math.random() * Confetti.CONST.COLORS.length) | 0];
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.restore();

        this.sprites.push(canvas);
      }
    }

    render(now) {
      let progress = this.progress.tick(now);

      this.canvas.width  = this.width;
      this.canvas.height = this.height;

      for (let i = 0; i < this.length; ++i) {
        this.ctx.save();
          this.ctx.translate(
            this.sprites[i].position.initX + this.sprites[i].rotation * Confetti.CONST.ROTATION_RATE * progress,
            this.sprites[i].position.initY + progress * (this.height + this.yRange)
          );
          this.ctx.rotate(this.sprites[i].rotation);
          this.ctx.drawImage(
            this.sprites[i],
            -Confetti.CONST.SPRITE_WIDTH * Math.abs(Math.sin(progress * Math.PI * 2 * this.sprites[i].speed)) / 2,
            -Confetti.CONST.SPRITE_HEIGHT / 2,
            Confetti.CONST.SPRITE_WIDTH * Math.abs(Math.sin(progress * Math.PI * 2 * this.sprites[i].speed)),
            Confetti.CONST.SPRITE_HEIGHT
          );
        this.ctx.restore();
      }

      requestAnimationFrame(this.render);
    }
    }

    let body = document.body;
    let html = document.documentElement;

    let height = Math.max( body.scrollHeight, body.offsetHeight, 
                      html.clientHeight, html.scrollHeight, html.offsetHeight );

    (() => {
    const DURATION = 20000,
          LENGTH   = 120;

    new Confetti({
      width    : window.innerWidth,
      height   : height,
      length   : LENGTH,
      duration : DURATION
    });

    setTimeout(() => {
      new Confetti({
        width    : window.innerWidth,
        height   : height,
        length   : LENGTH,
        duration : DURATION
      });
    }, DURATION / 2);
    })();
}