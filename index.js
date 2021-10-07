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
    const uniqueCategories = [];
    categories.forEach((category) => {
        checkUnique(category);
    });

    function checkUnique(category) {
        if (uniqueCategories.length === 5) { return; }

        const randomKey = jCategoryArrayKeys[Math.floor(Math.random() * jCategoryArrayKeys.length)]
        const redundantKey = Boolean(uniqueCategories.find((el) => el === randomKey));
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

    cells.forEach((cell) => {
        cell.addEventListener("click", (e) => {
            // When a clue is clicked, enable the button and automatically move cursor to answer input field
            document.getElementById('answer').value = "";
            document.getElementById('submit').disabled = false;
            document.getElementById('submit').textContent = "Submit";
            document.getElementById('submit').className = "submit";
            document.getElementById('answer').focus();
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
                placeQuestion(question);
            })
            .catch(e => console.error(`There was an error with fetch in apiCall: ${e}`));
    }

    let latestQuestion;

    function placeQuestion(question) {
        latestQuestion = question;
        let questionContainer = document.getElementById('question');
        questionContainer.textContent = question.question;
        document.getElementById('answer').style.display = "inline";

            const boardHeight = document.getElementById('trivia-board').scrollHeight;
            document.getElementById('wrap-question').style.height = `${boardHeight-96}px`;
            document.getElementById('wrap-question').style.display = 'block';
            document.getElementById('categories').style.display = 'none';
            document.getElementById('clues').style.display = 'none';
            console.log(question.answer.replace(/<[^>]*>?/gm, '').replace(/"/g, '').replace(/'/g, ''));
        }
        
        const form = document.getElementById('form')
        form.addEventListener('submit', e => {
            e.preventDefault();

            let submitClass = document.getElementById('submit').className

            if (submitClass === "submit") {
                const answerInput = document.getElementById('answer').value;
                const difficulty = latestQuestion.value;
            
                if (difficulty > 400) {
                    monsterMove = 30;
                } else if (difficulty > 200 && difficulty <= 400) {
                    monsterMove = 20;
                } else if (difficulty <= 200) {
                    monsterMove = 10;
                }
                
                const checkMatch = stringAnalysis(latestQuestion, answerInput);

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
            document.getElementById('wrap-question').style.display = 'none';
            document.getElementById('categories').style.display = 'contents';
            document.getElementById('clues').style.display = 'contents';
        }

            function postQuestionButton(buttonColor) {
                document.getElementById('answer').style.display = "none";
                document.getElementById('submit').textContent = "Try another one!";
                if (buttonColor==="wrong") {
                    document.getElementById('submit').className = "answer-wrong";
                } 
                else if (buttonColor === "right") {
                    document.getElementById('submit').className = "answer-right";
                }
        }
    });

        function moveMonster(monsterMove, direction) {
            let monsterLeft = document.getElementById("cookie-monster").style.marginLeft;
            let monsterLeftNum = parseInt(monsterLeft, 10);
            if (direction === "forward"){
                document.getElementById('question').textContent = "Phew! Correct. That much closer to the cookies!";
                const left = monsterLeftNum + monsterMove;
                if (left>=90){
                    document.getElementById("cookie-monster").style.marginLeft = `90%`;
                    confetti();
                    document.getElementById('question').textContent = "You did it! And I think you made a friend along the way!!";
                    document.getElementById('monster-win-wrap').style.display = "contents";
                    document.getElementById('wrap-question').style.height = "375px";
                    document.getElementById('submit').style.visibility = "hidden";
                }
                else {
                    document.getElementById("cookie-monster").style.marginLeft = `${left}%`;
                    document.getElementById("cookie-monster").classList.add('forward-wiggle');
                    setTimeout(()=>{document.getElementById("cookie-monster").classList.remove('forward-wiggle');}, 3000);
                }
            }
            else if (direction === "backward"){
                document.getElementById('question').textContent = "Wahhh! That was incorrect!";
                const left = monsterLeftNum - monsterMove;
                if (left<0){
                    document.getElementById("cookie-monster").style.marginLeft = `0%`;
                    document.getElementById("cookie-monster").classList.add('backward-wiggle');
                    setTimeout(()=>{document.getElementById("cookie-monster").classList.remove('backward-wiggle');}, 3000);
                }
                else {
                    document.getElementById("cookie-monster").style.marginLeft = `${left}%`;
                    document.getElementById("cookie-monster").classList.add('backward-wiggle');
                    setTimeout(()=>{document.getElementById("cookie-monster").classList.remove('backward-wiggle');}, 3000);
                }
        }
    }

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
});

/**
 *  HELPER FUNCTIONS
 */

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

    // Get Levenshtein distance (criteria <= 2 ?)
    // This accounts for misspellings
    const levDist = levenshteinDistance(lowerCaseAnswer, lowerCaseInput);

    // Get longest matching string (criteria >= 5 ?)
    // This accounts for missing words
    const substring = commonSubstring(lowerCaseAnswer, lowerCaseInput);

    // If Lev dist is < 2 -OR- longest matching string >= 5, assume good answer. Test.
    return (levDist < 3 || substring > 4) ? true : false;
}


// Calculates Levenshtein Distance (num of insertions, deletions, and subs)
function levenshteinDistance(lowerCaseAnswer = "apple", lowerCaseInput = "app") {
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
function commonSubstring(s1, s2) {
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