var numOfPros = 0;
var numOfContras = 0;
var root = new Argument(); 
var parent = root;
var rootExists = false;
var debateStarted = false;
var maxLevel = 0;


function Argument(parent, arg, position, isPro) {
    if (arguments.length === 0 && !rootExists) {
        this.parent = null;
        this.arg = '';
        this.subTreePro = [];
        this.subTreeContra = [];
        this.element = null;
        rootExists = true;
        this.level = 0;
        this.overviewElement = document.querySelector(".overviewIcon");
    } else if (!(parent instanceof Argument) || typeof arg !== 'string') {
        throw new TypeError('invalid Arguments. Expected parent must be an Argument and arg must be a String');
    } else {
        this.parent = parent;
        this.arg = arg;
        this.subTreePro = [];
        this.subTreeContra = [];
        this.element = null;
        this.positionAtParent = position;
        this.isPro = isPro;
        this.level = parent.level + 1;
        this.overviewElement = null;
    }
}

function minimapIcon(arg, ele) {
    this.arg = arg;
    this.element = ele;
    this.element.onclick = function() {dive(arg)};
}

function ButtonPanel(container, arg) {
    this.buttonWrapper = document.createElement("div");
    this.buttonWrapper.classList.add("buttonWrapper");
    container.appendChild(this.buttonWrapper);
    
    
    this.editButton = document.createElement("div");
    //this.editButton.classList.add("editButton");
    this.editButton.classList.add("argButtons");
    this.buttonWrapper.appendChild(this.editButton);
    const editIcon = document.createElement('img');
    editIcon.classList.add("editIcon");
    editIcon.src = "/images/edit.svg";
    editIcon.alt = "editIcon";
    this.editButton.appendChild(editIcon);
    this.editButton.addEventListener("click", function(event) {
        event.stopPropagation();
        editArgument(arg);
    })

    this.deleteButton = document.createElement("div");
    //this.deleteButton.classList.add("deleteButton");
    this.deleteButton.classList.add("argButtons");
    this.buttonWrapper.appendChild(this.deleteButton);
    const deleteIcon = document.createElement('img');
    deleteIcon.classList.add("deleteIcon");
    deleteIcon.src = "/images/delete.svg";
    deleteIcon.alt = "deleteIcon";
    this.deleteButton.appendChild(deleteIcon);
    this.deleteButton.addEventListener("click", function(event) {
        event.stopPropagation();
        deleteArgument(arg);
    })
}

function editArgument(arg) {
    //arg.element.classList.add("hidden");
    //arg.element.style.display = "none";
    //arg.element.classList.remove("flex");
    arg.element.children[1].style.visibility = "hidden";
    let input = document.createElement("textarea");
    input.classList.add("edit-field");
    input.innerHTML = arg.arg;
    arg.element.appendChild(input);

    input.focus();
    input.onkeydown = function(event) {
        if (event.which == 13) {
            event.preventDefault();
            var newText = input.value;
            // if enter was pressed safe the input under argText
            // this should be replaced at some point with a button
            if (input.value == "") {
                alert("this can not be empty")
                //cancel input -> needs to be done
                return;
                //go back if nothing was written
            }
            input.remove();
            arg.element.firstChild.innerHTML = newText;
            arg.element.children[1].style.visibility = "visible";
            /*arg.element.classList.remove("hidden");
            arg.element.classList.add("flex");
            arg.element.style.display = "flex";*/
        }
    }
}

function deleteArgument(arg) {
    if (arg.isPro) {
        delete arg.parent.subTreePro[arg.positionAtParent]
        arg.element.remove();
        arg.overviewElement.remove();
    } else {
        delete arg.parent.subTreeContra[arg.positionAtParent]
        arg.element.remove();
        arg.overviewElement.remove();
    }
    
}

function startDebate() {
    if (debateStarted == false) {
        //create input element
        const head = document.getElementById("head");
        const textbox = document.createElement("textarea");
        const headContainer = document.createElement("head-Container");
        debateStarted = true;
        textbox.className = "headTextbox";
        textbox.type = "text";
        head.innerHTML = "";
        head.appendChild(textbox);
        head.classList.remove("headhover");
        textbox.focus();

        //reading input on pressing enter
        textbox.onkeydown = function(event) {
            if (event.which == 13) {
                event.preventDefault();
                var input = textbox.value;
                if (textbox.value == "") {
                    alert("this can not be empty")
                    return;
                }
                textbox.remove();
                var allArgContainer = document.getElementById("allArgsContainer");
                document.getElementById("PC-Container").style.display = "flex";
                //document.getElementById("addButton").style.display = "flex";
                head.innerHTML = input;
                root.arg = input;
                parent = root;
                root.element = allArgContainer;
            }
        }
    }
}

function createTextPro() {
    if(parent.subTreePro.length >= 15) {
        alert("reached maximum amount of arguments on this side")
        return;
    }
    
    // getters
    var proContainer = document.getElementById("proContainer");
    var proButton = document.getElementById("proButton");
    var contraButton = document.getElementById("contraButton");
    // -----
    // create input element
    let input = document.createElement("textarea");
    input.classList.add("input-field");
    proContainer.appendChild(input);
    // -----
    //hide add button
    proButton.style.visibility = "hidden";
    contraButton.style.visibility = "hidden";
    // -----
    // enter input and save it
    input.focus();
    input.onkeydown = function(event) {
        if (event.which == 13) {
            event.preventDefault();
            var argText = input.value;
            // if enter was pressed safe the input under argText
            // this should be replaced at some point with a button
            if (input.value == "") {
                alert("this can not be empty")
                //cancel input -> needs to be done
                return;
                //go back if nothing was written
            }
            input.remove();
            proButton.style.visibility = "visible";
            contraButton.style.visibility = "visible";
            //create argument
            let arg = new Argument(parent, argText, numOfPros, true); 
            parent.subTreePro[numOfPros] = arg; 

            //display args

            var argWrapper = document.createElement("div");
            argWrapper.classList.add("argWrapper");
            argWrapper.classList.add("card");
            argWrapper.classList.add("flex");
            argWrapper.addEventListener("click", function() {
                dive(arg);
            })
            proContainer.appendChild(argWrapper);
            let textContainer = document.createElement("div");
            textContainer.classList.add("textContainer");
            argWrapper.appendChild(textContainer);
            textContainer.innerHTML = arg.arg;
            argWrapper.style.name = "argWrap" + numOfPros;
            arg.element = argWrapper;
            new ButtonPanel(argWrapper, arg);
            numOfPros++;
            
            //create icons for overview
            let overviewIcon = document.createElement("div");
            overviewIcon.classList.add("overviewIconPro");
            overviewIcon.style.borderColor = "green";
            overviewIcon.addEventListener("click", function() {
                dive(arg);
            })
            let overviewContainer = document.querySelector(".overviewContainer");
            let levelContainers = overviewContainer.children;
            levelContainers[parent.level].children[0].appendChild(overviewIcon);
            arg.overviewElement = overviewIcon;
        }
    } 
}

function createTextContra() {
    if(parent.subTreePro.length >= 15) {
        alert("reached maximum amount of arguments on this side")
        return;
    }
    var contraContainer = document.getElementById("contraContainer");
    var proButton = document.getElementById("proButton");
    var contraButton = document.getElementById("contraButton");
    // -----
    // create input element
    let input = document.createElement("textarea");
    input.classList.add("input-field");
    contraContainer.appendChild(input);
    // -----
    //hide add button
    proButton.style.visibility = "hidden";
    contraButton.style.visibility = "hidden";
    // -----
    // enter input and save it
    input.focus();
    input.onkeydown = function(event) {
        if (event.which == 13) {
            event.preventDefault();
            var argText = input.value;
            // if enter was pressed safe the input under argText
            // this should be replaced at some point with a button
            if (input.value == "") {
                alert("this can not be empty")
                //cancel input -> needs to be done
                return;
                //go back if nothing was written
            }
            input.remove();
            proButton.style.visibility = "visible";
            contraButton.style.visibility = "visible";
            //create argument
            let arg = new Argument(parent, argText, numOfContras, false); 
            parent.subTreeContra[numOfContras] = arg; 

            var argWrapper = document.createElement("div");
            argWrapper.classList.add("argWrapper");
            argWrapper.classList.add("card");
            argWrapper.classList.add("flex");
            argWrapper.addEventListener("click", function() {
                dive(arg);
            })
            contraContainer.appendChild(argWrapper);
            let textContainer = document.createElement("div");
            textContainer.classList.add("textContainer");
            argWrapper.appendChild(textContainer);
            textContainer.innerHTML = arg.arg;
            argWrapper.style.name = "argWrap" + numOfContras;
            arg.element = argWrapper;
            new ButtonPanel(argWrapper, arg);
            numOfContras++;

            //create icons for overview
            let overviewIcon = document.createElement("div");
            overviewIcon.classList.add("overviewIconContra");
            overviewIcon.style.borderColor = "red";
            overviewIcon.addEventListener("click", function() {
                dive(arg);
            })
            let overviewContainer = document.querySelector(".overviewContainer");
            let levelContainers = overviewContainer.children;
            levelContainers[parent.level].children[1].appendChild(overviewIcon);
            arg.overviewElement = overviewIcon;
        }
    } 
}

function dive(arg) {
    //make new container
    if(arg.level == parent.level + 1 && arg.level > maxLevel) {
        maxLevel++;
        let overviewContainer = document.querySelector(".overviewContainer");
        let levelContainer = document.createElement("div");
        levelContainer.classList.add("overviewLevel");
        let rightSide = document.createElement("div");
        let leftSide = document.createElement("div");
        rightSide.classList.add("rightSide");
        leftSide.classList.add("leftSide");
        levelContainer.appendChild(leftSide);
        levelContainer.appendChild(rightSide);
        overviewContainer.appendChild(levelContainer);
    }
    //make argument new parent
    parent = arg;
    let head = document.getElementById("head");
    head.textContent = arg.arg;
    //delete html elements of arguments
    let proC = document.getElementById("proContainer");
    let contraC = document.getElementById("contraContainer");
    proC.innerHTML = '';
    contraC.innerHTML = '';
    //reset counters
    numOfPros = arg.subTreePro.length;
    numOfContras = arg.subTreeContra.length;
    displayArgs();
    // highlight new parent
    parent.overviewElement.style.borderWidth = "3px";
    parent.overviewElement.style.transform = "scale(1.1)";
}

function displayArgs() {
    for(let i = 0; i < parent.subTreePro.length; i++) {
        let arg = parent.subTreePro[i];
        var argWrapper = document.createElement("div");
        argWrapper.classList.add("argWrapper");
        argWrapper.classList.add("card");
        argWrapper.classList.add("flex");
        argWrapper.addEventListener("click", function() {
            dive(arg);
        })
        proContainer.appendChild(argWrapper);
        let textContainer = document.createElement("div");
        textContainer.classList.add("textContainer");
        argWrapper.appendChild(textContainer);
        textContainer.innerHTML = arg.arg;
        argWrapper.style.name = "argWrap" + numOfPros;
        arg.element = argWrapper;
        new ButtonPanel(argWrapper, arg);
        numOfPros++;
    }
    for(let j = 0; j < parent.subTreeContra.length; j++) {
        let arg = parent.subTreeContra[j];
        var argWrapper = document.createElement("div");
        argWrapper.classList.add("argWrapper");
        argWrapper.classList.add("card");
        argWrapper.classList.add("flex");
        argWrapper.addEventListener("click", function() {
            dive(arg);
        })
        contraContainer.appendChild(argWrapper);
        let textContainer = document.createElement("div");
        textContainer.classList.add("textContainer");
        argWrapper.appendChild(textContainer);
        textContainer.innerHTML = arg.arg;
        argWrapper.style.name = "argWrap" + numOfContras;
        arg.element = argWrapper;
        new ButtonPanel(argWrapper, arg);
        numOfContras++;
    }
}

function backToRoot() {
        contraContainer.innerHTML = savedArgs;
        document.getElementById("head").innerHTML = oriHead;
        var miniHead = document.getElementById("miniHead");
        miniHead.remove();
}