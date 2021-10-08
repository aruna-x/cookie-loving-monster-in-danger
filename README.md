# _Cookie-Loving Monster in Danger!_

#### By _**Aruna Evan and Lisa Primeaux-Redmond**_

#### _"Cookie-Loving Monster in Danger!" is an interactive trivia game. Users select a category and difficulty level to view a question and then input their answers below. Correct answers advance the blue monster toward a plate of cookies, and the game is won when he reaches his goal._

## Technologies Used

* _HTML_
* _CSS_
    * _Keyframes_
* _Javascript_
    * _Regex_
    * _Levenshtein Distance_
    * _Substring analysis_

## Description

_Use of the website begins with a welcome page including the instructions for how to play the game. Clicking the "Let's Play!" button takes the user to the game play screen._

_On the game play screen, the user can view a trivia board with five categories and question difficulty options ranging from easy to medium to hard. The trivia board pulls data from a free, public database https://jservice.io. Categories from the database are populated into the first row of the trivia board. Questions from these categories are used in the columns below based on difficulty level._

_When the user clicks on a question, the trivia board is replaced with a display of the question and an answer input section. The user can type in the answer and click the submit button. If the question is correct, the blue monster will move toward the plate of cookies. If the answer is wrong, he will move backward. The length of movement is smallest for easy questions and greatest for hard questions. The monster cannot move backward beyond the starting point. After the answer is submitted and the monster moves, the question display becomes text indicating whether the user answered correctly and a button for returning to the trivia board view to try another question. If the user successfully answers enough questions to move the monster completely across the screen to the plate of cookies, confetti falls on the screen, the trivia board and question display become a celebration view with an image of a quote about cookies and friendship, and the game is over. The page must be refreshed to play again._ 

_The full page includes the following functionality:_
* _A full page toggle between a welcome page view and a game page view_
* _The ability to view correct answers in the console log as a cheat code_

_The monster movement includes the following functionality:_
* _The blue monster moves proportionally to the question difficulty_
* _The blue monster wiggles and leans with each movement forward and backward_
* _The blue monster's arrival at the plate of cookies disables the trivia board and releases confetti on the screen_
* _The blue monster cannot go beyond the edges of his progress bar, regardless of how many questions are answered incorrectly or correctly_

_The trivia board includes the following functionality:_
 * _Pulling categories from the trivia API and ensuring that a category is not repeated on multiple columns of the trivia board_
* _Pulling questions from the trivia API based on the categories appearing in the top row of the trivia board and ensuring that a question is not repeated on multiple columns or rows of the trivia board_
* _Analyzing numeric values for difficulty level in the trivia API, converting those values to a numeric range, and assigning questions within those ranges to easy, medium, and hard levels on the trivia board_
* _Toggling view of multiple div sections based on use case in the game_

_The question input section includes string analysis to recognize correct answers in the following common API/user-input conflict cases when those conflicts do not affect the accuracy of the answer:_
* _Text formatting or HTML snippets in some API answers_
    * <i>Hamlet</i> vs Hamlet
* _Punctuation differences_
    * _Little Rock, Arkansas vs Little Rock Arkansas_
    * _212° Fahrenheit vs 212 degrees Fahrenheit_
* _Common misspellings or typos_
    * _piece vs peice_
* _Partial answer text_
    * _Pablo Picasso vs Picasso_
* _Variations of common abbreviations_
    * _Mt. Kenya vs Mount Kenya_
* _Variations in number_
    * _octopi vs octopus_
* _Use of articles: a, and, the_
    * _the Federalist Papers vs Federalist Papers_

## Setup/Installation Requirements

* _Internet access_
* _A web browser such as Chrome or Safari_
* _Use of mouse and keyboard_

## Known Bugs

* _Confetti does not fall on the full screen if developer tools are opened in the window._

## License

_"Cookie-Loving Monster in Danger!" is not affiliated with Jeopardy! or Sesame Street._ 

