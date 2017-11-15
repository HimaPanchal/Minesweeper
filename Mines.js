
var maxRow;//variables for maximun number of Rows 
var maxCol;//variables for maximum number of Columns,
var numMines;//variables for maximum number of Mines
var cellArray = [];//array of CellArray for the grid
var exposed = 1;//the number of snapshot cells to keep track of for a win
var gameLost = false;//flag to check if the game is over or not
var validGridSize = true;//flag for acceptable gridsize values


/*
 * Method:          NewGame
 * Arguments:       void
 * Returns:         void
 * Description:     starts a new game with the number of 
 *                  rows and columns given by the User in the textbox
 */

function NewGame()
{

    //make sure starting values are validGridSize
    Validate();
    if (!validGridSize)
        alert('You must enter proper numbers for the grid size');
    else
    {
        exposed = 1;
        cellArray = [];
        gameLost = false;
        document.getElementById("status").value = "";
        
        //get the row and column values the user entered in a textbox
        maxRow = parseInt(document.getElementById("rows").value);
        maxCol = parseInt(document.getElementById("cols").value);

        //the number of mines will always be the 20% of the number of cells 
        numMines = parseInt(maxRow * maxCol * .1);
        for (var row = 0; row < maxRow; ++row)
        {
            //create an array at each row to create a 2D array
            cellArray.push([]);
            
            //Go through the columns
            for (var col = 0; col < maxCol; ++col)
            {
                //create a new cell
                cellArray[row].push(new Cell(row, col));
                
                //turnoff display
                cellArray[row][col].display = false;
                
                //set mines and mine count to 0 (these will be changed later)
                cellArray[row][col].mine = false;
                
                cellArray[row][col].count = 0;
               
            }
        }
        
        AddMines();//add the mines

        NewGrid();//initialize a new grid
        
        BindGrid(); //bind individual functions to the cells

         AssignValues();//assign the count of the number of adjacent mines
    }
}

/*
 * Method:      window.onload
 * Arguments:   null
 * Returns:     void
 * Description: Start the game;
 *              Load onclick for number of rows and cols in game grid 
 *              and Refresh button
 */

window.onload = function ()
{
    NewGame();
    //bind the Refresh button to the NewGame function
    document.getElementById("Refresh").onclick = NewGame;
    //set the initial values for rows and columns to 5
    document.getElementById("rows").value = 8;
    document.getElementById("cols").value = 8;
};


/*
 * Method:      window.onload
 * Arguments:   null
 * Returns:     void
 * Description: validGridSize ate the numbers
 *              in the text boxes
 */

function Validate()
{
    validGridSize = true;
    var row = parseInt(document.getElementById("rows").value);
    var col = parseInt(document.getElementById("cols").value);
    
    //if the value for rows is > 20, < 4, or not a number, then validGridSize is false
    if (isNaN(row) || row > 20 || row < 4)
        validGridSize = false;

    //if the value for cols is > 20, < 4, or not a number, then validGridSize is false
    if (isNaN(col) || col > 20 || col < 4)
        validGridSize = false;
}


/*
 * Method(Class):    Cell
 * Arguments:        r - row number;
 *                   c - column number
 * Returns:          void
 * Description:      Class object Cell(button),this is the main object in the game, 
 *                   it is used to contain either a mine, a blank space, or an integer representing
 *                   the number of mines nearby
 */

function Cell(r, c) {
    //the row and column position of the cell


    //integer representing whether or not the cell is a flag(1 if yes, 0 if no)


    this.count;      // number of adjacent mines 

    this._setFlag;//a flag for non-mine cells used to ensure the recursive Check() function does not carry on in an endless loop


    this.row = r;//row number

    this.col = c;//column number
    //flag for whether or not to display the cell

    this.display = false; //false for all at game start, 

    this.mine = false;      //check if it is a mine or not

}
/*
 * Method:          ShowGrid
 * Arguments:       void
 * Returns:         void
 * Description:     Create game grid table. 
 *                  Each button is assigned with id "row_col".Go through the cells and display all cells 
 *                  that have the display member set to true,
 *                   it is also use to check for a win by counting the number of exposed cells.
 */

function ShowGrid()
{

    exposed = 0;//reset the snapshot cells value

    //go through the grid and snapshot all cells that have the display flag set to true
    for (var row = 0; row < maxRow; ++row)
        for (var col = 0; col < maxCol; ++col)
        {
            exposed += cellArray[row][col].Show();
        }

    CheckWinner();//check for a win by counting the number of snapshot cells
}

/*
 * Method:          BindGrid
 * Arguments:       void
 * Returns:         void
 * Description:     Assign values to the array and calls the Bind member function to
 *                 the Bind to the cell
 */

function BindGrid()
{
    //Go through the rows
    for (var row = 0; row < maxRow; ++row)
    {
        //Go through the columns
        for (var col = 0; col < maxCol; ++col)
        {
            cellArray[row][col].Bind();
        }
    }
}


/*
 * Method(for Class):    Cell.prototype.Show
 * Arguments:            void
 * Returns:              Will be used to check if all cells are exposed;
 *                       if yes, the user wins
 *                       1 - cell is not exposed
 *                       0 - cell is exposed
 * Description:          Show Cell(button) object in game grid
 *                       Checking the cell and determine to show it, flag it, Shift Click it(X it)
 */

Cell.prototype.Show = function () {

    var ID = 'row-' + this.row + '-col-' + this.col;

    //if the display is turned off, we check to see if the user has chosen
    //to set a flag
    if (this.display === false)
    {
        //if the shift key was pressed (setFlag member is true) mark the cell with an X. 
        if (this._setFlag)
            document.getElementById(ID).innerHTML = 
                '<img src="images/flag.png" alt=""/ width="30px" height="35px">';
        //otherwise keep it blank
        else
            document.getElementById(ID).innerHTML = '';
        return 1;
    }
    
    // pressed normally
    else
    {
       
        document.getElementById(ID).style.backgroundColor = "white"; //set the default background to white
       
        if (this.count > 0) //if there are any adjacent mines
            
            
            
            document.getElementById(ID).innerHTML = this.count;//Show the number of mines on the cell
        
        else if (this.mine)//if the cell is a mine
        {
            
            document.getElementById(ID).style.backgroundColor = "red";//set the background of cell to red by styling
           
            document.getElementById(ID).innerHTML =
                    '<img src="images/mine.png" alt="" width="30px" height="35px">';//image for mine
        }
        
        else
            document.getElementById(ID).innerHTML = '';//otherwise keep the cell blank
        return 0;
    }
};

/*
 * Method(for Class):    Cell.prototype.Bind
 * Arguments:            void
 * Returns:              void
 * Description:          Gets the rows and and uses it to attach the anonymous function that will
 *                       assign the functionality to the cell
 */

Cell.prototype.Bind = function ()
{
    //created the cell ID
    var row = this.row;
    var col = this.col;
    var cellID = 'row-' + this.row + '-col-' + this.col;
   
    document.getElementById(cellID).onclick = function (event)
    {
        if (exposed === 0 || gameLost)
            return;
        
        //check if the shift key pressed and that the cell not been displayed yet
        if (event.shiftKey && !cellArray[row][col].display)
        {
            
            if (cellArray[row][col]._setFlag)
                cellArray[row][col]._setFlag = false;
           
            else
            {
                cellArray[row][col]._setFlag = true;
                
                document.getElementById(cellID).style.fontSize = "35px";
            }
        }
      
        else
        {
            document.getElementById(cellID).style.fontSize = "12px";
            cellArray[row][col].display = true;
            Check(row, col);
            if (cellArray[row][col].mine) 
            {
              
                console.log('You Lose!');
                document.getElementById("status").value = "You LOSE!";
                document.getElementById("status").style.color = "red";

                //set the game lost flag
                gameLost = true;
            }
        }
        ShowGrid();
    };
};


/*
 * Method:          NewGrid
 * Arguments:       void
 * Returns:         void
 * Description:     Go through the cells and display all  the cells that have the display member set to true,
 *                  it is also use to check for a win by counting the number of exposed cells.
 */

function NewGrid()
{
    var tableHtml = '<table id="Grid">';

    for (var row = 0; row < maxRow; ++row)
    {
        tableHtml += '<tr>';
        for (var col = 0; col < maxCol; ++col)
        {
            tableHtml += '<td><button type="button" id="row-' +
                    row + '-col-' + col + '"></button></td>';
        }
        tableHtml += '</tr>';
    }
    tableHtml += '</table>';

    document.getElementById("board").innerHTML = tableHtml;
}


/*
 * Method:          RandomCell
 * Arguments:       void
 * Returns:         Cell object - random cell from Cell array
 * Description:     Search random cell with random  numbers for row 
 *                  and random column 
 */

function RandomCell()
{
    var row = parseInt(Math.random() * maxRow);
    var col = parseInt(Math.random() * maxCol);
    return cellArray[row][col];
}


/*
 * Method:          CountClose
 * Arguments:       row - row number
 *                  col - column number
 * Returns:         mineCount - number of mines around this cell
 * Description:     Go through the cells and display all cells that have 
 *                  the display member set to true,
 *                  it is also use to check for a win by counting the number of exposed cells.
 */

function CountClose(row, col)
{
   
    // mine to the total mine count
    var mineCount = 0;

    //top left
    if (row - 1 >= 0 && col - 1 >= 0)
        if (cellArray[row - 1][col - 1].mine)
            mineCount++;

    //top
    if (row - 1 >= 0)
        if (cellArray[row - 1][col].mine)
            mineCount++;

    //top right
    if (row - 1 >= 0 && col + 1 < maxCol)
        if (cellArray[row - 1][col + 1].mine)
            mineCount++;

    //right
    if (col + 1 < maxCol)
        if (cellArray[row][col + 1].mine)
            mineCount++;

    //bottom right
    if (row + 1 < maxRow && col + 1 < maxCol)
        if (cellArray[row + 1][col + 1].mine)
            mineCount++;

    //bottom
    if (row + 1 < maxRow)
        if (cellArray[row + 1][col].mine)
            mineCount++;

    //bottom left
    if (row + 1 < maxRow && col - 1 >= 0)
        if (cellArray[row + 1][col - 1].mine)
            mineCount++;

    //left
    if (col - 1 >= 0)
        if (cellArray[row][col - 1].mine)
            mineCount++;

    return mineCount;
}

/*
 * Method:          AddMines
 * Arguments:       void
 * Returns:         void
 * Description:     Adding Mines randomly before-hand
 */

function AddMines()
{
    var count = 0;
    while (count < numMines) {
        var randomCell = RandomCell();

        if (!randomCell.mine)
        {
            cellArray[randomCell.row][randomCell.col].mine = true;
            count++;
        }
    }
}

/*
 * Method:          AssignValues
 * Arguments:       void
 * Returns:         void
 * Description:     Assigns the value by going through the rows and columns
 *                  using Count Close
 */

function AssignValues()
{
    for (var row = 0; row < maxRow; ++row)
    {
        for (var col = 0; col < maxCol; ++col)
        {
            if (!cellArray[row][col].mine)
                cellArray[row][col].count = CountClose(row, col);
        }
    }
}


/*
 * Method:          Check
 * Arguments:       row- row number
 *                  col - column number
 * Returns:         void
 * Description:     Check to expose this cell and its 8 adjacent cells
 *                  using recursion
 *                  until reaches boundary or cells with count value
 */

function Check(row, col) {

    //check to see if the cell is either out of bounds or is a mine
    if (row < 0 || row >= cellArray.length || col < 0 || col >= cellArray[0].length)
        return;
    else if (cellArray[row][col].mine)
        return;
    else if (cellArray[row][col].count > 0)
    {
        Activate(row, col);
        return;
    }
    Activate(row, col);

   
    //top 
    if (row - 1 >= 0 && !cellArray[row - 1][col].display)
        Check(row - 1, col);

    //right
    if (col + 1 < maxCol && !cellArray[row][col + 1].display)
        Check(row, col + 1);

    //bottom
    if (row + 1 < maxRow && !cellArray[row + 1][col].display)
        Check(row + 1, col);

    //left
    if (col - 1 >= 0 && !cellArray[row][col - 1].display)
        Check(row, col - 1);
    //top left
    if (row - 1 >= 0 && col - 1 >= 0 && !cellArray[row - 1][col - 1].display)
        Check(row - 1, col - 1);

    //bottom right
    if (row + 1 < maxRow && col + 1 < maxCol && !cellArray[row + 1][col + 1].display)
        Check(row + 1, col + 1);

    //bottom left 
    if (row + 1 < maxRow && col - 1 >= 0 && !cellArray[row + 1][col - 1].display)
        Check(row + 1, col - 1);

    //top right
    if (row - 1 >= 0 && col + 1 < maxCol && !cellArray[row - 1][col + 1].display)
        Check(row - 1, col + 1);

}

/*
 * Method:          Activate
 * Arguments:       row - row number
 *                  col - column number
 * Returns:         void
 * Description:     Check whether display is true or not
 */

function Activate(row, col)
{
    if (cellArray[row][col].mine)
        return;
    cellArray[row][col].display = true;
}


/*
 * Method:          CheckWinner
 * Arguments:       void
 * Returns:         void
 * Description:     Check whether Winner or not,if winner then applying styling
 */

function CheckWinner()
{
    
   
    if (gameLost === false &  exposed === (numMines))
    {
        
        //console.log("You Win!");
        document.getElementById("status").value = "You WIN!";
        document.getElementById("status").style.cssText = "larger";
        document.getElementById("status").style.color = "blue";
        
        for (var row = 0; row < maxRow; ++row)
        {
            for (var col = 0; col < maxCol; ++col)
            {
                if (cellArray[row][col].mine) {
                    cellArray[row][col].display = true;
                    cellArray[row][col].Show();
                }
            }
        }
        exposed = 0;
    }
}