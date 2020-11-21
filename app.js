document.addEventListener("DOMContentLoaded", () => {
    const gridDisplay = document.querySelector('.grid');
    const flagsLeft = document.querySelector('#flags-left');
    const result = document.querySelector('#result');

    let width = 10;
    let numberOfBombs = 20;
    const squares = [];
    let isGameOver = false;
    let flags = 0;


    //creating the board  **********************************************************************************************************************
    function createBoard() {
        //shuffled game array with random bombs
        const bombsArray = Array(numberOfBombs).fill('bomb');
        const emptyArray = Array(width*width - numberOfBombs).fill('valid');
        const gameArray = emptyArray.concat(bombsArray);
        const shuffledArray = gameArray.sort(() => Math.random()-0.5);


        for(let i = 0; i < width * width; i++){
            const square = document.createElement('div');
            square.setAttribute('id', i);
            square.classList.add(shuffledArray[i])
            gridDisplay.appendChild(square);
            squares.push(square);

            //normal click
            square.addEventListener('click', function(e) {
                click(square)
            })

            //control (ctrl) and left click
            square.oncontextmenu = function(e) {
                e.preventDefault();
                addFlag(square);
            }
        }

        //add number of bombs around a square  
        for(let i = 0; i < squares.length; i++){
            let total = 0;
            const isLeftEdge = (i % width === 0);            //define left edge
            const isRightEdge = (i % width === width -1);    //define right edge

            if(squares[i].classList.contains('valid')){
                if(i > 0 && !isLeftEdge && squares[i-1].classList.contains('bomb')){              //square to left
                    total++;
                }
                if(i > 9 && !isRightEdge && squares[i + 1 - width].classList.contains('bomb')){   //square to the NW (northwest) of one looking at
                    total++;
                }
                if(i > 10 && squares[i - width].classList.contains('bomb')){                      //square above
                    total++;
                }
                if(i > 11 && !isLeftEdge && squares[i - 1 - width].classList.contains('bomb')){   // square to the NE
                    total++;
                }
                if(i < 98 && !isRightEdge && squares[i + 1].classList.contains('bomb')){          // square to right
                    total++;
                }
                if(i < 88 && !isRightEdge && squares[i + 1 + width].classList.contains('bomb')){  //square to the SE
                    total++;
                }
                if(i < 89 && squares[i + width].classList.contains('bomb')){                      // square below
                    total++;
                }
                if(i < 90 && !isLeftEdge && squares[i - 1 + width].classList.contains('bomb')){   // square to SW
                    total++;
                }

                squares[i].setAttribute('data', total)
                console.log(squares[i]);
            }
        }
    };
    createBoard();

    //can add a flag with right click of the mouse  *********************************************************************************
    function addFlag(square) {
        if(isGameOver){
            return
        }
        if(!square.classList.contains('checked') && (flags < numberOfBombs)){
            if(!square.classList.contains('flag')) {
                square.classList.add('flag');
                square.innerHTML = "<img src = './images/flag.jpg' width = '40px' height='40px'>";
                flags++;
                flagsLeft.innerHTML = numberOfBombs - flags
                checkForWin();
            }
            else {
                square.classList.remove('flag');
                square.innerHTML = '';
                flags--;
                flagsLeft.innerHTML = numberOfBombs - flags;
            }
        }

    }

    //click on squares action   **************************************************************************************************
    function click(square) {
        let currentId = square.id;
        if(isGameOver) {  //checking for game over
            return
        }
        if(square.classList.contains('checked') || square.classList.contains('flag')){  // if already clicked the square or you put a flag on it
            return
        }
        if(square.classList.contains('bomb')){
            // console.log('game over')
            gameOver(square)
        }
        else {
            let total = square.getAttribute('data')
            if(total != 0) {
                square.classList.add('checked')

                // different colors for each number
                if(total == 1) {
                    square.classList.add('one');
                }
                if(total == 2) {
                    square.classList.add('two');
                }
                if(total == 3) {
                    square.classList.add('three');
                }
                if(total == 4) {
                    square.classList.add('four');
                }
                if(total == 5) {
                    square.classList.add('five');
                }
                if(total == 6) {
                    square.classList.add('six');
                }
                if(total == 7) {
                    square.classList.add('seven');
                }
                if(total == 8) {
                    square.classList.add('eight');
                }

                square.innerHTML = total
                return
            }
            checkSquare(square, currentId)
        }
        square.classList.add('checked')
    };

    //check neighboring square  ****************************************************************************************************
    function checkSquare(square, currentId){
        const isLeftEdge = (currentId % width === 0);
        const isRightEdge = (currentId % width === width-1);

        setTimeout(() => {
            if(currentId > 0 && !isLeftEdge) {          //all 0s to the left of click get revealed
                const newId = squares[parseInt(currentId) - 1].id;
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }
            if(currentId < 98 && !isRightEdge) {        //all 0s to the right of click get revealed
                const newId = squares[parseInt(currentId) + 1].id;
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }
            if(currentId > 9 && !isRightEdge) {         //all 0s to the NE of click get revealed
                const newId = squares[parseInt(currentId) + 1 - width].id;
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }
            if(currentId > 10 ) {                       //all the 0s directly above the one clicked
                const newId = squares[parseInt(currentId) - width].id;
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }
            if(currentId < 89) {                        //all the 0s directly below 
                const newId = squares[parseInt(currentId) + width].id;
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }
            if(currentId < 90 && !isLeftEdge) {         //all the 0s SE of square clicked
                const newId = squares[parseInt(currentId) - 1 + width].id;
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }
            if(currentId < 88 && !isRightEdge) {                        // all the 0s to the bottom right of square clicked
                const newId = squares[parseInt(currentId) + 1 + width].id;
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }
            if(currentId > 11 && !isLeftEdge) {                  //top left from square clicked
                const newId = squares[parseInt(currentId) - 1 - width].id;
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }
        }, 10)
    };

    // game over  ***************************************************************************************************************
    function gameOver() {
        // console.log('game over');
        result.innerHTML = 'BOOM! Game Over!'
        isGameOver = true;

        //show all the bomb locations
        squares.forEach(square => {
            if(square.classList.contains('bomb')){
                square.innerHTML = "<img src = './images/bomb.png' width='40px' height='40px' >";
            }
        })
    };

    //check for win *************************************************************************************************************
    function checkForWin(){
        let matches = 0;
        for(let i = 0; i < squares.length; i++){
            if(squares[i].classList.contains('flag') && squares[i].classList.contains('bomb')) {
                matches++;
            }
            if(matches === numberOfBombs) {
                // console.log('winner');
                result.innerHTML = 'YOU WIN!'
                isGameOver = true;
            }
        }
    };

})

