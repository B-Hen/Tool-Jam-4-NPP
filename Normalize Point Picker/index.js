window.onload = function(){
    let input = document.querySelector("#fileInput");
    let output = document.querySelector("#fileOutput");
    let outputHolder = document.querySelector("#output-holder");

    const orignalWidth = outputHolder.getBoundingClientRect().width;
    const orignalHeight = outputHolder.getBoundingClientRect().height;

    let dropDown = document.querySelector("#origins");
    let  xClick, yClick, rect;

    let savePointsBtn = document.querySelector("#save-points");
    let resetBtn = document.querySelector("#reset");

    let topLeftTable = document.querySelector("#Top-Left-Origins");
    let centerTable = document.querySelector("#Center-Origins");

    centerTable.style.display = "none";

    let topLeftPoints = [];
    let centerPoints = [];

    input.addEventListener("change", function(e){
        ResetPoints();
        output.src = URL.createObjectURL(e.target.files[0]);

        output.onload = function()
        {
           let parentWidth = orignalWidth;
           let parentHeight = orignalHeight;

           let aspectRatio = output.naturalWidth / output.naturalHeight;

           let newWidth = parentWidth;
           let newHeight = parentWidth / aspectRatio;

           if(newHeight > parentHeight){
            newHeight = parentHeight;
            newWidth = parentHeight * aspectRatio;
           }

           output.style.width = newWidth + "px";
           output.style.height = newHeight + "px";
           output.style.border = "2px solid #7D4F50"

           outputHolder.style.height = newHeight + "px";
        }
    })

    output.addEventListener("click", function(e){
        rect = output.getBoundingClientRect();

        xClick = e.clientX;
        yClick = e.clientY;

        SetCoordinateBasedOnOrigins(xClick, yClick, rect, true);
    })

    dropDown.addEventListener("change", function(e){

        if(xClick != null && yClick  != null)
        {
            SetCoordinateBasedOnOrigins(xClick, yClick, rect, false);
        }
    })

    savePointsBtn.addEventListener("click", function() {

        if(dropDown.value == "top-left"){
            DownloadPoints(topLeftPoints, "topLeftOriginsPoints.json");
        }
        else if(dropDown.value == "center"){
            DownloadPoints(centerPoints, "centerOriginsPoints.json");
        }

    });
    
    resetBtn.addEventListener("click", function() {
        ResetPoints();
    });

    function ResetPoints()
    {
        topLeftPoints = [];
        centerPoints = [];

        for(let i = topLeftTable.rows.length - 1; i > 0; i--){
            topLeftTable.deleteRow(i);
            centerTable.deleteRow(i);
        }
    }

    function DownloadPoints(pointList, name)
    {
        points = JSON.stringify(pointList);
        let file = new File([points], name, {
            type: "text/plain",
        });
    
        // Create a link element
        const link = document.createElement('a');
        link.style.display = 'none';
        
        // Set the download attribute and the href
        link.download = name;
        link.href = URL.createObjectURL(file);
        
        // Add the link to the DOM and simulate a click event
        document.body.appendChild(link);
        link.click();
        
        // Cleanup
        document.body.removeChild(link);
    }

    function SetCoordinateBasedOnOrigins(x, y, rect, value)
    {
        if(dropDown.value == "top-left")
        {
            SetCoordinateUsingTopLeftOrigins(x, y, rect, value);
            SetCoordinateUsingCenterOrigins(x, y, rect, value);
            topLeftTable.style.display = "block";
            centerTable.style.display = "none";
        }
        else if(dropDown.value == "center")
        {
            SetCoordinateUsingCenterOrigins(x, y, rect, value);
            SetCoordinateUsingTopLeftOrigins(x, y, rect, value);
            topLeftTable.style.display = "none";
            centerTable.style.display = "block";
        }
    }

    function SetCoordinateUsingTopLeftOrigins(x,y, rect, changeValue){
        let xPos = (x - rect.left);
        let yPos = (y - rect.top);

        if(xPos < 0) xPos = 0;
        if(xPos > rect.width) xPos = rect.width;
        if(yPos < 0) yPos = 0;
        if(yPos > rect.height) yPos = rect.height;

        xPos = GetRoundedNumber(xPos);
        yPos = GetRoundedNumber(yPos);

        let xNormPos = GetRoundedNumber((x - rect.left) / rect.width);
        let yNormPos = GetRoundedNumber((y - rect.top) / rect.height);

        if(changeValue == false) return;

        AddRowToTable(xPos,yPos,xNormPos,yNormPos,topLeftTable);
        topLeftPoints.push({x: xPos, y: yPos, xNormalized: xNormPos, yNormalized: yNormPos});
    }

    function SetCoordinateUsingCenterOrigins(x, y, rect, changeValue)
    {
        let xPos = (x - rect.left) - (rect.width/2);
        let yPos = -((y - rect.top) - (rect.height/2));

        if(xPos < -(rect.width/2)) xPos = -(rect.width/2);
        if(xPos > (rect.width/2)) xPos = (rect.width/2);
        if(yPos < -(rect.height/2)) yPos = -(rect.height/2);
        if(yPos > (rect.height/2)) yPos = (rect.height/2);

        xPos = GetRoundedNumber(xPos);
        yPos = GetRoundedNumber(yPos);

        let xNormPos = GetRoundedNumber(((x - rect.left) - (rect.width/2)) / (rect.width/2));
        let yNormPos = -GetRoundedNumber(((y - rect.top) - (rect.height/2)) / (rect.height/2));

        if(changeValue == false) return;

        AddRowToTable(xPos,yPos,xNormPos,yNormPos,centerTable);
        centerPoints.push({x: xPos, y: yPos, xNormalized: xNormPos, yNormalized: yNormPos});
    }

    function GetRoundedNumber(num)
    {
        return Math.round(((num) + Number.EPSILON) * 100) / 100;
    }

    function AddRowToTable(x, y, normalizedX, normalizedY, table)
    {
        let row = table.insertRow(1);
        let cell1 = row.insertCell(0);
        let cell2 = row.insertCell(1);
        let cell3 = row.insertCell(2);
        let cell4 = row.insertCell(3);
        let cell5 = row.insertCell(4);

        cell1.innerHTML = x;
        cell2.innerHTML = y;
        cell3.innerHTML = normalizedX;
        cell4.innerHTML = normalizedY;
        
        let button = document.createElement("button");
        button.textContent = "X";
    
        button.value = table.rows.length - 2;
    
        button.addEventListener("click", function() {
            let rowIndex = this.parentNode.parentNode.rowIndex;  
            table.deleteRow(rowIndex);

            if(table == topLeftTable){
                centerTable.deleteRow(rowIndex);
            }
            else if(table == centerTable){
                topLeftTable.deleteRow(rowIndex);
            }

            //remove point from array
            if(topLeftPoints.length == 1 && centerPoints.length == 1){
                topLeftPoints = [];
                centerPoints = [];
            }
            else{
                topLeftPoints.splice(topLeftTable.rows.length - rowIndex, 1);
                centerPoints.splice(centerTable.rows.length - rowIndex, 1);
            }
        });

        cell5.appendChild(button);
    }
};

