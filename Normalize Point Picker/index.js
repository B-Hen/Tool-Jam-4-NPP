window.onload = function(){
    let input = document.querySelector("#fileInput");
    let output = document.querySelector("#fileOutput");
    let outputHolder = document.querySelector("#output-holder")

    const orignalWidth = outputHolder.getBoundingClientRect().width;
    const orignalHeight = outputHolder.getBoundingClientRect().height;

    let xPosition = document.querySelector("#x-position");
    let yPosition = document.querySelector("#y-position");

    let xNormalizedPosition = document.querySelector("#x-normalizedPosition");
    let yNormalizedPosition = document.querySelector("#y-normalizedPosition");

    let dropDown = document.querySelector("#origins");
    let  xClick, yClick, rect;

    let pointsBtn = document.querySelector("#button-holder");

    let points = [];
    //let fileStream = require('fs');

    input.addEventListener("change", function(e){
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

           outputHolder.style.height = newHeight + "px";
        }
    })

    output.addEventListener("click", function(e){
        rect = output.getBoundingClientRect();

        xClick = e.clientX;
        yClick = e.clientY;

        SetCoordinateBasedOnOrigins(xClick, yClick, rect);
    })

    dropDown.addEventListener("change", function(e){

        if(xClick != null && yClick  != null)
        {
            SetCoordinateBasedOnOrigins(xClick, yClick, rect);
        }
    })

    pointsBtn.addEventListener("click", function(e){
        console.log("point button clicked");
        points = JSON.stringify(points);
        let file = new File([points], "points.json", {
            type: "text/plain",
        });
    
        // Create a link element
        const link = document.createElement('a');
        link.style.display = 'none';
        
        // Set the download attribute and the href
        link.download = 'points.json';
        link.href = URL.createObjectURL(file);
        
        // Add the link to the DOM and simulate a click event
        document.body.appendChild(link);
        link.click();
        
        // Cleanup
        document.body.removeChild(link);
    })

    function SetCoordinateBasedOnOrigins(x, y, rect)
    {
        if(dropDown.value == "top-left")
        {
            SetCoordinateUsingTopLeftOrigins(x, y, rect);
        }
        else if(dropDown.value == "center")
        {
            SetCoordinateUsingCenterOrigins(x, y, rect);
        }
    }

    function SetCoordinateUsingTopLeftOrigins(x,y, rect){
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

        points.push({Type: "Top-Left", x: xPos, y: yPos, xNormalized: xNormPos, yNormalized: yNormPos});

        SetTextElements(xPos, yPos, xNormPos, yNormPos);
    }

    function SetCoordinateUsingCenterOrigins(x, y, rect)
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

        points.push({Type: "Center", x: xPos, y: yPos, xNormalized: xNormPos, yNormalized: yNormPos});

        SetTextElements(xPos, yPos, xNormPos, yNormPos);
    }

    function GetRoundedNumber(num)
    {
        return Math.round(((num) + Number.EPSILON) * 100) / 100;
    }

    function SetTextElements(x, y, xNormalized, yNormalized){
        xPosition.innerHTML = "X: " + x;
        yPosition.innerHTML = "Y: " + y;
        xNormalizedPosition.innerHTML = "X Normalized: " + xNormalized;
        yNormalizedPosition.innerHTML = "Y Normalized: " + yNormalized;
    }
};

