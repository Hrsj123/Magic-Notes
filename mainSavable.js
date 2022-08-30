// Creating a class to create new elements
class NewElementFrame {                                                     
    elementFrame() {
        // New Element (Outer Div)
        const NewElement = document.createElement('div');
        NewElement.classList.add('newElement', 'col-12', 'row', 'justify-content-between');
        NewElement.id = `${this.idNum}-element`;
        // Text Element (first child of New Element)
        const textElement = document.createElement('div');
        textElement.classList.add('col-11', 'border', 'rounded');
        textElement.setAttribute('ondblclick', 'textEdit(this.id)');
        textElement.innerText = `${this.idNum}: ${this.text}`;
        textElement.id = `${this.idNum}-text`;
        // Remove-btn Element (second child of New Element)
        const removeIcon = document.createElement('button');
        removeIcon.innerText = '✕';
        removeIcon.classList.add( 'rounded', 'remove-item', 'btn', 'btn-danger', 'btn-small');
        removeIcon.setAttribute('onclick', 'onClickRemoveItem(this.id)');
        removeIcon.id = `${this.idNum}-remove`;
        // Prepare the newElement
        NewElement.appendChild(textElement);
        NewElement.appendChild(removeIcon);
        return NewElement;
    }

    constructor(idNum, text) {                       
        this.idNum = idNum;
        this.text = text;
    }
}


let input = document.getElementById('input');
let submit = document.getElementById('submit');
let addArea = document.getElementById('cont');

// Record of tot. items added
let count = localStorage.getItem('count');  
if (count === null) count = 0;                   // If true means apk is running form the first time!


// To load the data saved in local storage (data may/maynot be present)
for(let i = 1; i <= count; i++) {
    let element = new NewElementFrame(i, localStorage.getItem(`${i}-text`));
    element = element.elementFrame();
    addArea.appendChild(element);
}

'Event Listner to add an item'
submit.addEventListener('click', e => {
    // Prevent page reload
    e.preventDefault();

    // Input entered!
    let inputVal = input.value;
    if (inputVal === '') return;

    // Input accepted, so increment and save count!
    count++;
    localStorage.setItem('count', count);
    input.value = '';

    // Save date in local storage
    localStorage.setItem(`${count}-text`, inputVal);

    // Create element
    let newElement = new NewElementFrame(count, inputVal);
    newElement = newElement.elementFrame();

    // Add the newElement to the page
    addArea.appendChild(newElement);
});


'Function to remove an listItem'
function onClickRemoveItem(removeId) {           
    // To store the 'numeric-part' of the id
    removeId = removeId.split('-')[0];

    // Item to be removed
    let item = document.getElementById(`${removeId}-element`);
    console.log(item);
    item.remove();
    
    // Remove item from local storage
    localStorage.removeItem(`${removeId}-text`);

    count--;
    localStorage.setItem('count', count);
    countCorrection(removeId);
}


`This function runs right after the above function to correct listCount: "After deleting a note"`
function countCorrection(eId) {
    // A for loop should be more efficient but anyway,
    Array.from(addArea.children).forEach(element => {
        if (Number(eId) < Number(element.id.split('-')[0])) {               // True if id of element is > id of deleted element
            // Change serial order
            let num = element.children[0].innerHTML.split(':')[0];
            element.children[0].innerHTML = element.children[0].innerHTML.replace(num, num-1);

            // Re-name id's of all three elements
            element.id = `${num-1}-element`;
            element.children[0].id = `${num-1}-text`;
            element.children[1].id = `${num-1}-remove`;

            // Changes in local storage
            let localVar = localStorage.getItem(`${num}-text`);             // Save the old variable's data
            localStorage.removeItem(`${num}-text`);                         // Remove the old variable
            localStorage.setItem(`${num-1}-text`, localVar);                // Crate the new variable
        }
    });
}


// EDIT TEXT
`Variables required to edit texts`
let set = 0;
let closeBtn, numId, newInputText, element, oldText;

`function to edit existing text`
function textEdit(tId) {
    if(set === 0) {
        set = 1;
        numId = tId.split('-')[0];

        // Text Element to be edited
        element = document.getElementById(tId);

        // Creating a new 'input' element
        newInputText = document.createElement('input');
        oldText = element.innerText.split(': ')[1];
        newInputText.placeholder = oldText;
        newInputText.id = 'new';
        newInputText.classList.add('col-11', 'form-control');
        
        // Removing close btn
        closeBtn = element.nextElementSibling;
        closeBtn.remove();
        
        // Replacing input into the document
        element.replaceWith(newInputText);
    }
}

`eventListner to save changes in existing text-element`
window.addEventListener('dblclick', e => {
    let boxId = `${numId}-text`;
    if(set === 1 && e.target.id !== boxId) {
        // Get input text
        let val = newInputText.value;
        if(val === '') val = oldText;
        
        // Update text in the 'text' div
        element.innerText = `${numId}: ${val}`;
        newInputText.parentNode.appendChild(closeBtn);                  
        newInputText.replaceWith(element);
        
        // changes in local storage
        localStorage.setItem(`${numId}-text`, val);
        set = 0;
    }
});

/* Improvement
It would be more efficient to save all the text data in a single element in the form of an array
So, 1) Local storage will be more organised
2) Easire to access and save changes (arr.tostring)
*/